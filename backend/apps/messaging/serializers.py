from rest_framework import serializers
from .models import Conversation, Message, MessageReceipt
from apps.users.serializers import PublicUserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = PublicUserSerializer(read_only=True)
    is_read_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'message_type', 'media_url', 'media_thumbnail', 'voice_duration', 'is_read_by_user', 'created_at']
        read_only_fields = ['sender', 'conversation']
        
    def get_is_read_by_user(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.receipts.filter(user=user, is_read=True).exists()
        return False

class ConversationSerializer(serializers.ModelSerializer):
    participants = PublicUserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'title', 'group_photo', 'conversation_type', 'last_message', 'created_at', 'updated_at', 'unread_count', 'is_archived']

    def get_last_message(self, obj):
        if obj.last_message_at:
            # Try to get the message object corresponding to timestamp or just the latest
            last_msg = obj.messages.order_by('-created_at').first()
            if last_msg:
                return MessageSerializer(last_msg, context=self.context).data
        return None

    def get_unread_count(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            # Count messages sent by OTHERS that are NOT read by user
            return obj.messages.exclude(sender=user).exclude(receipts__user=user, receipts__is_read=True).count()
        return 0
