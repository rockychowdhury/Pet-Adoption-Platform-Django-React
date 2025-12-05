from rest_framework import generics, permissions
from .models import Pet
from .serializers import (
    PetListSerializer,
    PetDetailSerializer,
    PetCreateUpdateSerializer
)
class PetListCreateView(generics.ListCreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetListSerializer
    permission_classes = [permissions.AllowAny] # Default to allow any for list

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PetCreateUpdateSerializer
        return PetListSerializer

    def get_queryset(self):
        queryset = Pet.objects.all().order_by('-created_at')
        species = self.request.query_params.get('species')
        breed = self.request.query_params.get('breed')
        age_min = self.request.query_params.get('age_min')
        age_max = self.request.query_params.get('age_max')
        gender = self.request.query_params.get('gender')
        
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
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(shelter=self.request.user)


# Retrieve, Update, and Delete Pets
class PetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    serializer_class = PetDetailSerializer

    def get_serializer_class(self):
        # Use different serializers for different actions
        if self.request.method in ['PUT', 'PATCH']:
            return PetCreateUpdateSerializer
        return PetDetailSerializer
