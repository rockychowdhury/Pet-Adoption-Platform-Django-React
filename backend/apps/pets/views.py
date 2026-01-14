from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from .models import PetProfile, PetMedia, PersonalityTrait
from .serializers import (
    PetProfileSerializer, 
    PetProfileCreateUpdateSerializer, 
    PetMediaSerializer,
    PersonalityTraitSerializer
)
from apps.users.permissions import IsOwnerOrReadOnly

class PetProfileListCreateView(generics.ListCreateAPIView):
    """
    Manage user's own pet profiles.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PetProfileCreateUpdateSerializer
        return PetProfileSerializer

    def get_queryset(self):
        return PetProfile.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PetProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a pet profile.
    Non-owners can only view active profiles.
    """
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PetProfileCreateUpdateSerializer
        return PetProfileSerializer

    def get_queryset(self):
        user = self.request.user
        # Fix: use status='active' instead of is_active=True
        return PetProfile.objects.filter(Q(status='active') | Q(owner=user))


class PetMediaCreateView(generics.CreateAPIView):
    """
    Upload (add) a photo URL to a pet profile.
    """
    serializer_class = PetMediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        pet_id = self.kwargs.get('pet_id')
        try:
            pet = PetProfile.objects.get(id=pet_id)
        except PetProfile.DoesNotExist:
             raise serializers.ValidationError("Pet not found.")
        
        if pet.owner != self.request.user:
            raise PermissionDenied("You do not own this pet.")
            
        serializer.save(pet=pet)


class PetMediaDetailView(generics.DestroyAPIView):
    """
    Remove a photo from a pet profile.
    """
    queryset = PetMedia.objects.all()
    serializer_class = PetMediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow deletion only if user owns the pet
        return PetMedia.objects.filter(pet__owner=self.request.user)


class PersonalityTraitListView(generics.ListAPIView):
    """
    List all available personality traits.
    """
    queryset = PersonalityTrait.objects.all()
    serializer_class = PersonalityTraitSerializer
    permission_classes = [permissions.AllowAny]
