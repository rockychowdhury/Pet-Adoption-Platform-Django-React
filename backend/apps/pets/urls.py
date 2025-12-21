from django.urls import path
from .views import PetProfileListCreateView, PetProfileDetailView

urlpatterns = [
    path('profiles/', PetProfileListCreateView.as_view(), name='pet-profile-list'),
    path('profiles/<int:pk>/', PetProfileDetailView.as_view(), name='pet-profile-detail'),
]
