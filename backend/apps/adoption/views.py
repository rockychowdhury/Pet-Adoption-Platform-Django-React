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
            return [permissions.IsAuthenticated(), (IsShelter | IsAdmin)()]
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
        rejection_reason = request.data.get('rejection_reason')
        shelter_notes = request.data.get('shelter_notes')

        if new_status not in dict(AdoptionApplication.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update fields
        application.status = new_status
        if rejection_reason:
            application.rejection_reason = rejection_reason
        if shelter_notes:
            application.shelter_notes = shelter_notes
        application.save()

        # Business Logic: If Adopted
        if new_status == 'adopted':
            # 1. Update Pet Status
            pet = application.pet
            pet.status = 'adopted'
            pet.save()

            # 2. Reject all other pending/under_review/approved applications for this pet
            other_apps = AdoptionApplication.objects.filter(pet=pet).exclude(id=application.id).exclude(status__in=['rejected', 'withdrawn'])
            count = other_apps.update(status='rejected', rejection_reason="Pet has been adopted by another applicant.")
            
        return Response({'status': 'updated', 'new_status': new_status, 'auto_rejected_others': count if new_status == 'adopted' else 0}, status=status.HTTP_200_OK)
