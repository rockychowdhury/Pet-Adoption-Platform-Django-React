from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AdoptionApplication
from .serializers import AdoptionApplicationSerializer
from apps.users.permissions import IsAdopter, IsShelter, IsAdmin

class AdoptionApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = AdoptionApplicationSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsAdopter()]
        if self.action == 'update_status':
            return [permissions.IsAuthenticated(), IsShelter() | IsAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_shelter:
            return AdoptionApplication.objects.filter(pet__shelter=user).order_by('-created_at')
        return AdoptionApplication.objects.filter(applicant=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        
        # Only the shelter that owns the pet can update the status
        if application.pet.shelter != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status not in dict(AdoptionApplication.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        application.status = new_status
        application.save()
        return Response({'status': 'updated', 'new_status': new_status}, status=status.HTTP_200_OK)
