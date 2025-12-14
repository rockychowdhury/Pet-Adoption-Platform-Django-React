from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RehomingInterventionViewSet

router = DefaultRouter()
router.register(r'intervention', RehomingInterventionViewSet, basename='intervention')

urlpatterns = [
    path('', include(router.urls)),
]
