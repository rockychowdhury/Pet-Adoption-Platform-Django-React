from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserReportViewSet, AdoptionContractViewSet, ListingModerationViewSet, AnalyticsView

router = DefaultRouter()
router.register(r'reports', UserReportViewSet, basename='user-reports')
router.register(r'agreements', AdoptionContractViewSet, basename='adoption-contracts')
router.register(r'listings', ListingModerationViewSet, basename='listing-moderation')

urlpatterns = [
    path('analytics/', AnalyticsView.as_view(), name='admin-analytics'),
    path('', include(router.urls)),
]
