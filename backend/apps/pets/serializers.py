from rest_framework import serializers
from .models import Pet

class PetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['id', 'name', 'species', 'breed', 'photo_url', 'status', 'gender', 'age']


class PetDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'


class PetCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        exclude = ['created_at', 'updated_at']
        read_only_fields = ['shelter']
