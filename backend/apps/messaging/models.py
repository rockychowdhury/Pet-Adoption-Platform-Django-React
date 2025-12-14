from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class Conversation(models.Model):
    """
    Direct message conversation between two users.
    For MVP, only supports one-on-one conversations.
    """
    participant_1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations_as_participant_1'
    )
    participant_2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations_as_participant_2'
    )
    
    # For efficient sorting and display
    last_message_at = models.DateTimeField(default=timezone.now, help_text="Timestamp of last message")
    
    # Per-user archiving
    archived_by_participant_1 = models.BooleanField(default=False)
    archived_by_participant_2 = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Conversation"
        verbose_name_plural = "Conversations"
        unique_together = [('participant_1', 'participant_2')]
        ordering = ['-last_message_at']
        indexes = [
            models.Index(fields=['-last_message_at']),
            models.Index(fields=['participant_1', 'participant_2']),
        ]

    def __str__(self):
        return f"Conversation between {self.participant_1.email} and {self.participant_2.email}"
    
    def get_other_participant(self, user):
        """Get the other participant in the conversation"""
        if user == self.participant_1:
            return self.participant_2
        return self.participant_1
    
    def get_unread_count(self, user):
        """Get unread message count for a specific user"""
        return self.messages.filter(read_at__isnull=True).exclude(sender=user).count()
    
    def is_archived_by(self, user):
        """Check if conversation is archived by user"""
        if user == self.participant_1:
            return self.archived_by_participant_1
        elif user == self.participant_2:
            return self.archived_by_participant_2
        return False
    
    def archive_for_user(self, user):
        """Archive conversation for a specific user"""
        if user == self.participant_1:
            self.archived_by_participant_1 = True
        elif user == self.participant_2:
            self.archived_by_participant_2 = True
        self.save()
    
    def unarchive_for_user(self, user):
        """Unarchive conversation for a specific user"""
        if user == self.participant_1:
            self.archived_by_participant_1 = False
        elif user == self.participant_2:
            self.archived_by_participant_2 = False
        self.save()
    
    def update_last_message(self, message):
        """Update last message info"""
        self.last_message_at = message.created_at
        self.save()


class Message(models.Model):
    """
    Individual message in a conversation.
    Supports text and image messages for MVP.
    """
    MESSAGE_TYPES = (
        ('text', 'Text'),
        ('image', 'Image'),
    )
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    text = models.TextField(max_length=5000, help_text="Message text (5000 char max)")
    
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='text')
    media_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="URL to attached image (optional, 1 photo per message)"
    )
    
    # Read tracking
    is_read = models.BooleanField(default=False, help_text="Has the message been read?")
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when message was read"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['is_read']),
        ]

    def __str__(self):
        return f"Message from {self.sender.email} in conversation {self.conversation.id}"
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()


class MessageRestriction(models.Model):
    """
    Tracks messaging restrictions for new users (< 30 days).
    New users can only message:
    - Users they applied to adopt from
    - Users who applied to their listing
    - Service providers
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='message_restrictions'
    )
    restriction_lifted_at = models.DateTimeField(
        help_text="Auto-set to registration + 30 days"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Message Restriction"
        verbose_name_plural = "Message Restrictions"
    
    def __str__(self):
        return f"Restrictions for {self.user.email}"
    
    @property
    def can_message_anyone(self):
        """Check if restriction period has passed"""
        return timezone.now() >= self.restriction_lifted_at
    
    @property
    def days_remaining(self):
        """Get days remaining in restriction period"""
        if self.can_message_anyone:
            return 0
        delta = self.restriction_lifted_at - timezone.now()
        return max(0, delta.days)
    
    @classmethod
    def create_for_user(cls, user):
        """Create restriction for new user (30 days from now)"""
        restriction, created = cls.objects.get_or_create(
            user=user,
            defaults={
                'restriction_lifted_at': timezone.now() + timedelta(days=30)
            }
        )
        return restriction
    
    def can_message_user(self, target_user):
        """Check if user can message a specific target user"""
        # If restriction period has passed, can message anyone
        if self.can_message_anyone:
            return True
        
        # Can always message service providers
        if target_user.role == User.UserRole.SERVICE_PROVIDER:
            return True
        
        # Can message users they have applied to adopt from
        from apps.adoption.models import AdoptionApplication
        from apps.pets.models import RehomingListing
        
        # Check if user has applied to any listing owned by target_user
        has_applied = AdoptionApplication.objects.filter(
            applicant=self.user,
            pet__pet_owner=target_user
        ).exists()
        if has_applied:
            return True
        
        # Can message users who have applied to their listings
        has_application_from = AdoptionApplication.objects.filter(
            applicant=target_user,
            pet__pet_owner=self.user
        ).exists()
        if has_application_from:
            return True
        
        return False
