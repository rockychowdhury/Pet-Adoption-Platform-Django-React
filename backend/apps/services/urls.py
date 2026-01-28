from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceProviderViewSet, ServiceCategoryViewSet, SpeciesViewSet, ServiceOptionViewSet, ServiceBookingViewSet, SpecializationViewSet

router = DefaultRouter()
router.register(r'providers', ServiceProviderViewSet, basename='service-provider')
router.register(r'categories', ServiceCategoryViewSet, basename='service-category')
router.register(r'species', SpeciesViewSet, basename='species')
router.register(r'options', ServiceOptionViewSet, basename='service-option')
router.register(r'specializations', SpecializationViewSet, basename='specialization')
router.register(r'bookings', ServiceBookingViewSet, basename='service-booking')

urlpatterns = [
    path('', include(router.urls)),
]
