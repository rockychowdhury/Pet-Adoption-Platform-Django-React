from rest_framework import serializers
from .models import UserReport
from apps.users.serializers import UserSerializer

class UserReportSerializer(serializers.ModelSerializer):
    reporter_email = serializers.EmailField(source='reporter.email', read_only=True)
    reported_user_email = serializers.EmailField(source='reported_user.email', read_only=True)

    class Meta:
        model = UserReport
        fields = [
            'id', 'reporter', 'reporter_email', 'reported_user', 'reported_user_email',
            'reported_content_type', 'reported_content_id',
            'report_type', 'description', 'status', 'admin_notes', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['reporter', 'created_at', 'resolved_at']
