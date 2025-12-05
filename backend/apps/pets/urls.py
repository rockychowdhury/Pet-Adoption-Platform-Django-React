from django.urls import path
from .views import PetListCreateView, PetRetrieveUpdateDestroyView

urlpatterns = [
    path('', PetListCreateView.as_view(), name='pet-list-create'),
    path('<int:pk>/', PetRetrieveUpdateDestroyView.as_view(), name='pet-detail'),
]
