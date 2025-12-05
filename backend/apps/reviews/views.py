from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
from apps.users.permissions import IsAdopter, IsOwnerOrReadOnly, IsAdmin

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsAdopter()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly() | IsAdmin()]

    def get_queryset(self):
        target_user_id = self.request.query_params.get('target_user_id')
        if target_user_id:
            return Review.objects.filter(target_user_id=target_user_id).order_by('-created_at')
        return Review.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
