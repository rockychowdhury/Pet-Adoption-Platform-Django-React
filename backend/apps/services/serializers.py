from rest_framework import serializers
from .models import ServiceProvider, FosterService, VeterinaryClinic, ServiceReview
from apps.users.serializers import PublicUserSerializer

class FosterServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FosterService
        fields = ['capacity', 'current_count', 'accepted_species', 'housing_conditions']

class VeterinaryClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = VeterinaryClinic
        fields = ['emergency_services', 'hours_of_operation']

class ServiceReviewSerializer(serializers.ModelSerializer):
    reviewer = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = ServiceReview
        fields = ['id', 'provider', 'reviewer', 'rating', 'comment', 'created_at']
        read_only_fields = ['provider', 'reviewer', 'created_at']

class ServiceProviderSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)
    reviews = ServiceReviewSerializer(many=True, read_only=True)
    foster_details = FosterServiceSerializer(required=False)
    vet_details = VeterinaryClinicSerializer(required=False)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.IntegerField(source='reviews.count', read_only=True)
    
    class Meta:
        model = ServiceProvider
        fields = [
            'id', 'user', 'business_name', 'provider_type', 'description', 'website',
            'location_city', 'location_state', 'location_lat', 'location_lng',
            'services_offered', 'is_verified', 'reviews', 'foster_details', 'vet_details',
            'avg_rating', 'review_count', 'created_at'
        ]
        read_only_fields = ['user', 'is_verified', 'created_at']
        
    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)
        
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
