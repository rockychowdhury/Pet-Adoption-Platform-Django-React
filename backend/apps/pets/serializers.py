from rest_framework import serializers
from .models import Pet

class PetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['id', 'name', 'species', 'breed', 'photo', 'status']


class PetDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'


class PetCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        exclude = ['status', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['shelter'] = self.context['request'].user
        return super().create(validated_data)
