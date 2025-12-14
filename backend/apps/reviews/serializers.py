from rest_framework import serializers
from .models import AdoptionReview
from apps.users.serializers import UserSerializer

class AdoptionReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    reviewee_name = serializers.CharField(source='reviewee.get_full_name', read_only=True)
    application_pet_name = serializers.CharField(source='application.pet.name', read_only=True)

    class Meta:
        model = AdoptionReview
        fields = [
            'id', 'application', 'reviewer', 'reviewer_name', 'reviewee', 'reviewee_name',
            'reviewer_role', 'application_pet_name',
            'rating_overall', 'rating_responsiveness', 'rating_preparation',
            'rating_honesty', 'rating_communication',
            'review_text', 'would_recommend', 'created_at'
        ]
        read_only_fields = ['reviewer', 'application_pet_name', 'reviewer_name', 'reviewee_name']

    def create(self, validated_data):
        # Ensure reviewer matches request user
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)
