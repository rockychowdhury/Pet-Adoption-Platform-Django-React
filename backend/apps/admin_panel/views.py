from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import UserReport, LegalAgreement
from .serializers import UserReportSerializer, LegalAgreementSerializer
from apps.users.permissions import IsAdmin

class UserReportViewSet(viewsets.ModelViewSet):
    """
    Admin only viewset for managing user reports.
    Users can create reports, but only admins can list/update them.
    """
    queryset = UserReport.objects.all().order_by('-created_at')
    serializer_class = UserReportSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdmin()]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

    @action(detail=True, methods=['patch'])
    def resolve(self, request, pk=None):
        report = self.get_object()
        status_val = request.data.get('status')
        notes = request.data.get('admin_notes', '')
        
        if status_val not in dict(UserReport.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            
        report.status = status_val
        report.admin_notes = notes
        if status_val in ['action_taken', 'dismissed']:
             report.resolved_at = timezone.now()
        report.save()
        return Response({'status': 'updated'})


class LegalAgreementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin view for legal agreements.
    """
    queryset = LegalAgreement.objects.all().order_by('-created_at')
    serializer_class = LegalAgreementSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class ListingModerationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin view for managing pending listings.
    Allows approving/rejecting listings.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    # We use PetDetailSerializer to show full details, 
    # but we might need a custom one if we want to show moderation history.
    from apps.pets.serializers import PetDetailSerializer
    serializer_class = PetDetailSerializer

    def get_queryset(self):
        from apps.pets.models import RehomingListing
        # Default to showing pending_review first, but allow filtering
        status_param = self.request.query_params.get('status')
        if status_param:
             return RehomingListing.objects.filter(status=status_param).order_by('-created_at')
        return RehomingListing.objects.filter(status='pending_review').order_by('-created_at')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        listing = self.get_object()
        listing.status = 'active'
        listing.save()
        # Create ListingReview entry if not exists or update it
        # listing.listing_review.status = 'approved' ...
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        listing = self.get_object()
        listing.status = 'rejected'
        listing.save()
        return Response({'status': 'rejected'})


from rest_framework.views import APIView

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        from django.contrib.auth import get_user_model
        from apps.pets.models import RehomingListing
        from apps.adoption.models import AdoptionApplication
        
        User = get_user_model()
        today = timezone.now().date()
        
        data = {
            'total_users': User.objects.count(),
            'new_users_today': User.objects.filter(date_joined__date=today).count(),
            'active_listings': RehomingListing.objects.filter(status='active').count(),
            'pending_listings': RehomingListing.objects.filter(status='pending_review').count(),
            'total_applications': AdoptionApplication.objects.count(),
            'pending_applications': AdoptionApplication.objects.filter(status='pending_review').count(),
        }
        return Response(data)

