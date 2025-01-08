from rest_framework import generics, permissions
from .models import Pet
from .serializers import (
    PetListSerializer,
    PetDetailSerializer,
    PetCreateUpdateSerializer
)
class PetListCreateView(generics.ListCreateAPIView):
    queryset = Pet.objects.all()
    permission_classes = [permissions.IsAuthenticated]  # Require authentication
    serializer_class = PetListSerializer

    def get_serializer_class(self):
        # Use different serializers for list and create actions
        if self.request.method == 'POST':
            return PetCreateUpdateSerializer
        return PetListSerializer

    def perform_create(self, serializer):
        # Automatically set the shelter field to the current user
        serializer.save(shelter=self.request.user)


# Retrieve, Update, and Delete Pets
class PetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    permission_classes = [permissions.IsAuthenticated]  # Require authentication
    serializer_class = PetDetailSerializer

    def get_serializer_class(self):
        # Use different serializers for different actions
        if self.request.method in ['PUT', 'PATCH']:
            return PetCreateUpdateSerializer
        return PetDetailSerializer
