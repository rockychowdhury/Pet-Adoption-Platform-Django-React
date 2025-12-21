from django.urls import path, include
from .views import (
    ListingListCreateView, ListingRetrieveUpdateDestroyView,
    RehomingInterventionViewSet, AdoptionApplicationViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'intervention', RehomingInterventionViewSet, basename='rehoming-intervention')
router.register(r'applications', AdoptionApplicationViewSet, basename='adoption-application')

urlpatterns = [
    path('listings/', ListingListCreateView.as_view(), name='listing-list-create'),
    path('listings/<int:pk>/', ListingRetrieveUpdateDestroyView.as_view(), name='listing-detail'),
    path('', include(router.urls)),
]
