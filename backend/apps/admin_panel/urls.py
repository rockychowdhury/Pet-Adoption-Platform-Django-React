from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserReportViewSet, ListingModerationViewSet, AnalyticsView, ModerationLogViewSet, RoleRequestViewSet

router = DefaultRouter()
router.register(r'reports', UserReportViewSet, basename='user-reports')
router.register(r'listings', ListingModerationViewSet, basename='listing-moderation')
router.register(r'moderation-actions', ModerationLogViewSet, basename='moderation-actions')
router.register(r'role-requests', RoleRequestViewSet, basename='role-requests')

urlpatterns = [
    path('analytics/', AnalyticsView.as_view(), name='admin-analytics'),
    path('', include(router.urls)),
]
