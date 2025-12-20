from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.db.models import Q
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
        # Base queryset
        queryset = RehomingListing.objects.all()

        # Filter by owner (e.g. ?owner=me)
        owner_param = self.request.query_params.get('owner')
        if owner_param == 'me' and self.request.user.is_authenticated:
            # Owner sees ALL their pets (Draft, Active, etc.)
            queryset = queryset.filter(pet_owner=self.request.user)
        else:
            # Public only sees ACTIVE pets
            queryset = queryset.filter(status='active')
            
        # Basic Filtering
        species = self.request.query_params.get('species')
        breed = self.request.query_params.get('breed')
        age_min = self.request.query_params.get('age_min')
        age_max = self.request.query_params.get('age_max')
        gender = self.request.query_params.get('gender')
        size = self.request.query_params.get('size')
        urgency = self.request.query_params.get('urgency_level')
        search_query = self.request.query_params.get('search')
        
        if species:
            queryset = queryset.filter(species__iexact=species)
        if breed:
            queryset = queryset.filter(breed__icontains=breed)
        if gender:
            queryset = queryset.filter(gender__iexact=gender)
        if size:
            queryset = queryset.filter(size__iexact=size)
        if urgency:
            queryset = queryset.filter(urgency_level__iexact=urgency)
            
        # Categorical Age Filtering
        age_range = self.request.query_params.get('age_range')
        if age_range:
            if age_range == 'under_6_months':
                queryset = queryset.filter(age_months__lt=6)
            elif age_range == '6_12_months':
                queryset = queryset.filter(age_months__gte=6, age_months__lte=12)
            elif age_range == '1_3_years':
                queryset = queryset.filter(age_months__gt=12, age_months__lte=36)
            elif age_range == '3_10_years':
                queryset = queryset.filter(age_months__gt=36, age_months__lte=120)
            elif age_range == '10_plus_years':
                queryset = queryset.filter(age_months__gt=120)

        # Adoption Fee
        max_fee = self.request.query_params.get('max_fee')
        if max_fee:
            queryset = queryset.filter(adoption_fee__lte=float(max_fee))

        # Energy Level
        energy_level = self.request.query_params.get('energy_level')
        if energy_level:
            queryset = queryset.filter(behavioral_profile__energy_level=int(energy_level))

        # Compatibility & Training
        house_trained = self.request.query_params.get('house_trained')
        if house_trained == 'true':
            queryset = queryset.filter(behavioral_profile__house_trained='yes')

        special_needs = self.request.query_params.get('special_needs')
        if special_needs == 'true':
            queryset = queryset.filter(behavioral_profile__special_needs='yes')

        # Verification Statuses
        verified_owner = self.request.query_params.get('verified_owner')
        if verified_owner == 'true':
            queryset = queryset.filter(pet_owner__pet_owner_verified=True)

        verified_identity = self.request.query_params.get('verified_identity')
        if verified_identity == 'true':
            queryset = queryset.filter(pet_owner__verified_identity=True)

        verified_vet = self.request.query_params.get('verified_vet')
        if verified_vet == 'true':
            queryset = queryset.filter(is_vet_verified=True)
            
        # Search (Name, Breed, Description, City)
        if search_query:
            queryset = queryset.filter(
                Q(pet_name__icontains=search_query) | 
                Q(breed__icontains=search_query) | 
                Q(rehoming_story__icontains=search_query) |
                Q(location_city__icontains=search_query)
            )

        # JSON Filtering (Behavioral Profile - Compatibility)
        good_with_cats = self.request.query_params.get('good_with_cats')
        good_with_dogs = self.request.query_params.get('good_with_dogs')
        good_with_children = self.request.query_params.get('good_with_children')
        
        if good_with_cats == 'true':
            queryset = queryset.filter(behavioral_profile__good_with_cats='yes')
            
        if good_with_dogs == 'true':
            queryset = queryset.filter(behavioral_profile__good_with_dogs='yes')
            
        if good_with_children == 'true':
            queryset = queryset.filter(
                Q(behavioral_profile__good_with_kids='yes') | 
                Q(behavioral_profile__good_with_children='yes')
            )

        # Location Filtering (Radius)
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 50) # miles

        if lat and lng:
            try:
                user_lat = float(lat)
                user_lng = float(lng)
                radius_val = float(radius)
                
                from math import radians, cos, sin, asin, sqrt

                def haversine(lon1, lat1, lon2, lat2):
                    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
                    dlon = lon2 - lon1 
                    dlat = lat2 - lat1 
                    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
                    c = 2 * asin(sqrt(a)) 
                    r = 3956 # Miles
                    return c * r

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
        ordering = self.request.query_params.get('ordering', '-published_at')
        allowed_ordering = [
            'age_months', '-age_months', 
            'published_at', '-published_at', 
            'pet_name', '-pet_name',
            'created_at', '-created_at',
            'adoption_fee', '-adoption_fee'
        ]
        if ordering in allowed_ordering:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-published_at')
            
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
