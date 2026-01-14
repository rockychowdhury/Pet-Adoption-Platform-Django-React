from rest_framework import serializers
from .models import PetProfile, PetMedia, PersonalityTrait, PetPersonality
from django.contrib.auth import get_user_model

User = get_user_model()

class PetOwnerSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'photoURL', 'role', 'verified_identity', 'pet_owner_verified', 'location_city', 'location_state']

class PetMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetMedia
        fields = ['id', 'url', 'delete_url', 'is_primary', 'uploaded_at']

class PersonalityTraitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalityTrait
        fields = ['id', 'name']

class PetProfileSerializer(serializers.ModelSerializer):
    owner = PetOwnerSimpleSerializer(read_only=True)
    media = PetMediaSerializer(many=True, read_only=True)
    traits = serializers.SerializerMethodField()

    class Meta:
        model = PetProfile
        fields = [
            'id', 'owner', 'name', 'species', 'breed', 
            'birth_date', 'gender', 'weight_kg', 'size_category',
            'spayed_neutered', 'microchipped',
            'description', 'media', 'traits', 'status',
            'created_at', 'updated_at', 'profile_is_complete'
        ]
        read_only_fields = ['created_at', 'updated_at', 'owner']

    def get_traits(self, obj):
        # obj.traits returns PetPersonality instances
        pet_personalities = obj.traits.all()
        return [
            {
                'id': pp.trait.id,
                'name': pp.trait.name,
            }
            for pp in pet_personalities
        ]

class PetProfileCreateUpdateSerializer(serializers.ModelSerializer):
    traits = serializers.ListField(
        child=serializers.CharField(), 
        write_only=True, 
        required=False
    )
    media_data = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = PetProfile
        fields = [
            'id', 'name', 'species', 'breed', 
            'birth_date', 'gender', 'weight_kg', 'size_category',
            'spayed_neutered', 'microchipped',
            'description', 'traits', 'media_data', 'status'
        ]

    def create(self, validated_data):
        traits_data = validated_data.pop('traits', [])
        media_data = validated_data.pop('media_data', [])
        
        pet = PetProfile.objects.create(**validated_data)
        
        self._assign_traits(pet, traits_data)
        self._assign_media(pet, media_data)
        
        return pet

    def update(self, instance, validated_data):
        traits_data = validated_data.pop('traits', None)
        media_data = validated_data.pop('media_data', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if traits_data is not None:
            self._assign_traits(instance, traits_data)
            
        if media_data is not None:
            self._assign_media(instance, media_data)
            
        return instance

    def _assign_traits(self, pet, traits_list):
        pet.traits.all().delete() 
        for trait_name in traits_list:
            trait_obj, _ = PersonalityTrait.objects.get_or_create(name=trait_name)
            PetPersonality.objects.create(pet=pet, trait=trait_obj)

    def _assign_media(self, pet, media_list):
        # Expecting [{"url": "...", "delete_url": "..."?}, ...]
        if not media_list:
            return

        pet.media.all().delete()
        for idx, item in enumerate(media_list):
            PetMedia.objects.create(
                pet=pet, 
                url=item.get('url'),
                delete_url=item.get('delete_url'),
                is_primary=(idx == 0)
            )
