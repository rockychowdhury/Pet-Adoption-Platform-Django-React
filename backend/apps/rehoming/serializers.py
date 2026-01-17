from rest_framework import serializers
from .models import RehomingListing, RehomingRequest, AdoptionInquiry
from apps.users.serializers import PublicUserSerializer
from apps.pets.models import PetProfile

class PetSnapshotSerializer(serializers.ModelSerializer):
    """
    Read-only snapshot of the pet for listing display.
    """
    age_display = serializers.SerializerMethodField()
    main_photo = serializers.SerializerMethodField()
    photos = serializers.SerializerMethodField()

    class Meta:
        model = PetProfile
        fields = ['id', 'name', 'species', 'breed', 'gender', 'age_display', 'main_photo', 'photos', 'status']

    def get_age_display(self, obj):
        if obj.birth_date:
            # Simple approximation, can be improved
            import datetime
            today = datetime.date.today()
            age = today.year - obj.birth_date.year - ((today.month, today.day) < (obj.birth_date.month, obj.birth_date.day))
            return f"{age} years"
        return "Unknown"

    def get_main_photo(self, obj):
        main = obj.media.filter(is_primary=True).first()
        if main:
            return main.url
        # Fallback to any photo
        any_photo = obj.media.first()
        return any_photo.url if any_photo else None

    def get_photos(self, obj):
        """Return all photos for gallery"""
        return [
            {
                'url': media.url,
                'is_primary': media.is_primary
            }
            for media in obj.media.all().order_by('-is_primary', 'uploaded_at')
        ]

class ListingSerializer(serializers.ModelSerializer):
    """List view serializer"""
    owner = PublicUserSerializer(read_only=True)
    pet = PetSnapshotSerializer(read_only=True)
    application_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = RehomingListing
        fields = [
            'id', 'pet', 'owner', 'status', 
            'urgency', 'location_city', 'location_state',
            'published_at', 'created_at', 'reason', 'application_count', 'view_count', 'privacy_level',
            'latitude', 'longitude'
        ]

class ListingDetailSerializer(serializers.ModelSerializer):
    """Detailed view serializer"""
    owner = PublicUserSerializer(read_only=True)
    pet = PetSnapshotSerializer(read_only=True)
    
    class Meta:
        model = RehomingListing
        fields = '__all__'

class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating listings"""
    class Meta:
        model = RehomingListing
        exclude = ['created_at', 'updated_at', 'published_at', 'view_count']
        read_only_fields = ['owner', 'status', 'request', 'pet']

class RehomingRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for the owner's request to rehome a pet.
    """
    pet_details = PetSnapshotSerializer(source='pet', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_in_cooling = serializers.BooleanField(source='is_in_cooling_period', read_only=True)

    class Meta:
        model = RehomingRequest
        fields = [
            'id', 'pet', 'pet_details', 'owner', 'reason', 'urgency', 
            'ideal_home_notes', 'location_city', 'location_state', 
            'status', 'status_display', 'cooling_period_end', 'is_in_cooling',
            'terms_accepted', 'privacy_level', 'created_at'
        ]
        read_only_fields = ['owner', 'status', 'cooling_period_end']
        extra_kwargs = {
            'location_city': {'required': False},
            'location_state': {'required': False},
        }

class AdoptionInquirySerializer(serializers.ModelSerializer):
    """
    Serializer for adopter inquiries (formerly RehomingRequest).
    """
    listing_pet_name = serializers.CharField(source='listing.pet.name', read_only=True)
    requester_name = serializers.CharField(source='requester.full_name', read_only=True)
    
    class Meta:
        model = AdoptionInquiry
        fields = '__all__'
        read_only_fields = ['requester', 'status', 'created_at', 'updated_at']
