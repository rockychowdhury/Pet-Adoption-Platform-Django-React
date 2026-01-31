from rest_framework import viewsets, permissions, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import UserReport
from .serializers import UserReportSerializer
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


class ListingModerationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin view for managing pending listings.
    Allows approving/rejecting listings.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        from apps.rehoming.models import RehomingListing
        class SimpleListingSerializer(serializers.ModelSerializer):
            class Meta:
                model = RehomingListing
                fields = '__all__'
        return SimpleListingSerializer

    def get_queryset(self):
        from apps.rehoming.models import RehomingListing
        status_param = self.request.query_params.get('status')
        if status_param:
             return RehomingListing.objects.filter(status=status_param).order_by('-created_at')
        # Listings that need attention? RehomingListing doesn't have pending_review status in new model plan?
        # Checking plan... RehomingListing status choices: draft, active, paused, closed.
        # Maybe "draft" -> "active"? Or we add a "review"?
        # For now, let's just return all non-drafts or just active?
        # Refactor suggestion implies simplified peer-to-peer, so moderation might be post-hoc.
        return RehomingListing.objects.exclude(status='draft').order_by('-created_at')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        listing = self.get_object()
        listing.status = 'active'
        listing.published_at = timezone.now()
        listing.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        listing = self.get_object()
        listing.status = 'closed' # Or we add rejected status?
        listing.save()
        return Response({'status': 'rejected'})


from rest_framework.views import APIView

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        from django.contrib.auth import get_user_model
        from apps.rehoming.models import RehomingListing, RehomingRequest
        
        User = get_user_model()
        today = timezone.now().date()
        
        data = {
            'total_users': User.objects.count(),
            'new_users_today': User.objects.filter(date_joined__date=today).count(),
            'active_listings': RehomingListing.objects.filter(status='active').count(),
            'total_requests': RehomingRequest.objects.count(),
            'pending_requests': RehomingRequest.objects.filter(status='pending').count(),
        }
        return Response(data)

class ModerationLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only view for audit logs of moderation actions.
    """
    from .models import ModerationAction
    from .serializers import ModerationActionSerializer
    
    queryset = ModerationAction.objects.all().order_by('-created_at')
    serializer_class = ModerationActionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['moderator__email', 'target_user__email', 'reason']
    filterset_fields = ['action_type']

class RoleRequestViewSet(viewsets.ModelViewSet):
    """
    Admin only viewset for managing role requests.
    Supports approving and rejecting requests with atomic updates.
    """
    from apps.users.models import RoleRequest
    from .serializers import RoleRequestSerializer
    
    queryset = RoleRequest.objects.all().order_by('-created_at')
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'requested_role']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    
    def get_queryset(self):
        # Admins see all
        return self.queryset

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        role_request = self.get_object()
        
        if role_request.status != 'pending':
             return Response({"error": "Request is not pending"}, status=400)
             
        # Approve
        from django.db import transaction
        from apps.common.logging_utils import log_business_event
        
        with transaction.atomic():
            # 1. Update Request
            role_request.status = 'approved'
            role_request.admin_notes = request.data.get('admin_notes', '')
            role_request.save()
            
            # 2. Update User Role
            user = role_request.user
            user.role = role_request.requested_role
            if not user.is_active: # Ensure active if promoting
                user.is_active = True
            user.save()
            
            # 3. Update Service Provider Profile (if applicable)
            if hasattr(user, 'service_provider_profile'):
                provider = user.service_provider_profile
                provider.verification_status = 'verified'
                provider.application_status = 'approved'
                provider.save()
                
            log_business_event('ROLE_REQUEST_APPROVED', request.user, {
                'request_id': role_request.id,
                'target_user_id': user.id,
                'role': role_request.requested_role
            })
            
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        role_request = self.get_object()
        
        if role_request.status != 'pending':
             return Response({"error": "Request is not pending"}, status=400)
             
        with transaction.atomic():
            role_request.status = 'rejected'
            role_request.admin_notes = request.data.get('admin_notes', '')
            role_request.save()
            
            # Update Provider Application Status
            user = role_request.user
            if hasattr(user, 'service_provider_profile'):
                provider = user.service_provider_profile
                provider.application_status = 'rejected'
                provider.save()
        
        return Response({'status': 'rejected'})
