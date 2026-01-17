from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from django.utils import timezone
from django.db.models import Q
from .models import RehomingListing, RehomingRequest, AdoptionInquiry
from .serializers import (
    ListingSerializer,
    ListingDetailSerializer,
    ListingCreateUpdateSerializer,
    RehomingRequestSerializer,
    AdoptionInquirySerializer
)
from apps.users.permissions import IsAdmin, IsOwnerOrReadOnly
import datetime
import math

class RehomingRequestViewSet(viewsets.ModelViewSet):
    """
    Manages Owner's Rehoming Requests (The intent to rehome).
    """
    serializer_class = RehomingRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RehomingRequest.objects.filter(owner=self.request.user)

    def _create_listing_from_request(self, rehoming_req):
        """Helper to create listing from confirmed request"""
        listing, created = RehomingListing.objects.get_or_create(
            request=rehoming_req,
            defaults={
                'owner': rehoming_req.owner,
                'pet': rehoming_req.pet,
                'reason': rehoming_req.reason,
                'urgency': rehoming_req.urgency,
                'ideal_home_notes': rehoming_req.ideal_home_notes,
                'location_city': rehoming_req.location_city,
                'location_state': rehoming_req.location_state,
                'status': 'active', # Immediately active
                'privacy_level': rehoming_req.privacy_level
            }
        )
        return listing

    def perform_create(self, serializer):
        user = self.request.user
        if not user.profile_is_complete:
            raise PermissionDenied("Complete your user profile before starting.")

        urgency = serializer.validated_data.get('urgency', 'flexible')
        rehoming_status = 'draft' # Default
        cooling_until = None

        # Logic: If immediate, skip cooling. Else, 5min cooling.
        if urgency == 'immediate':
            rehoming_status = 'confirmed'
            cooling_until = None
        else:
            rehoming_status = 'cooling_period'
            cooling_until = timezone.now() + datetime.timedelta(minutes=5)
        
        # SIMPLIFIED FLOW: Removed override for 5min rule
        # rehoming_status = 'confirmed'
        # cooling_until = None
        
        # Default location to user profile if not provided
        location_city = serializer.validated_data.get('location_city')
        if not location_city:
            location_city = user.location_city
            
        location_state = serializer.validated_data.get('location_state')
        if not location_state:
            location_state = user.location_state

        instance = serializer.save(
            owner=user, 
            status=rehoming_status, 
            cooling_period_end=cooling_until,
            location_city=location_city,
            location_state=location_state
        )

        if instance.status == 'confirmed':
            self._create_listing_from_request(instance)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm request after cooling period to proceed to listing."""
        rehoming_req = self.get_object()
        
        if rehoming_req.status == 'confirmed':
             return Response({'status': 'confirmed'}, status=status.HTTP_200_OK)

        if rehoming_req.status != 'cooling_period':
             raise PermissionDenied("Request is not in cooling period.")
             
        # Precise server-side time check
        now = timezone.now()
        if rehoming_req.cooling_period_end and rehoming_req.cooling_period_end > now:
             time_remaining = (rehoming_req.cooling_period_end - now).total_seconds()
             return Response(
                {
                    'error': 'Cooling period is still active.',
                    'seconds_remaining': int(time_remaining),
                    'ends_at': rehoming_req.cooling_period_end.isoformat()
                },
                status=status.HTTP_400_BAD_REQUEST
             )
             
        # Proceed with confirmation
        rehoming_req.status = 'confirmed'
        rehoming_req.confirmed_at = now
        rehoming_req.save()
        
        # AUTO-CREATE LISTING (Phase 5 Simplification)
        # Check if listing exists first to be safe
        listing = self._create_listing_from_request(rehoming_req)
        
        # Return listing info
        response_data = self.get_serializer(rehoming_req).data
        response_data['listing_id'] = listing.id
        return Response(response_data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel the rehoming request."""
        rehoming_req = self.get_object()
        rehoming_req.cancel(reason=request.data.get('reason', 'User cancelled'))
        return Response({'status': 'cancelled'})


class ListingListCreateView(generics.ListCreateAPIView):
    queryset = RehomingListing.objects.all()
    serializer_class = ListingSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ListingCreateUpdateSerializer
        return ListingSerializer

    def get_queryset(self):
        from django.db.models import Count
        queryset = RehomingListing.objects.select_related('owner', 'pet').filter(status='active').annotate(
            application_count=Count('inquiries')
        )
        
        # Filtering logic
        params = self.request.query_params
        
        # 1. Text Search (Name, Breed, City)
        search_query = params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(pet__name__icontains=search_query) |
                Q(pet__breed__icontains=search_query) |
                Q(location_city__icontains=search_query)
            )

        # 2. Location & Radius Filtering
        location_lat = params.get('lat')
        location_lon = params.get('lng') # or 'lon'
        radius = params.get('radius') # in miles/km

        if location_lat and location_lon and radius:
            try:
                lat = float(location_lat)
                lon = float(location_lon)
                rad = float(radius)
                
                # Simple bounding box first for speed
                # 1 deg lat ~= 69 miles (111km)
                # 1 deg lon ~= 69 miles * cos(lat)
                # This is an approximation
                
                lat_delta = rad / 69.0
                lon_delta = rad / (69.0 * abs(math.cos(math.radians(lat))))
                
                queryset = queryset.filter(
                    latitude__range=(lat - lat_delta, lat + lat_delta),
                    longitude__range=(lon - lon_delta, lon + lon_delta)
                )
                
                # Optionally: Exact distance calculation could be done here or in DB if using PostGIS
                # For SQLite/Basic, Bounding Box is usually sufficient for small datasets
            except (ValueError, TypeError):
                pass
        
        # 3. Standard Filters
        species = params.get('species')
        if species: queryset = queryset.filter(pet__species__iexact=species)
        
        breed = params.get('breed')
        if breed: queryset = queryset.filter(pet__breed__icontains=breed)

        gender = params.get('gender')
        if gender: queryset = queryset.filter(pet__gender__iexact=gender)
        
        urgency = params.get('urgency_level')
        if urgency: queryset = queryset.filter(urgency=urgency)
        
        # Ordering
        ordering = params.get('ordering', '-published_at')
        if ordering in ['published_at', '-published_at', 'created_at', '-created_at']:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        # Gate 1: Profile
        if not user.can_create_listing:
             raise PermissionDenied("Profile verification required.")
             
        # Gate 2: Must have a CONFIRMED RehomingRequest
        request_id = self.request.data.get('request_id')
        if not request_id:
            raise PermissionDenied("Rehoming Request ID required.")
            
        try:
            rehoming_req = RehomingRequest.objects.get(id=request_id, owner=user)
        except RehomingRequest.DoesNotExist:
            raise NotFound("Rehoming Request not found.")
            
        if rehoming_req.status != 'confirmed':
             raise PermissionDenied("Rehoming Request is not confirmed.")

        # Gate 3: Listing must not already exist
        if hasattr(rehoming_req, 'listing'):
            from rest_framework.exceptions import ValidationError
            raise ValidationError("A listing already exists for this request.")
             
        # Create Listing linked to request
        serializer.save(
            owner=user, 
            request=rehoming_req,
            pet=rehoming_req.pet,  # Use pet from request
            # Copy fields for context
            reason=rehoming_req.reason,
            urgency=rehoming_req.urgency,
            ideal_home_notes=rehoming_req.ideal_home_notes,
            location_city=rehoming_req.location_city,
            location_state=rehoming_req.location_state
        )


class ListingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RehomingListing.objects.all()
    serializer_class = ListingDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]


class AdoptionInquiryViewSet(viewsets.ModelViewSet):
    """
    Manages Adopter Inquiries (formerly RehomingRequest).
    """
    serializer_class = AdoptionInquirySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return AdoptionInquiry.objects.filter(
            Q(requester=user) | Q(listing__owner=user)
        ).select_related('listing', 'requester').distinct()

    def perform_create(self, serializer):
        listing = serializer.validated_data['listing']
        if listing.owner == self.request.user:
             raise PermissionDenied("You cannot request your own pet.")
        
        if AdoptionInquiry.objects.filter(listing=listing, requester=self.request.user).exists():
             raise PermissionDenied("You have already sent an inquiry for this pet.")
             
        serializer.save(requester=self.request.user)

class MyListingListView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RehomingListing.objects.filter(owner=self.request.user).order_by('-updated_at')
