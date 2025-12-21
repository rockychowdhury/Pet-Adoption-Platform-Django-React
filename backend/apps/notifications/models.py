from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class Notification(models.Model):
    """
    In-app and push notifications.
    """
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    CHANNEL_CHOICES = (
        ('in_app', 'In-App'),
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push'),
    )
    
    NOTIFICATION_TYPES = (
        ('post_reaction', 'Post Reaction'),
        ('post_comment', 'Post Comment'),
        ('comment_reply', 'Comment Reply'),
        ('message_received', 'Message Received'),
        ('application_submitted', 'Application Submitted'),
        ('application_update', 'Application Update'),
        ('adoption_finalized', 'Adoption Finalized'),
        ('review_received', 'Review Received'),
        ('group_invitation', 'Group Invitation'),
        ('event_reminder', 'Event Reminder'),
        ('lost_pet_alert', 'Lost Pet Alert'),
        ('system_announcement', 'System Announcement'),
    )

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    action_url = models.CharField(max_length=500, blank=True, null=True)
    
    # Generic Relation
    related_object_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True)
    related_object_id = models.PositiveIntegerField(null=True)
    related_object = GenericForeignKey('related_object_type', 'related_object_id')
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='in_app')
    
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    is_dismissed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} for {self.recipient.email}"
