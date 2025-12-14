from rest_framework import serializers
from .models import RehomingListing

class PetSerializer(serializers.ModelSerializer):
    """Base serializer for RehomingListing (formerly Pet)"""
    owner_name = serializers.CharField(source='pet_owner.full_name', read_only=True)
    age_display = serializers.CharField(read_only=True)
    
    class Meta:
        model = RehomingListing
        fields = [
            'id', 'pet_name', 'species', 'breed', 'photos', 'status', 
            'gender', 'age_display', 'adoption_fee', 'location_city', 'location_state',
            'owner_name', 'created_at', 'published_at'
        ]


class PetListSerializer(serializers.ModelSerializer):
    """List view serializer for browsing listings"""
    owner_name = serializers.CharField(source='pet_owner.full_name', read_only=True)
    age_display = serializers.CharField(read_only=True)
    main_photo = serializers.SerializerMethodField()
    
    class Meta:
        model = RehomingListing
        fields = [
            'id', 'pet_name', 'species', 'breed', 'main_photo', 'status', 
            'gender', 'age_display', 'adoption_fee', 'location_city', 'location_state',
            'owner_name', 'urgency_level', 'published_at'
        ]
    
    def get_main_photo(self, obj):
        """Get first photo from listing"""
        if obj.photos and len(obj.photos) > 0:
            return obj.photos[0]
        return None


class PetDetailSerializer(serializers.ModelSerializer):
    """Detailed view serializer for individual listing"""
    owner_name = serializers.CharField(source='pet_owner.full_name', read_only=True)
    owner_email = serializers.EmailField(source='pet_owner.email', read_only=True)
    age_display = serializers.CharField(read_only=True)
    
    class Meta:
        model = RehomingListing
        fields = '__all__'


class PetCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating listings"""
    class Meta:
        model = RehomingListing
        exclude = ['created_at', 'updated_at', 'published_at', 'expires_at']
        read_only_fields = ['pet_owner', 'status']
