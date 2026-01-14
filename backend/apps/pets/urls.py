from django.urls import path
from .views import (
    PetProfileListCreateView, 
    PetProfileDetailView, 
    PetMediaCreateView, 
    PetMediaDetailView,
    PersonalityTraitListView
)

urlpatterns = [
    path('profiles/', PetProfileListCreateView.as_view(), name='pet-profile-list'),
    path('profiles/<int:pk>/', PetProfileDetailView.as_view(), name='pet-profile-detail'),
    path('profiles/<int:pet_id>/media/', PetMediaCreateView.as_view(), name='pet-media-create'),
    path('media/<int:pk>/', PetMediaDetailView.as_view(), name='pet-media-detail'),
    path('traits/', PersonalityTraitListView.as_view(), name='personality-trait-list'),
]
