from rest_framework import serializers
from .models import AdoptionApplication, AdopterProfile
from apps.pets.models import RehomingListing
from apps.users.serializers import UserSerializer

class AdoptionApplicationSerializer(serializers.ModelSerializer):
    applicant = serializers.StringRelatedField(read_only=True)
    applicant_id = serializers.PrimaryKeyRelatedField(source='applicant', read_only=True)
    applicant_email = serializers.EmailField(source='applicant.email', read_only=True)
    pet_name = serializers.CharField(source='pet.pet_name', read_only=True)
    pet_image = serializers.SerializerMethodField(read_only=True)
    pet_breed = serializers.CharField(source='pet.breed', read_only=True)
    pet_age_display = serializers.CharField(source='pet.age_display', read_only=True)
    owner_name = serializers.CharField(source='pet.pet_owner.first_name', read_only=True) 
    pet_owner_id = serializers.PrimaryKeyRelatedField(source='pet.pet_owner', read_only=True) 

    class Meta:
        model = AdoptionApplication
        fields = [
            'id', 'applicant', 'applicant_id', 'applicant_email', 'pet', 'pet_name', 'pet_image', 'pet_breed', 'pet_age_display', 
            'owner_name', 'pet_owner_id',
            'adopter_profile', 'message', 'custom_answers', 'readiness_score', 'status', 
            'rejection_reason', 'owner_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['applicant', 'status', 'rejection_reason', 'readiness_score']
    
    def get_pet_image(self, obj):
        """Get first photo from pet listing"""
        if obj.pet and obj.pet.photos and len(obj.pet.photos) > 0:
            return obj.pet.photos[0]
        return None


class AdopterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdopterProfile
        fields = [
            'id', 'user', 'housing_type', 'own_or_rent', 'landlord_approval', 'landlord_document_url',
            'yard_type', 'yard_fenced', 'num_adults', 'num_children', 'children_ages',
            'current_pets', 'pet_experience', 'work_schedule', 'activity_level',
            'exercise_commitment_hours', 'travel_frequency', 'references',
            'why_adopt', 'ideal_pet_description', 'readiness_score', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'readiness_score', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
