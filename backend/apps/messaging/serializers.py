from rest_framework import serializers
from .models import Conversation, Message
from apps.users.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'is_read', 'created_at']
        read_only_fields = ['sender', 'conversation']

class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.StringRelatedField(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'last_message', 'created_at', 'updated_at']

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None
