from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from django.db.models import Q, Sum
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
        fields = ['category', 'city', 'state', 'verification_status', 'nearby']
    
    nearby = django_filters.CharFilter(method='filter_nearby')

    def filter_min_price(self, queryset, name, value):
        # Applies to Foster services or other services with rates/base prices
        return queryset.filter(
            Q(foster_details__daily_rate__gte=value) |
            Q(trainer_details__private_session_rate__gte=value) | 
            Q(groomer_details__base_price__gte=value) |
            Q(sitter_details__walking_rate__gte=value)
        )

    def filter_max_price(self, queryset, name, value):
        return queryset.filter(
            Q(foster_details__daily_rate__lte=value) |
            Q(trainer_details__private_session_rate__lte=value) |
            Q(groomer_details__base_price__lte=value) |
            Q(sitter_details__walking_rate__lte=value)
        )

    def filter_species(self, queryset, name, value):
        # Support slug or name lookup across all service types
        return queryset.filter(
            Q(foster_details__species_accepted__slug__iexact=value) |
            Q(foster_details__species_accepted__name__icontains=value) |
            Q(vet_details__species_treated__slug__iexact=value) |
            Q(vet_details__species_treated__name__icontains=value) |
            Q(vet_details__species_treated__slug__iexact=value) |
            Q(vet_details__species_treated__name__icontains=value) |
            Q(trainer_details__species_trained__slug__iexact=value) |
            Q(trainer_details__species_trained__name__icontains=value) |
            Q(groomer_details__species_accepted__slug__iexact=value) |
            Q(groomer_details__species_accepted__name__icontains=value) |
            Q(sitter_details__species_accepted__slug__iexact=value) |
            Q(sitter_details__species_accepted__name__icontains=value)
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
            Q(category__name__icontains=value) |
            # For groomers, check json menu?? Not easy with basic filter. 
            # Check salon type for groomer
            Q(groomer_details__salon_type__icontains=value)
        ).distinct()

    def filter_nearby(self, queryset, name, value):
        """
        Simple bounding box filtering for 'nearby' functionality.
        Expected format: lat,lng,radius_km (optional, default 10)
        Example: ?nearby=23.8103,90.4125,5
        """
        try:
            parts = value.split(',')
            lat = float(parts[0])
            lng = float(parts[1])
            radius_km = float(parts[2]) if len(parts) > 2 else 10.0
            
            # 1 degree lat ~= 111km
            lat_delta = radius_km / 111.0
            # 1 degree lng ~= 111km * cos(lat)
            import math
            lng_delta = radius_km / (111.0 * math.cos(math.radians(lat)))
            
            return queryset.filter(
                latitude__range=(lat - lat_delta, lat + lat_delta),
                longitude__range=(lng - lng_delta, lng + lng_delta)
            )
        except (ValueError, IndexError):
            return queryset

class ServiceProviderViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        from django.db.models import Avg, Sum, Count, F
        
        queryset = ServiceProvider.objects.annotate(
            avg_communication=Avg('reviews__rating_communication'),
            avg_cleanliness=Avg('reviews__rating_cleanliness'),
            avg_quality=Avg('reviews__rating_quality'),
            avg_value=Avg('reviews__rating_value')
        ).order_by('-created_at')
        
        user = self.request.user
        
        # If detail view, allow access if it's the owner or admin, otherwise must be verified
        if self.action == 'retrieve':
            return queryset
            
        # For list actions
        if self.action == 'list':
             # Admin saw everything
             if user.is_staff:
                  return queryset
             # Public sees verified
             return queryset.filter(verification_status='verified')
        
        # For authenticated user queries (dashboard etc)
        if user.is_authenticated:
             if user.is_staff:
                  return queryset
             # Allow user to see their own profile even if unverified/draft
             return queryset.filter(Q(verification_status='verified') | Q(user=user))
            
        return queryset.filter(verification_status='verified')
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ServiceProviderFilter
    search_fields = ['business_name', 'description', 'category__name', 'city']
    
    def perform_create(self, serializer):
        user = self.request.user
        # Allow any user to create a provider profile (as draft)
        
        if ServiceProvider.objects.filter(user=user).exists():
             raise permissions.exceptions.PermissionDenied("You already have a Service Provider profile.")

        # Force status to draft initially
        instance = serializer.save(user=user, application_status='draft')
        log_business_event('SERVICE_PROVIDER_PROFILE_CREATED', user, {
            'provider_id': instance.id,
            'business_name': instance.business_name
        })

    def perform_update(self, serializer):
        # Prevent updates if status is submitted (locked)
        instance = serializer.instance
        if instance.application_status == 'submitted' and not self.request.user.is_staff:
             raise permissions.exceptions.PermissionDenied("Your application is under review and cannot be edited.")
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_application(self, request, pk=None):
        provider = self.get_object()
        user = request.user
        
        if provider.user != user:
             return Response({"error": "Not authorized"}, status=403)
             
        if provider.application_status != 'draft':
             return Response({"error": "Application is not in draft status."}, status=400)
             
        # Create Role Request
        from apps.users.models import RoleRequest, User
        RoleRequest.objects.create(
            user=user,
            requested_role=User.UserRole.SERVICE_PROVIDER,
            reason="Application submitted via provider portal.",
            status='pending'
        )
        
        provider.application_status = 'submitted'
        provider.save()
        
        log_business_event('PROVIDER_APPLICATION_SUBMITTED', user, {'provider_id': provider.id})
        return Response(self.get_serializer(provider).data)

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

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='reviews/(?P<review_id>[^/.]+)/respond')
    def respond_to_review(self, request, pk=None, review_id=None):
        """Allow provider to respond to a review"""
        provider = self.get_object()
        
        # Check provider owns this profile
        if provider.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        try:
            review = ServiceReview.objects.get(id=review_id, provider=provider)
        except ServiceReview.DoesNotExist:
            return Response({"error": "Review not found"}, status=404)
        
        response_text = request.data.get('response')
        if not response_text:
            return Response({"error": "Response text is required"}, status=400)
        
        # Update review with response
        from django.utils import timezone
        review.provider_response = response_text
        review.response_date = timezone.now()
        review.save()
        
        serializer = ServiceReviewSerializer(review)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticated])
    def availability_blocks(self, request, pk=None):
        """List or create availability blocks for a provider"""
        provider = self.get_object()
        
        # Check ownership
        if provider.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        if request.method == 'GET':
            from .models import ProviderAvailabilityBlock
            from .serializers import ProviderAvailabilityBlockSerializer
            blocks = ProviderAvailabilityBlock.objects.filter(provider=provider)
            serializer = ProviderAvailabilityBlockSerializer(blocks, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            from .serializers import ProviderAvailabilityBlockSerializer
            serializer = ProviderAvailabilityBlockSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(provider=provider)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
    
    @action(
        detail=True,
        methods=['delete'],
        permission_classes=[permissions.IsAuthenticated],
        url_path='availability_blocks/(?P<block_id>[^/.]+)'
    )
    def delete_availability_block(self, request, pk=None, block_id=None):
        """Delete a specific availability block"""
        provider = self.get_object()
        
        # Check ownership
        if provider.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        try:
            from .models import ProviderAvailabilityBlock
            block = ProviderAvailabilityBlock.objects.get(id=block_id, provider=provider)
            block.delete()
            return Response({"message": "Block deleted successfully"}, status=204)
        except ProviderAvailabilityBlock.DoesNotExist:
            return Response({"error": "Block not found"}, status=404)

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

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def dashboard_stats(self, request):
        """
        Get aggregated stats for the logged-in provider.
        """
        user = request.user
        if not hasattr(user, 'service_provider_profile'):
             return Response({"error": "User is not a service provider"}, status=403)
        
        provider = user.service_provider_profile
        bookings = ServiceBooking.objects.filter(provider=provider)
        
        from django.utils import timezone
        now = timezone.now()
        thirty_days_ago = now - timezone.timedelta(days=30)
        
        total_bookings = bookings.count()
        pending_bookings = bookings.filter(status='pending').count()
        completed_bookings = bookings.filter(status='completed').count()
        
        # Earnings (sum of agreed_price for non-cancelled/refunded bookings)
        valid_bookings = bookings.exclude(status='cancelled').exclude(payment_status='refunded')
        total_earnings = valid_bookings.aggregate(total=Sum('agreed_price'))['total'] or 0
        
        # Monthly stats
        month_bookings = bookings.filter(created_at__gte=thirty_days_ago).count()
        month_earnings = valid_bookings.filter(created_at__gte=thirty_days_ago).aggregate(total=Sum('agreed_price'))['total'] or 0
        
        # Recent bookings (upcoming, ordered by booking_date)
        from .serializers import ServiceBookingSerializer
        recent_bookings = bookings.filter(
            booking_date__gte=now.date()
        ).order_by('booking_date', 'booking_time')[:5]
        
        # Recent reviews
        from .serializers import ServiceReviewSerializer
        all_recent_reviews = provider.reviews.order_by('-created_at')
        pending_reviews_count = all_recent_reviews.filter(provider_response__isnull=True).count()
        recent_reviews = all_recent_reviews[:5]
        
        # Today's schedule
        today_bookings = bookings.filter(
            booking_date=now.date(),
            status__in=['confirmed', 'pending']
        ).order_by('booking_time')
        
        return Response({
            "total_bookings": total_bookings,
            "pending_bookings": pending_bookings,
            "completed_bookings": completed_bookings,
            "total_earnings": total_earnings,
            "this_month": {
                "bookings": month_bookings,
                "earnings": month_earnings
            },
            "rating": provider.average_rating,
            "reviews": provider.review_count,
            "pending_reviews_count": pending_reviews_count,
            "recent_bookings": ServiceBookingSerializer(recent_bookings, many=True).data,
            "recent_reviews": ServiceReviewSerializer(recent_reviews, many=True).data,
            "today_schedule": ServiceBookingSerializer(today_bookings, many=True).data,
        })


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
        booking.save()
        return Response(ServiceBookingSerializer(booking).data)

    @action(detail=False, methods=['post'])
    def check_availability(self, request):
        """
        Check if a provider is available for specific dates.
        Returns structured time slot data.
        Input: provider_id, date (YYYY-MM-DD)
        """
        provider_id = request.data.get('provider_id')
        date_str = request.data.get('date')
        
        if not all([provider_id, date_str]):
            return Response({"error": "Missing required fields (provider_id, date)"}, status=400)
        
        try:
            from datetime import datetime, timedelta
            from django.utils import timezone
            from .models import BusinessHours, ServiceProvider # Import BusinessHours and ServiceProvider
            
            provider = ServiceProvider.objects.get(id=provider_id)
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            day_of_week = target_date.weekday()  # 0=Monday
            
            # Get business hours for this day
            try:
                business_hour = provider.hours.get(day=day_of_week)
                if business_hour.is_closed:
                    return Response({
                        "is_available": False,
                        "reason": "Provider is closed on this day",
                        "available_slots": []
                    })
                open_time = business_hour.open_time
                close_time = business_hour.close_time
            except BusinessHours.DoesNotExist: # Catch specific exception
                # Default hours if not set
                from datetime import time
                open_time = time(9, 0)
                close_time = time(18, 0)
            
            # Generate time slots (60-minute intervals)
            available_slots = []
            current_time = datetime.combine(target_date, open_time)
            end_time = datetime.combine(target_date, close_time)
            slot_duration = timedelta(hours=1)
            
            # Get all confirmed/pending bookings for this day
            day_start = timezone.make_aware(datetime.combine(target_date, time(0, 0)))
            day_end = timezone.make_aware(datetime.combine(target_date, time(23, 59, 59, 999999))) # Ensure it covers the whole day
            
            bookings = ServiceBooking.objects.filter(
                provider=provider,
                status__in=['confirmed', 'pending'],
                start_datetime__gte=day_start,
                start_datetime__lt=day_end
            )
            
            # Build slot list
            while current_time < end_time:
                slot_start = timezone.make_aware(current_time)
                slot_end = slot_start + slot_duration
                
                # Check if this slot conflicts with any booking
                conflicts = bookings.filter(
                    start_datetime__lt=slot_end,
                    end_datetime__gt=slot_start
                ).count()
                
                # Check capacity for foster services
                is_available = True
                capacity = 1
                
                if hasattr(provider, 'foster_details'):
                    capacity = provider.foster_details.capacity or 1
                    is_available = conflicts < capacity
                else:
                    is_available = conflicts == 0
                
                available_slots.append({
                    "time": current_time.strftime('%H:%M'),
                    "datetime": slot_start.isoformat(),
                    "available": is_available,
                    "capacity": capacity,
                    "booked": conflicts,
                    "duration_minutes": 60
                })
                
                current_time += slot_duration
            
            # Get business hours summary
            business_hours = {}
            for hour in provider.hours.all():
                day_name = dict(BusinessHours.DAYS_OF_WEEK).get(hour.day, '').lower()
                business_hours[day_name] = {
                    "open": hour.open_time.strftime('%H:%M') if hour.open_time else None,
                    "close": hour.close_time.strftime('%H:%M') if hour.close_time else None,
                    "is_closed": hour.is_closed
                }
            
            return Response({
                "provider_id": provider_id,
                "date": date_str,
                "business_hours": business_hours,
                "available_slots": available_slots,
                "total_slots": len(available_slots),
                "available_count": sum(1 for slot in available_slots if slot['available'])
            })
            
        except ServiceProvider.DoesNotExist:
            return Response({"error": "Provider not found"}, status=404)
        except ValueError as e:
            return Response({"error": f"Invalid date format: {str(e)}"}, status=400)
