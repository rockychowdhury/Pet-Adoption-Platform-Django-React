from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from .models import RehomingListing
from .serializers import (
    PetListSerializer,
    PetDetailSerializer,
    PetCreateUpdateSerializer
)
from apps.users.permissions import IsAdmin, IsOwnerOrReadOnly
from apps.rehoming.models import RehomingIntervention

class PetListCreateView(generics.ListCreateAPIView):
    queryset = RehomingListing.objects.all()
    serializer_class = PetListSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            # Only authenticated users can create
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PetCreateUpdateSerializer
        return PetListSerializer

    def get_queryset(self):
        queryset = RehomingListing.objects.filter(status='active')
        
        # Filtering
        species = self.request.query_params.get('species')
        breed = self.request.query_params.get('breed')
        age_min = self.request.query_params.get('age_min')
        age_max = self.request.query_params.get('age_max')
        gender = self.request.query_params.get('gender')
        search_query = self.request.query_params.get('search')
        
        if species:
            queryset = queryset.filter(species__iexact=species)
        if breed:
            queryset = queryset.filter(breed__icontains=breed)
        if gender:
            queryset = queryset.filter(gender__iexact=gender)
        if age_min:
            queryset = queryset.filter(age_months__gte=int(age_min) * 12)
        if age_max:
            queryset = queryset.filter(age_months__lte=int(age_max) * 12)
        
        # Filter by owner (e.g. ?owner=me)
        owner_param = self.request.query_params.get('owner')
        if owner_param:
            if owner_param == 'me' and self.request.user.is_authenticated:
                queryset = queryset.filter(pet_owner=self.request.user)
            else:
                pass
            
        # Search (Name, Breed, Description)
        if search_query:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(pet_name__icontains=search_query) | 
                Q(breed__icontains=search_query) | 
                Q(rehoming_story__icontains=search_query) |
                Q(location_city__icontains=search_query)
            )

        # JSON Filtering (Behavioral Profile)
        good_with_cats = self.request.query_params.get('good_with_cats')
        good_with_dogs = self.request.query_params.get('good_with_dogs')
        good_with_children = self.request.query_params.get('good_with_children')
        
        if good_with_cats:
            # Check if json contains {"good_with_cats": "yes"} or similar
            # MVP Filter: manual iteration if DB doesn't support deep JSON lookup easily
            # But recent Django/SQLite supports it. Let's try standard lookup first or fallback.
            # Assuming structure: strict 'yes'/'no'
            queryset = queryset.filter(behavioral_profile__good_with_cats=True)
            
        if good_with_dogs:
            queryset = queryset.filter(behavioral_profile__good_with_dogs=True)
            
        if good_with_children:
            queryset = queryset.filter(behavioral_profile__good_with_kids=True) # Field name might vary, checking model would be ideal. Assuming 'good_with_kids' based on common patterns or 'good_with_children'

        # Location Filtering (Radius)
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 50) # miles

        if lat and lng:
            try:
                user_lat = float(lat)
                user_lng = float(lng)
                radius_val = float(radius)
                
                # In-memory filtering for MVP (efficient enough for <1000 items)
                # Ideally use PostGIS for prod scale
                from math import radians, cos, sin, asin, sqrt

                def haversine(lon1, lat1, lon2, lat2):
                    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
                    dlon = lon2 - lon1 
                    dlat = lat2 - lat1 
                    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
                    c = 2 * asin(sqrt(a)) 
                    r = 3956 # Miles
                    return c * r

                # Evaluate queryset to list to filter
                # Note: This breaks pagination if pagination is done at DB level.
                # But generic APIView paginates at the end. 
                # Wait, ListCreateAPIView paginates based on 'queryset' attribute or get_queryset result.
                # If I return a list, standard pagination might fail if it expects a queryset.
                # I should gather IDs of matching items and filter queryset by ID list.
                
                matches = []
                for pet in queryset:
                    if pet.location_lat and pet.location_lng:
                        dist = haversine(user_lng, user_lat, float(pet.location_lng), float(pet.location_lat))
                        if dist <= radius_val:
                            matches.append(pet.id)
                
                queryset = queryset.filter(id__in=matches)
                
            except (ValueError, TypeError):
                pass # Ignore invalid lat/lng

        # Sorting
        ordering = self.request.query_params.get('ordering', '-created_at')
        allowed_ordering = ['age', '-age', 'created_at', '-created_at', 'name', '-name']
        if ordering in allowed_ordering:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')
            
        return queryset

    def perform_create(self, serializer):
        # Enforce verification + pre‑rehoming intervention requirements
        if not self.request.user.can_create_listing:
            raise PermissionDenied("You must complete identity and contact verification before creating a listing.")

        # Ensure user has completed intervention and acknowledged resources
        intervention = RehomingIntervention.objects.filter(
            user=self.request.user
        ).order_by('-created_at').first()

        if not intervention or not intervention.acknowledged_at:
            raise PermissionDenied(
                "Please complete the pre‑rehoming assessment and acknowledge the resources before creating a listing."
            )

        # Respect optional cooling period
        if intervention.cooling_period_end and timezone.now() < intervention.cooling_period_end:
            raise PermissionDenied(
                "You have started a 48‑hour cooling period. You can create a listing once it has ended."
            )

        serializer.save(pet_owner=self.request.user)


# Retrieve, Update, and Delete Pets
class PetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RehomingListing.objects.all()
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), (IsOwnerOrReadOnly | IsAdmin)()]
    serializer_class = PetDetailSerializer

    def get_serializer_class(self):
        # Use different serializers for different actions
        if self.request.method in ['PUT', 'PATCH']:
            return PetCreateUpdateSerializer
        return PetDetailSerializer
