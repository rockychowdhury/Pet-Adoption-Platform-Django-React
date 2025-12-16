from rest_framework import serializers
from .models import Conversation, Message
from apps.users.serializers import PublicUserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = PublicUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'text', 'message_type', 'media_url', 'is_read', 'created_at']
        read_only_fields = ['sender', 'conversation']

class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    is_archived = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'last_message', 'created_at', 'updated_at', 'unread_count', 'is_archived']

    def get_participants(self, obj):
        return [
            PublicUserSerializer(obj.participant_1).data,
            PublicUserSerializer(obj.participant_2).data
        ]

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').last() # Use last not first if ordered by created_at asc, but model says ordering properly. Check model.
        # Model Message ordering is ['created_at']. So .last() gives most recent.
        # But Conversation ViewSet used .order_by('-updated_at').
        # Model Conversation ordering is ['-last_message_at'].
        # Let's rely on obj.messages.last() if strictly time ordered.
        # Ideally, we query .order_by('-created_at').first()
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.get_unread_count(user)
        return 0

    def get_is_archived(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.is_archived_by(user)
        return False
