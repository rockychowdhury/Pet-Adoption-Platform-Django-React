from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserReportViewSet, LegalAgreementViewSet

router = DefaultRouter()
router.register(r'reports', UserReportViewSet, basename='user-reports')
router.register(r'agreements', LegalAgreementViewSet, basename='legal-agreements')

urlpatterns = [
    path('', include(router.urls)),
]
