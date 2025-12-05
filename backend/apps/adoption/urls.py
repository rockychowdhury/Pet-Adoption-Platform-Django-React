from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionApplicationViewSet

router = DefaultRouter()
router.register(r'', AdoptionApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
]
