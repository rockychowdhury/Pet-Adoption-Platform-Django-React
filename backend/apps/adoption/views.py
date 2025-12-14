from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AdoptionApplication, AdopterProfile
from .scheduling_models import MeetGreetSchedule, HomeCheck, VisitNote
from django.db import models
from .serializers import AdoptionApplicationSerializer, AdopterProfileSerializer
from apps.users.permissions import IsAdopter, IsAdmin
from apps.admin_panel.models import LegalAgreement
from .utils import generate_adoption_agreement_pdf

class AdoptionApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = AdoptionApplicationSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        if self.action in ['update_status', 'schedule_event']:
             # Only the pet owner can update stats
            return [permissions.IsAuthenticated()] # Logic inside action handles ownership check
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        # Return applications where user is applicant OR user is pet owner
        return AdoptionApplication.objects.filter(models.Q(applicant=user) | models.Q(pet__owner=user)).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        # Auto-populate readiness_score from adopter profile if exists
        user = self.request.user
        readiness_score = 0
        if hasattr(user, 'adopter_profile'):
            readiness_score = user.adopter_profile.readiness_score
        serializer.save(applicant=user, readiness_score=readiness_score)

    @action(detail=True, methods=['post'])
    def schedule_event(self, request, pk=None):
        application = self.get_object()
        
        if application.pet.pet_owner != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
        event_type = request.data.get('event_type')
        date_time = request.data.get('date_time')
        location = request.data.get('location')
        notes = request.data.get('notes', '')
        
        if not date_time or not event_type:
             return Response({'error': 'Date/Time and Event Type are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create appropriate scheduling model based on event type
        if event_type == 'meet_greet':
            MeetGreetSchedule.objects.create(
                application=application,
                scheduled_datetime=date_time,
                location_details=location,
                owner_notes=notes
            )
            application.status = 'approved_meet_greet'
        elif event_type == 'home_check':
            HomeCheck.objects.create(
                application=application,
                scheduled_datetime=date_time,
                notes=notes,
                performed_by=request.user
            )
        else:
            # For other event types, use VisitNote
            VisitNote.objects.create(
                application=application,
                visit_type=event_type,
                visit_date=date_time,
                note=notes,
                created_by=request.user
            )
            
        application.save()
        
        return Response({'status': application.status}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        
        # Only the owner of the pet can update the status
        if application.pet.pet_owner != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        rejection_reason = request.data.get('rejection_reason')
        owner_notes = request.data.get('owner_notes')

        if new_status not in dict(AdoptionApplication.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update fields
        application.status = new_status
        if rejection_reason:
            application.rejection_reason = rejection_reason
        if owner_notes:
            application.owner_notes = owner_notes
        application.save()

        # Business Logic: If Adopted
        count = 0
        if new_status == 'adoption_completed':
            # 1. Update Pet Status
            pet = application.pet
            pet.status = 'adopted'
            pet.save()

            # 2. Reject all other pending/under_review/approved/interview_scheduled applications for this pet
            other_apps = AdoptionApplication.objects.filter(pet=pet).exclude(id=application.id).exclude(status__in=['rejected', 'withdrawn'])
            count = other_apps.update(status='rejected', rejection_reason="Pet has been adopted by another applicant.")
            
        return Response({'status': 'updated', 'new_status': new_status, 'auto_rejected_others': count}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def generate_agreement(self, request, pk=None):
        """Generate legal agreement PDF for this application"""
        application = self.get_object()
        
        # Check permissions (Owner or Admin)
        if application.pet.pet_owner != request.user and not request.user.is_staff:
             return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
             
        # Create or Get Agreement
        agreement, created = LegalAgreement.objects.get_or_create(application=application)
        
        # Generate PDF
        success = generate_adoption_agreement_pdf(application, agreement)
        
        if success:
            return Response({
                'status': 'generated',
                'url': agreement.document_url.url if agreement.document_url else None
            })
        return Response({'error': 'Failed to generate PDF'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdopterProfileViewSet(viewsets.ModelViewSet):
    serializer_class = AdopterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own profile
        return AdopterProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        # Get or create profile for current user
        profile, created = AdopterProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's adopter profile"""
        profile, created = AdopterProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's adopter profile"""
        profile, created = AdopterProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
