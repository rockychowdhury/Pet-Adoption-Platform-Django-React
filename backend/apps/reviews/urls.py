from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionReviewViewSet

router = DefaultRouter()
router.register(r'adoption-reviews', AdoptionReviewViewSet, basename='adoption-review')

urlpatterns = [
    path('', include(router.urls)),
]
