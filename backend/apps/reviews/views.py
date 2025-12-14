from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db import models
from .models import AdoptionReview
from .serializers import AdoptionReviewSerializer
from apps.users.permissions import IsAdmin

class AdoptionReviewViewSet(viewsets.ModelViewSet):
    serializer_class = AdoptionReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can see reviews they gave or received
        user = self.request.user
        if user.is_staff:
            return AdoptionReview.objects.all().order_by('-created_at')
        
        # Filter by reviewee (e.g. looking at someone's profile)
        reviewee_id = self.request.query_params.get('user_id')
        if reviewee_id:
            return AdoptionReview.objects.filter(reviewee_id=reviewee_id).order_by('-created_at')
            
        return AdoptionReview.objects.filter(models.Q(reviewer=user) | models.Q(reviewee=user)).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
