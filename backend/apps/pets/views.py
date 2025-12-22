from rest_framework import generics, permissions
from .models import PetProfile
from .serializers import PetProfileSerializer
from apps.users.permissions import IsOwnerOrReadOnly

class PetProfileListCreateView(generics.ListCreateAPIView):
    """
    Manage user's own pet profiles.
    """
    serializer_class = PetProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PetProfile.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

from django.db.models import Q

class PetProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a pet profile.
    Non-owners can only view active profiles.
    """
    serializer_class = PetProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        return PetProfile.objects.filter(Q(is_active=True) | Q(owner=user))
