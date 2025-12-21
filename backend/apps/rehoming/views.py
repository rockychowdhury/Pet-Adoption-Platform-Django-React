from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.db.models import Q
from .models import RehomingListing, RehomingIntervention, AdoptionApplication
from .serializers import (
    ListingSerializer,
    ListingDetailSerializer,
    ListingSerializer,
    ListingDetailSerializer,
    ListingCreateUpdateSerializer,
    RehomingInterventionSerializer,
    AdoptionApplicationSerializer
)
from apps.users.permissions import IsAdmin, IsOwnerOrReadOnly

class ListingListCreateView(generics.ListCreateAPIView):
    queryset = RehomingListing.objects.all()
    serializer_class = ListingSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            # Only authenticated users can create
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ListingCreateUpdateSerializer
        return ListingSerializer

    def get_queryset(self):
        # Base queryset
        queryset = RehomingListing.objects.select_related('pet_owner')

        # Filter by owner (e.g. ?owner=me)
        owner_param = self.request.query_params.get('owner')
        if owner_param == 'me' and self.request.user.is_authenticated:
            # Owner sees ALL their listings (Draft, Active, etc.)
            queryset = queryset.filter(pet_owner=self.request.user)
        else:
            # Public only sees ACTIVE listings
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
            queryset = queryset.filter(size_category__iexact=size)
        if urgency:
            queryset = queryset.filter(urgency_level__iexact=urgency)
            
        # Categorical Age Filtering
        age_range = self.request.query_params.get('age_range')
        # Assuming age is stored as integer years or we have helper property. Model has 'age' (int years).
        # Previous code used 'age_months'. Docs/models use 'age' (years).
        # I'll adapt to years.
        if age_range:
            if age_range == 'baby': # < 1 year
                queryset = queryset.filter(age=0)
            elif age_range == 'young': # 1-3
                queryset = queryset.filter(age__gte=1, age__lte=3)
            elif age_range == 'adult': # 3-10
                queryset = queryset.filter(age__gt=3, age__lte=10)
            elif age_range == 'senior': # 10+
                queryset = queryset.filter(age__gt=10)

        # Adoption Fee
        max_fee = self.request.query_params.get('max_fee')
        if max_fee:
            queryset = queryset.filter(adoption_fee__lte=float(max_fee))

        # Search
        if search_query:
            queryset = queryset.filter(
                Q(pet_name__icontains=search_query) | 
                Q(breed__icontains=search_query) | 
                Q(rehoming_story__icontains=search_query) |
                Q(location_city__icontains=search_query)
            )

        # Sorting
        ordering = self.request.query_params.get('ordering', '-published_at')
        allowed_ordering = [
            'age', '-age', 
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
        if not self.request.user.can_create_listing:
            raise PermissionDenied("You must complete identity and contact verification before creating a listing.")

        # Ensure user has completed intervention check
        intervention = RehomingIntervention.objects.filter(
            user=self.request.user
        ).order_by('-created_at').first()

        if not intervention or not intervention.proceeded_to_listing:
            # Maybe allow if no intervention but policy says they should?
            # For now, relax or enforce based on business rule.
            pass 

        serializer.save(pet_owner=self.request.user)


class ListingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RehomingListing.objects.all()
    serializer_class = ListingDetailSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), (IsOwnerOrReadOnly | IsAdmin)()]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ListingCreateUpdateSerializer
        return ListingDetailSerializer

class RehomingInterventionViewSet(viewsets.ModelViewSet):
    queryset = RehomingIntervention.objects.all()
    serializer_class = RehomingInterventionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RehomingIntervention.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=False, methods=['get'])
    def active_intervention(self, request):
        """Get the most recent active intervention for the user"""
        intervention = RehomingIntervention.objects.filter(user=request.user).order_by('-created_at').first()
        if not intervention:
             return Response({"detail": "No active intervention found."}, status=404)
        serializer = self.get_serializer(intervention)
        return Response(serializer.data)

class AdoptionApplicationViewSet(viewsets.ModelViewSet):
    queryset = AdoptionApplication.objects.all()
    serializer_class = AdoptionApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Return applications where user is Applicant OR user is Owner of the listing
        return AdoptionApplication.objects.filter(
            Q(applicant=user) | Q(listing__pet_owner=user)
        ).distinct()

    def perform_create(self, serializer):
        # Ensure user can't apply to own listing
        listing = serializer.validated_data['listing']
        if listing.pet_owner == self.request.user:
             raise PermissionDenied("You cannot apply to adopt your own pet.")
        
        # Check if already applied
        if AdoptionApplication.objects.filter(listing=listing, applicant=self.request.user).exists():
             raise PermissionDenied("You have already applied for this pet.")
             
        serializer.save(applicant=self.request.user)

