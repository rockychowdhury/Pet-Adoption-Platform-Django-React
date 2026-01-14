from django.urls import path, include
from .views import (
    ListingListCreateView, ListingRetrieveUpdateDestroyView, MyListingListView,
    RehomingRequestViewSet, AdoptionInquiryViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# Owner's Request (The Rehoming Process)
router.register(r'requests', RehomingRequestViewSet, basename='rehoming-request')

# Adopter's Inquiry (The Application to Adopt)
router.register(r'inquiries', AdoptionInquiryViewSet, basename='adoption-inquiry')

urlpatterns = [
    path('listings/', ListingListCreateView.as_view(), name='listing-list-create'),
    path('my-listings/', MyListingListView.as_view(), name='my-listing-list'),
    path('listings/<int:pk>/', ListingRetrieveUpdateDestroyView.as_view(), name='listing-detail'),
    path('', include(router.urls)),
]
