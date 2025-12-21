from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Conversation(models.Model):
    """
    Chat conversations between users.
    Supports direct messages and group chats.
    """
    CONVERSATION_TYPES = (
        ('direct', 'Direct Message'),
        ('group', 'Group Chat'),
    )

    participants = models.ManyToManyField(User, related_name='conversations')
    conversation_type = models.CharField(max_length=20, choices=CONVERSATION_TYPES, default='direct')
    
    title = models.CharField(max_length=200, blank=True, null=True, help_text="Group chat name")
    group_photo = models.ImageField(upload_to='conversations/photos/', blank=True, null=True)
    group_photo_url = models.URLField(blank=True, null=True)
    
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='administered_conversations')
    
    is_archived = models.BooleanField(default=False)
    
    last_message_at = models.DateTimeField(null=True, blank=True)
    last_message_preview = models.CharField(max_length=300, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_message_at']
        indexes = [
            models.Index(fields=['-last_message_at']),
            models.Index(fields=['is_archived']),
        ]

    def __str__(self):
        if self.conversation_type == 'group':
            return self.title or f"Group Chat {self.id}"
        return f"Conversation {self.id}"

    def update_last_message(self, message):
        """Update last message info"""
        self.last_message_at = message.created_at
        self.last_message_preview = message.content[:100] if message.content else "Media"
        self.save()


class Message(models.Model):
    """
    Individual messages in conversations.
    """
    MESSAGE_TYPES = (
        ('text', 'Text'),
        ('image', 'Image'),
        ('voice', 'Voice'),
        ('system', 'System'),
    )

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    
    content = models.TextField(max_length=5000)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    
    media_url = models.URLField(blank=True, null=True)
    media_thumbnail = models.URLField(blank=True, null=True)
    voice_duration = models.IntegerField(blank=True, null=True)
    
    reply_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')
    
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['sender']),
        ]

    def __str__(self):
        return f"Message {self.id} in {self.conversation}"


class MessageReceipt(models.Model):
    """
    Read receipts for messages.
    """
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='receipts')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_receipts')
    
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('message', 'user')
        indexes = [
            models.Index(fields=['message']),
            models.Index(fields=['user']),
            models.Index(fields=['is_read']),
        ]
