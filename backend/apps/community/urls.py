from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, EventViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
