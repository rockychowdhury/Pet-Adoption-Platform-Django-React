from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import AuthenticationFailed
from .models import UserPet, UserProfile, VerificationDocument, RoleRequest

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs['email'])
        except User.DoesNotExist:
            return super().validate(attrs)

        if user and not user.is_active:
            raise AuthenticationFailed(
                detail={'detail': 'Your account has been deactivated.', 'code': 'account_deactivated'}
            )
        
        data = super().validate(attrs)
        data['role'] = user.role
        data['user_id'] = user.id
        data['is_verified'] = user.is_verified
        return data

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'photoURL', 'role', 'verified_identity', 'pet_owner_verified', 'location_city', 'location_state']

class UserPetSerializer(serializers.ModelSerializer):
    owner = PublicUserSerializer(read_only=True)
    class Meta:
        model = UserPet
        fields = ['id', 'owner', 'name', 'species', 'breed', 'age', 'gender', 'bio', 'personality_traits', 'gotcha_day', 'profile_photo']

class UserProfileSerializer(serializers.ModelSerializer):
    """Nested serializer for UserProfile model"""
    class Meta:
        model = UserProfile
        fields = ['privacy_settings', 'verification_badges', 'created_at']

class VerificationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationDocument
        fields = ['id', 'document_type', 'document_url', 'status', 'admin_notes', 'reviewed_at', 'created_at']
        read_only_fields = ['status', 'admin_notes', 'reviewed_at', 'created_at']

class RoleRequestSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = RoleRequest
        fields = ['id', 'user', 'user_email', 'requested_role', 'reason', 'status', 'admin_notes', 'created_at', 'updated_at']
        read_only_fields = ['user', 'status', 'admin_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','password','first_name','last_name', 'phone_number', 'location_city', 'location_state']
        extra_kwargs = {
            "password":{"write_only":True},
            }
    
    def validate_password(self, value):
        """Validate password strength using Django's password validators"""
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
            
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # Create empty profile
        UserProfile.objects.create(user=user)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    privacy_settings = serializers.DictField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'photoURL', 'bio', 
                  'location_city', 'location_state', 'location_country', 'privacy_settings']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
            'photoURL': {'required': False},
            'bio': {'required': False},
        }

    def update(self, instance, validated_data):
        privacy_data = validated_data.pop('privacy_settings', None)
        
        # Update User fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update Profile fields
        if privacy_data is not None:
            # Create profile if missing (though it should exist via signal/create logic)
            if not hasattr(instance, 'profile'):
                UserProfile.objects.create(user=instance, privacy_settings=privacy_data)
            else:
                profile = instance.profile
                # Initialize default if empty
                if not profile.privacy_settings:
                    profile.privacy_settings = {}
                # Update keys
                profile.privacy_settings.update(privacy_data)
                profile.save()
                
        return instance

class UserSerializer(serializers.ModelSerializer):
    user_pets = UserPetSerializer(many=True, read_only=True)
    profile = UserProfileSerializer(read_only=True)
    verification_documents = VerificationDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'photoURL', 'bio', 
            'phone_number', 'location_city', 'location_state', 'location_country',
            'email_verified', 'phone_verified', 'verified_identity', 'pet_owner_verified',
            'is_user', 'is_service_provider', 'is_admin', 
            'can_create_listing', 'account_status',
            'user_pets', 'profile', 'verification_documents'
        ]


