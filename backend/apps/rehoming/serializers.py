from rest_framework import serializers
from .models import RehomingListing, AdoptionApplication, AdoptionContract, RehomingIntervention

class ListingSerializer(serializers.ModelSerializer):
    """Base serializer for RehomingListing"""
    owner_name = serializers.CharField(source='pet_owner.full_name', read_only=True)
    owner_verified_identity = serializers.BooleanField(source='pet_owner.verified_identity', read_only=True)
    age_display = serializers.SerializerMethodField()
    main_photo = serializers.SerializerMethodField()
    
    class Meta:
        model = RehomingListing
        fields = [
            'id', 'pet_name', 'species', 'breed', 'main_photo', 'status', 
            'gender', 'age_display', 'location_city', 'location_state',
            'owner_name', 'owner_verified_identity', 'urgency_level', 'published_at', 
            'adoption_fee', 'created_at', 'behavioral_profile', 'rehoming_story'
        ]

    def get_age_display(self, obj):
        if obj.age:
            return f"{obj.age} years"
        return "Unknown age"

    def get_main_photo(self, obj):
        if obj.photos and len(obj.photos) > 0:
            return obj.photos[0]
        return None

class ListingDetailSerializer(serializers.ModelSerializer):
    """Detailed view serializer for individual listing"""
    owner_name = serializers.CharField(source='pet_owner.full_name', read_only=True)
    owner_email = serializers.EmailField(source='pet_owner.email', read_only=True)
    main_photo = serializers.SerializerMethodField()
    
    class Meta:
        model = RehomingListing
        fields = '__all__'

    def get_main_photo(self, obj):
        if obj.photos and len(obj.photos) > 0:
            return obj.photos[0]
        return None

class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating listings"""
    class Meta:
        model = RehomingListing
        exclude = ['created_at', 'updated_at', 'published_at', 'expires_at']
        read_only_fields = ['pet_owner', 'status']

class AdoptionApplicationSerializer(serializers.ModelSerializer):
    listing_name = serializers.CharField(source='listing.pet_name', read_only=True)
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)
    
    class Meta:
        model = AdoptionApplication
        fields = '__all__'
        read_only_fields = ['applicant', 'status', 'created_at', 'updated_at']


class RehomingInterventionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RehomingIntervention
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

