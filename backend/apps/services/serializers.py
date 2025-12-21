from rest_framework import serializers
from .models import ServiceProvider, FosterService, VeterinaryClinic, ServiceReview
from apps.users.serializers import PublicUserSerializer

class FosterServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FosterService
        fields = [
            'capacity', 'current_count', 'current_availability', 
            'species_accepted', 'environment_details', 'care_standards',
            'daily_rate', 'weekly_discount', 'monthly_rate',
            'photos', 'video_url'
        ]

class VeterinaryClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = VeterinaryClinic
        fields = [
            'clinic_type', 'services_offered', 'species_treated',
            'hours_of_operation', 'pricing_info', 'amenities',
            'emergency_services', 'photos'
        ]

class ServiceReviewSerializer(serializers.ModelSerializer):
    reviewer = PublicUserSerializer(read_only=True)
    rating = serializers.IntegerField(source='rating_overall', read_only=True)
    comment = serializers.CharField(source='review_text', read_only=True)
    
    class Meta:
        model = ServiceReview
        fields = [
            'id', 'provider', 'reviewer', 'rating', 'comment', 
            'rating_communication', 'rating_cleanliness', 'rating_quality', 'rating_value',
            'service_type', 'verified_client', 'created_at'
        ]
        read_only_fields = ['provider', 'reviewer', 'created_at']

class ServiceProviderSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)
    reviews = ServiceReviewSerializer(many=True, read_only=True)
    foster_details = FosterServiceSerializer(required=False)
    vet_details = VeterinaryClinicSerializer(required=False)
    
    avg_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(source='review_count', read_only=True)
    is_verified = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceProvider
        fields = [
            'id', 'user', 'business_name', 'provider_type', 'description', 'website',
            'city', 'state', 'zip_code', 'latitude', 'longitude',
            'phone', 'email', 'license_number', 'verification_status',
            'photos', 'services_offered', 
            'is_verified', 'reviews', 'reviews_count', 'avg_rating', 'distance',
            'foster_details', 'vet_details',
            'created_at'
        ]
        read_only_fields = ['user', 'created_at', 'avg_rating', 'reviews_count']
        
    def get_is_verified(self, obj):
        return obj.verification_status == 'verified'

    def get_distance(self, obj):
        # Placeholder for distance calculation if context has user location
        # This will be handled by the view with annotate normally, but good to have the field exist
        return getattr(obj, 'distance', None)
        
    def create(self, validated_data):
        foster_data = validated_data.pop('foster_details', None)
        vet_data = validated_data.pop('vet_details', None)
        
        provider = ServiceProvider.objects.create(**validated_data)
        
        if provider.provider_type == 'foster' and foster_data:
            FosterService.objects.create(provider=provider, **foster_data)
        elif provider.provider_type == 'vet' and vet_data:
            VeterinaryClinic.objects.create(provider=provider, **vet_data)
            
        return provider
    
    def update(self, instance, validated_data):
        foster_data = validated_data.pop('foster_details', None)
        vet_data = validated_data.pop('vet_details', None)
        
        # Update provider fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update nested
        if instance.provider_type == 'foster' and foster_data:
            FosterService.objects.update_or_create(provider=instance, defaults=foster_data)
        elif instance.provider_type == 'vet' and vet_data:
            VeterinaryClinic.objects.update_or_create(provider=instance, defaults=vet_data)
            
        return instance

