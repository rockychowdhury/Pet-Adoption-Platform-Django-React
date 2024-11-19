from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,TokenVerifyView)
from .views import UserProfileView,LogoutView,UserRegistrationView

urlpatterns = [
    path('',UserProfileView.as_view(),name="user_profile"),
    path('token/',TokenObtainPairView.as_view(), name = 'access_token'),
    path('token/refresh/',TokenRefreshView.as_view(), name = 'refresh_token'),
    path('token/verify/',TokenVerifyView.as_view(), name = 'token_verify'),
    path('register/',UserRegistrationView.as_view(),name="logout"),
    path('logout/',LogoutView.as_view(),name="register"),
]
