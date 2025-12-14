from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ServiceProvider, ServiceReview
from .serializers import ServiceProviderSerializer, ServiceReviewSerializer

class ServiceProviderViewSet(viewsets.ModelViewSet):
    queryset = ServiceProvider.objects.all().order_by('-created_at')
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['provider_type', 'location_city', 'location_state']
    search_fields = ['business_name', 'description', 'services_offered']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def review(self, request, pk=None):
        provider = self.get_object()
        serializer = ServiceReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(provider=provider, reviewer=request.request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
