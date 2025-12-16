from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from django.db.models import Q

from .models import ServiceProvider, ServiceReview
from .serializers import ServiceProviderSerializer, ServiceReviewSerializer

class ServiceProviderFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(method='filter_min_price')
    max_price = django_filters.NumberFilter(method='filter_max_price')
    species = django_filters.CharFilter(method='filter_species') # Comma-separated or single
    availability = django_filters.CharFilter(method='filter_availability')
    services = django_filters.CharFilter(method='filter_services')

    # Aliases for location to match frontend/spec
    location_city = django_filters.CharFilter(field_name='city', lookup_expr='icontains')
    location_state = django_filters.CharFilter(field_name='state', lookup_expr='iexact')

    class Meta:
        model = ServiceProvider
        fields = ['provider_type', 'city', 'state']

    def filter_min_price(self, queryset, name, value):
        # Applies mostly to Foster services (daily_rate)
        return queryset.filter(foster_details__daily_rate__gte=value)

    def filter_max_price(self, queryset, name, value):
        return queryset.filter(foster_details__daily_rate__lte=value)

    def filter_species(self, queryset, name, value):
        # Check foster_details.species_accepted or vet_details.species_treated
        # Since these are JSON arrays, we use valid lookup if DB supports it (Postgres)
        # Or simple 'icontains' on the text representation for MVP SQLite/Postgres compatibility generic
        return queryset.filter(
            Q(foster_details__species_accepted__icontains=value) | 
            Q(vet_details__species_treated__icontains=value)
        )

    def filter_availability(self, queryset, name, value):
        if value.lower() == 'available':
            return queryset.filter(foster_details__current_availability='available')
        return queryset

    def filter_services(self, queryset, name, value):
        # ServiceProvider.services_offered or Vet.services_offered
        return queryset.filter(
            Q(services_offered__icontains=value) | 
            Q(vet_details__services_offered__icontains=value)
        )

class ServiceProviderViewSet(viewsets.ModelViewSet):
    queryset = ServiceProvider.objects.all().order_by('-created_at')
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ServiceProviderFilter
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
