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
