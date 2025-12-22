from rest_framework import serializers
from .models import PetProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class PetOwnerSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'photoURL', 'role', 'verified_identity', 'pet_owner_verified', 'location_city', 'location_state']

class PetProfileSerializer(serializers.ModelSerializer):
    owner = PetOwnerSimpleSerializer(read_only=True)
    
    class Meta:
        model = PetProfile
        fields = [
            'id', 'owner', 'name', 'species', 'breed', 
            'birth_date', 'age', 'gender', 'weight', 'size_category',
            'personality_traits', 'health_status', 
            'is_spayed_neutered', 'is_microchipped', 'microchip_number',
            'description', 'photos', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'owner']
