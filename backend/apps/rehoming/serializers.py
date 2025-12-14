from rest_framework import serializers
from .models import RehomingIntervention

class RehomingInterventionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RehomingIntervention
        fields = [
            'id', 'user', 'reason_category', 'reason_text', 
            'urgency_level', 'resources_viewed', 'acknowledged_at', 'created_at'
        ]
        read_only_fields = ['user', 'created_at', 'acknowledged_at']

    def create(self, validated_data):
        # Assign current user to intervention
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
