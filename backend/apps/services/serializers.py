from rest_framework import serializers
from .models import (
    ServiceCategory, Species, Specialization, ServiceOption,
    ServiceProvider, ServiceMedia, BusinessHours,
    FosterService, VeterinaryClinic, TrainerService,
    ServiceBooking, ServiceReview
)
from apps.users.serializers import PublicUserSerializer
from apps.pets.serializers import PetProfileSerializer

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon_name']

class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'slug']

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'description']

class ServiceOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceOption
        fields = ['id', 'name', 'base_price', 'description']

class ServiceMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceMedia
        fields = ['id', 'file_url', 'thumbnail_url', 'is_primary', 'alt_text']

class BusinessHoursSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    
    class Meta:
        model = BusinessHours
        fields = ['id', 'day', 'day_display', 'open_time', 'close_time', 'is_closed']

class FosterServiceSerializer(serializers.ModelSerializer):
    species_accepted = SpeciesSerializer(many=True, read_only=True)
    species_accepted_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Species.objects.all(), source='species_accepted'
    )
    
    class Meta:
        model = FosterService
        fields = [
            'capacity', 'current_count', 'current_availability', 
            'species_accepted', 'species_accepted_ids', 'environment_details', 'care_standards',
            'daily_rate', 'weekly_discount', 'monthly_rate',
            'video_url'
        ]

class VeterinaryClinicSerializer(serializers.ModelSerializer):
    services_offered = ServiceOptionSerializer(many=True, read_only=True)
    services_offered_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=ServiceOption.objects.all(), source='services_offered'
    )
    species_treated = SpeciesSerializer(many=True, read_only=True)
    species_treated_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Species.objects.all(), source='species_treated'
    )
    
    class Meta:
        model = VeterinaryClinic
        fields = [
            'clinic_type', 'services_offered', 'services_offered_ids', 
            'species_treated', 'species_treated_ids',
            'pricing_info', 'amenities', 'emergency_services'
        ]

class TrainerServiceSerializer(serializers.ModelSerializer):
    specializations = SpecializationSerializer(many=True, read_only=True)
    specializations_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Specialization.objects.all(), source='specializations'
    )
    species_trained = SpeciesSerializer(many=True, read_only=True)
    species_trained_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Species.objects.all(), source='species_trained'
    )
    
    class Meta:
        model = TrainerService
        fields = [
            'specializations', 'specializations_ids', 'primary_method', 'training_philosophy',
            'certifications', 'years_experience', 'species_trained', 'species_trained_ids',
            'offers_private_sessions', 'offers_group_classes',
            'offers_board_and_train', 'offers_virtual_training',
            'private_session_rate', 'group_class_rate', 'package_options',
            'max_clients', 'current_client_count', 'accepting_new_clients',
            'video_url'
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
    category = ServiceCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCategory.objects.all(), 
        write_only=True, 
        source='category',
        required=True
    )
    media = ServiceMediaSerializer(many=True, read_only=True)
    hours = BusinessHoursSerializer(many=True, read_only=True)
    reviews = ServiceReviewSerializer(many=True, read_only=True)
    
    foster_details = FosterServiceSerializer(required=False)
    vet_details = VeterinaryClinicSerializer(required=False)
    trainer_details = TrainerServiceSerializer(required=False)
    
    avg_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(source='review_count', read_only=True)
    is_verified = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceProvider
        fields = [
            'id', 'user', 'business_name', 'category', 'category_id', 'description', 'website',
            'city', 'state', 'zip_code', 'latitude', 'longitude',
            'phone', 'email', 'license_number', 'verification_status',
            'media', 'hours',
            'is_verified', 'reviews', 'reviews_count', 'avg_rating', 'distance',
            'foster_details', 'vet_details', 'trainer_details',
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
        trainer_data = validated_data.pop('trainer_details', None)
        
        provider = ServiceProvider.objects.create(**validated_data)
        
        # Note: Detailed service creation would ideally handle M2M and Hours here too
        # but for now we follow the existing pattern for the OneToOne fields.
        
        if foster_data:
            FosterService.objects.create(provider=provider, **foster_data)
        elif vet_data:
            VeterinaryClinic.objects.create(provider=provider, **vet_data)
        elif trainer_data:
            TrainerService.objects.create(provider=provider, **trainer_data)
            
        return provider
    
    def update(self, instance, validated_data):
        foster_data = validated_data.pop('foster_details', None)
        vet_data = validated_data.pop('vet_details', None)
        trainer_data = validated_data.pop('trainer_details', None)
        
        # Update provider fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Helper to update nested service
        def update_nested_service(model, data, related_name, m2m_fields=[]):
            # Extract M2M data to handle separately
            m2m_data = {}
            for field in m2m_fields:
                if field in data:
                    m2m_data[field] = data.pop(field)
            
            obj, created = model.objects.update_or_create(provider=instance, defaults=data)
            
            # Set M2M relationships
            for field, values in m2m_data.items():
                getattr(obj, field).set(values)

        if foster_data:
            update_nested_service(FosterService, foster_data, 'foster_details', ['species_accepted'])
        elif vet_data:
            update_nested_service(VeterinaryClinic, vet_data, 'vet_details', ['services_offered', 'species_treated'])
        elif trainer_data:
            update_nested_service(TrainerService, trainer_data, 'trainer_details', ['specializations', 'species_trained'])
            
        return instance

class ServiceBookingSerializer(serializers.ModelSerializer):
    provider = ServiceProviderSerializer(read_only=True)
    client = PublicUserSerializer(read_only=True)
    pet = PetProfileSerializer(read_only=True)
    service_option = ServiceOptionSerializer(read_only=True)
    
    class Meta:
        model = ServiceBooking
        fields = [
            'id', 'provider', 'client', 'pet', 'service_option', 
            'booking_type', 'start_date', 'end_date', 
            'agreed_price', 'deposit_paid', 'special_requirements',
            'status', 'payment_status', 'cancellation_reason',
            'created_at', 'updated_at', 'duration_hours'
        ]
        read_only_fields = ['client', 'agreed_price', 'deposit_paid', 'status', 'payment_status', 'created_at', 'updated_at']

class ServiceBookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceBooking
        fields = [
            'provider', 'pet', 'service_option', 
            'booking_type', 'start_date', 'end_date', 
            'special_requirements'
        ]
    
    def validate(self, attrs):
        # Validate that the pet belongs to the user
        request = self.context.get('request')
        if request and request.user != attrs['pet'].owner:
             raise serializers.ValidationError("You can only book services for your own pets.")
        return attrs
