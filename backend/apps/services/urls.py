from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceProviderViewSet

router = DefaultRouter()
router.register(r'providers', ServiceProviderViewSet, basename='service-provider')

urlpatterns = [
    path('', include(router.urls)),
]
