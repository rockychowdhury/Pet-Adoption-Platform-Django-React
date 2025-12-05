from rest_framework import serializers
from .models import Review
from apps.users.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.StringRelatedField(read_only=True)
    target_user_name = serializers.CharField(source='target_user.first_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'target_user', 'target_user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer']
