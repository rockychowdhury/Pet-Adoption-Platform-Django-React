from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 
            'action_url', 'priority', 'channel', 
            'is_read', 'read_at', 'is_dismissed', 'created_at'
        ]
        read_only_fields = [
            'notification_type', 'title', 'message', 
            'action_url', 'priority', 'channel', 'created_at'
        ]
