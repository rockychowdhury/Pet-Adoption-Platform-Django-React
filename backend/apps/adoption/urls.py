from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionApplicationViewSet, AdopterProfileViewSet

router = DefaultRouter()
router.register(r'applications', AdoptionApplicationViewSet, basename='application')
router.register(r'adopter-profile', AdopterProfileViewSet, basename='adopter-profile')

urlpatterns = [
    path('', include(router.urls)),
]
