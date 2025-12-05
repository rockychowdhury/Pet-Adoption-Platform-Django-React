from rest_framework import generics, permissions
from .models import Pet
from .serializers import (
    PetListSerializer,
    PetDetailSerializer,
    PetCreateUpdateSerializer
)
from apps.users.permissions import IsShelter, IsShelterOwnerOrReadOnly, IsAdmin

class PetListCreateView(generics.ListCreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetListSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), (IsShelter | IsAdmin)()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PetCreateUpdateSerializer
        return PetListSerializer

    def get_queryset(self):
        queryset = Pet.objects.all()
        
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
            queryset = queryset.filter(age__gte=age_min)
        if age_max:
            queryset = queryset.filter(age__lte=age_max)
        
        # Filter by shelter (e.g. ?shelter=me or ?shelter=1)
        shelter_param = self.request.query_params.get('shelter')
        if shelter_param:
            if shelter_param == 'me' and self.request.user.is_authenticated:
                queryset = queryset.filter(shelter=self.request.user)
            else:
                # Optional: allow filtering by specific shelter ID if needed
                pass
            
        # Search (Name, Breed, Description)
        if search_query:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(breed__icontains=search_query) | 
                Q(description__icontains=search_query)
            )

        # Sorting
        ordering = self.request.query_params.get('ordering', '-created_at')
        allowed_ordering = ['age', '-age', 'created_at', '-created_at', 'name', '-name']
        if ordering in allowed_ordering:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(shelter=self.request.user)


# Retrieve, Update, and Delete Pets
class PetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), (IsShelterOwnerOrReadOnly | IsAdmin)()]
    serializer_class = PetDetailSerializer

    def get_serializer_class(self):
        # Use different serializers for different actions
        if self.request.method in ['PUT', 'PATCH']:
            return PetCreateUpdateSerializer
        return PetDetailSerializer
