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

class RehomingRequestViewSet(viewsets.ModelViewSet):
    """
    Manages Owner's Rehoming Requests (The intent to rehome).
    """
    serializer_class = RehomingRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RehomingRequest.objects.filter(owner=self.request.user)

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

        serializer.save(
            owner=user, 
            status=rehoming_status, 
            cooling_period_end=cooling_until,
            location_city=location_city,
            location_state=location_state
        )

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm request after cooling period to proceed to listing."""
        rehoming_req = self.get_object()
        
        if rehoming_req.status == 'confirmed':
             return Response({'status': 'confirmed'}, status=status.HTTP_200_OK)

        if rehoming_req.status != 'cooling_period':
             raise PermissionDenied("Request is not in cooling period.")
             
        if rehoming_req.is_in_cooling_period:
             raise PermissionDenied("Cooling period is still active.")
             
        rehoming_req.status = 'confirmed'
        rehoming_req.confirmed_at = timezone.now()
        rehoming_req.save()
        return Response(self.get_serializer(rehoming_req).data)

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
        queryset = RehomingListing.objects.select_related('owner', 'pet').filter(status='active')
        
        # Filtering logic... (Same as before)
        species = self.request.query_params.get('species')
        if species: queryset = queryset.filter(pet__species__iexact=species)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        # Gate 1: Profile
        if not user.can_create_listing:
             raise PermissionDenied("Profile verification required.")
             
        # Gate 2: Must have a CONFIRMED RehomingRequest
        # We expect 'request_id' in body or look it up based on pet?
        # The serializer might not have 'request' field if it's read_only. 
        # But we need to link it.
        
        request_id = self.request.data.get('request_id')
        if not request_id:
            raise PermissionDenied("Rehoming Request ID required.")
            
        try:
            rehoming_req = RehomingRequest.objects.get(id=request_id, owner=user)
        except RehomingRequest.DoesNotExist:
            raise NotFound("Rehoming Request not found.")
            
        if not rehoming_req.can_proceed_to_listing:
             raise PermissionDenied("Rehoming Request is not ready (Cooling or Terms not accepted).")
             
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
