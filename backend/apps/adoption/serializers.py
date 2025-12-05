from rest_framework import serializers
from .models import AdoptionApplication
from apps.pets.models import Pet
from apps.users.serializers import UserSerializer

class AdoptionApplicationSerializer(serializers.ModelSerializer):
    applicant = serializers.StringRelatedField(read_only=True)
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    pet_image = serializers.CharField(source='pet.photo_url', read_only=True)

    class Meta:
        model = AdoptionApplication
        fields = ['id', 'applicant', 'pet', 'pet_name', 'pet_image', 'message', 'status', 'created_at', 'updated_at']
        read_only_fields = ['applicant', 'status']
