from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from django.db.models import Q
from apps.common.logging_utils import log_business_event

from .models import (
    ServiceProvider, ServiceReview, ServiceCategory, 
    Species, ServiceOption, ServiceBooking, Specialization,
    BusinessHours, ServiceMedia
)
from .serializers import (
    ServiceProviderSerializer, ServiceReviewSerializer,
    ServiceCategorySerializer, SpeciesSerializer, ServiceOptionSerializer,
    ServiceBookingSerializer, ServiceBookingCreateSerializer, SpecializationSerializer
)

class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]

class SpeciesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    permission_classes = [permissions.AllowAny]

class ServiceOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceOption.objects.all()
    serializer_class = ServiceOptionSerializer
    permission_classes = [permissions.AllowAny]

class SpecializationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [permissions.AllowAny]

class ServiceProviderFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(method='filter_min_price')
    max_price = django_filters.NumberFilter(method='filter_max_price')
    species = django_filters.CharFilter(method='filter_species') # Slug or name
    availability = django_filters.CharFilter(method='filter_availability')
    services = django_filters.CharFilter(method='filter_services')
    
    # Filter by category slug
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='iexact')

    # Aliases for location
    location_city = django_filters.CharFilter(field_name='city', lookup_expr='icontains')
    location_state = django_filters.CharFilter(field_name='state', lookup_expr='iexact')

    class Meta:
        model = ServiceProvider
        fields = ['category', 'city', 'state', 'verification_status']

    def filter_min_price(self, queryset, name, value):
        # Applies to Foster services or other services with rates/base prices
        return queryset.filter(
            Q(foster_details__daily_rate__gte=value) |
            Q(trainer_details__private_session_rate__gte=value)
        )

    def filter_max_price(self, queryset, name, value):
        return queryset.filter(
            Q(foster_details__daily_rate__lte=value) |
            Q(trainer_details__private_session_rate__lte=value)
        )

    def filter_species(self, queryset, name, value):
        # Support slug or name lookup across all service types
        return queryset.filter(
            Q(foster_details__species_accepted__slug__iexact=value) |
            Q(foster_details__species_accepted__name__icontains=value) |
            Q(vet_details__species_treated__slug__iexact=value) |
            Q(vet_details__species_treated__name__icontains=value) |
            Q(trainer_details__species_trained__slug__iexact=value) |
            Q(trainer_details__species_trained__name__icontains=value)
        ).distinct()

    def filter_availability(self, queryset, name, value):
        if value.lower() == 'available':
            return queryset.filter(
                Q(foster_details__current_availability='available') |
                Q(trainer_details__accepting_new_clients=True)
            )
        return queryset

    def filter_services(self, queryset, name, value):
        # Filter by ServiceOption name or Category
        return queryset.filter(
            Q(vet_details__services_offered__name__icontains=value) |
            Q(category__name__icontains=value)
        ).distinct()

class ServiceProviderViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = ServiceProvider.objects.all().order_by('-created_at')
        user = self.request.user
        
        # If detail view, allow access if it's the owner or admin, otherwise must be verified
        if self.action == 'retrieve':
            return queryset
            
        # For list action (search), only show verified providers unless user is staff
        if self.action == 'list':
             if not user.is_staff:
                  return queryset.filter(verification_status='verified')
             return queryset
        
        # For detail actions (retrieve, update, etc.), show verified OR owned by user
        if user.is_authenticated:
             if user.is_staff:
                  return queryset
             # Allow user to see their own profile even if unverified
             return queryset.filter(Q(verification_status='verified') | Q(user=user))
            
        return queryset.filter(verification_status='verified')
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ServiceProviderFilter
    search_fields = ['business_name', 'description', 'category__name', 'city']
    
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_service_provider and not user.is_staff:
             raise permissions.exceptions.PermissionDenied("You must be a Service Provider to create a profile.")
        
        if ServiceProvider.objects.filter(user=user).exists():
             raise permissions.exceptions.PermissionDenied("You already have a Service Provider profile.")

        instance = serializer.save(user=user)
        log_business_event('SERVICE_PROVIDER_PROFILE_CREATED', user, {
            'provider_id': instance.id,
            'business_name': instance.business_name
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def review(self, request, pk=None):
        provider = self.get_object()
        serializer = ServiceReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save(provider=provider, reviewer=request.user)
            log_business_event('SERVICE_REVIEW_CREATED', request.user, {
                'review_id': review.id,
                'provider_id': provider.id,
                'rating': review.rating_overall
            })
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            provider = ServiceProvider.objects.get(user=request.user)
            serializer = self.get_serializer(provider)
            return Response(serializer.data)
        except ServiceProvider.DoesNotExist:
            return Response({"detail": "No service provider profile found."}, status=404)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def update_hours(self, request, pk=None):
        provider = self.get_object()
        # Expect list of hour objects
        hours_data = request.data
        if not isinstance(hours_data, list):
            return Response({"error": "Expected a list of hours."}, status=400)
            
        # Delete existing
        provider.hours.all().delete()
        
        # Create new
        new_hours = []
        for h in hours_data:
            new_hours.append(BusinessHours(
                provider=provider,
                day=h.get('day'),
                open_time=h.get('open_time') or None,
                close_time=h.get('close_time') or None,
                is_closed=h.get('is_closed', False)
            ))
        BusinessHours.objects.bulk_create(new_hours)
        
        return Response(self.get_serializer(provider).data)
        
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def update_media(self, request, pk=None):
        provider = self.get_object()
        media_list = request.data
        if not isinstance(media_list, list):
             return Response({"error": "Expected a list of media items."}, status=400)
             
        # Strategy: Get existing IDs. 
        existing_ids = set(provider.media.values_list('id', flat=True))
        incoming_ids = set(item.get('id') for item in media_list if item.get('id'))
        
        # Delete missing
        to_delete = existing_ids - incoming_ids
        ServiceMedia.objects.filter(id__in=to_delete).delete()
        
        # Update or Create
        for item in media_list:
            if item.get('id') and item.get('id') in existing_ids:
                # Update
                media = ServiceMedia.objects.get(id=item.get('id'))
                media.is_primary = item.get('is_primary', False)
                # media.file_url = item.get('file_url') # Usually shouldn't change URL of existing unless re-upload
                media.save()
            else:
                # Create
                ServiceMedia.objects.create(
                    provider=provider,
                    file_url=item.get('file_url'),
                    thumbnail_url=item.get('thumbnail_url'),
                    is_primary=item.get('is_primary', False),
                    alt_text=item.get('alt_text', '')
                )
                
                
        return Response(self.get_serializer(provider).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        provider = self.get_object()
        status = request.data.get('status')
        if status not in ['pending', 'verified', 'rejected']:
             return Response({"error": "Invalid status."}, status=400)
        
        provider.verification_status = status
        provider.save()
        log_business_event('PROVIDER_STATUS_UPDATED', request.user, {
            'provider_id': provider.id,
            'new_status': status
        })
        return Response(self.get_serializer(provider).data)

class ServiceBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ServiceBookingCreateSerializer
        return ServiceBookingSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ServiceBooking.objects.none()
        
        # If user is a provider, show bookings for them AND bookings they made as a client
        queryset = ServiceBooking.objects.filter(Q(client=user))
        
        if hasattr(user, 'service_provider_profile'):
            provider_bookings = ServiceBooking.objects.filter(provider=user.service_provider_profile)
            queryset = queryset | provider_bookings
            
        return queryset.distinct()

    def perform_create(self, serializer):
        # Allow client to create booking
        # Status defaults to pending in model
        instance = serializer.save(client=self.request.user)
        log_business_event('SERVICE_BOOKING_CREATED', self.request.user, {
            'booking_id': instance.id,
            'provider_id': instance.provider.id,
            'pet_id': instance.pet.id
        })

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        booking = self.get_object()
        # Only the provider can accept
        if booking.provider.user != request.user:
            return Response({"error": "Only the service provider can accept this booking."}, status=403)
        
        if booking.status != 'pending':
            return Response({"error": "Can only accept pending bookings."}, status=400)
            
        booking.status = 'confirmed'
        booking.save()
        log_business_event('SERVICE_BOOKING_ACCEPTED', request.user, {
            'booking_id': booking.id,
            'client_id': booking.client.id
        })
        return Response(ServiceBookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        booking = self.get_object()
        # Only the provider can reject
        if booking.provider.user != request.user:
            return Response({"error": "Only the service provider can reject this booking."}, status=403)
            
        booking.status = 'cancelled'
        booking.cancellation_reason = request.data.get('reason', 'Rejected by provider')
        booking.save()
        return Response(ServiceBookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        # Client or Provider can cancel
        if booking.client != request.user and booking.provider.user != request.user:
            return Response({"error": "You do not have permission to cancel this booking."}, status=403)
            
        booking.status = 'cancelled'
        booking.cancellation_reason = request.data.get('reason', 'Cancelled by user')
        booking.save()
        return Response(ServiceBookingSerializer(booking).data)
