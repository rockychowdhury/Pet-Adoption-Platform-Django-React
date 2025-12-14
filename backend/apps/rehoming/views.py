from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import RehomingIntervention
from .serializers import RehomingInterventionSerializer

class RehomingInterventionViewSet(viewsets.ModelViewSet):
    queryset = RehomingIntervention.objects.all()
    serializer_class = RehomingInterventionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own interventions
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """
        Endpoint for user to acknowledge they have viewed resources
        and want to proceed with rehoming.
        """
        intervention = self.get_object()
        intervention.acknowledged_at = timezone.now()
        intervention.save()
        return Response({'status': 'acknowledged', 'timestamp': intervention.acknowledged_at})

    @action(detail=False, methods=['get'])
    def active_intervention(self, request):
        """
        Check if user has an active intervention (within cooling period or not finalized)
        """
        # Logic for cooling period (e.g. 48 hours)
        # For MVP, just return the most recent one
        intervention = self.get_queryset().order_by('-created_at').first()
        if intervention:
            serializer = self.get_serializer(intervention)
            return Response(serializer.data)
        return Response({'active': False}, status=status.HTTP_404_NOT_FOUND)
