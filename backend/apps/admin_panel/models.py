from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

User = get_user_model()

class UserReport(models.Model):
    """
    User-submitted reports for content moderation and safety.
    """
    REPORT_TYPES = (
        ('spam', 'Spam'),
        ('harassment', 'Harassment'),
        ('inappropriate', 'Inappropriate Content'),
        ('animal_welfare', 'Animal Welfare Concern'),
        ('misrepresentation', 'Misrepresentation'),
        ('scam', 'Scam/Fraud'),
        ('stolen_pet', 'Stolen Pet'),
        ('fake_profile', 'Fake Profile'),
        ('other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('action_taken', 'Action Taken'),
        ('dismissed', 'Dismissed'),
    )
    
    severity_choices = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='filed_reports')
    reported_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reports_against'
    )
    
    # Generic content reference (updated to match docs/db.md)
    reported_content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True)
    reported_content_id = models.PositiveIntegerField(null=True)
    reported_content = GenericForeignKey('reported_content_type', 'reported_content_id')
    
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    description = models.TextField(help_text="Detailed description of the issue")
    
    severity = models.CharField(max_length=20, choices=severity_choices, default='medium')
    evidence_urls = models.JSONField(default=list, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_reports')
    
    admin_notes = models.TextField(blank=True, null=True)
    action_taken = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User Report'
        verbose_name_plural = 'User Reports'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['reporter']),
            models.Index(fields=['reported_user']),
            models.Index(fields=['status']),
            models.Index(fields=['severity']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Report #{self.id} - {self.get_report_type_display()}"


class ModerationAction(models.Model):
    """
    Logs all moderation actions for audit trail and accountability.
    """
    ACTION_TYPES = (
        ('warning_issued', 'Warning Issued'),
        ('content_removed', 'Content Removed'),
        ('temporary_suspension', 'Temporary Suspension'),
        ('permanent_ban', 'Permanent Ban'),
        ('restriction_applied', 'Restriction Applied'),
        ('verification_revoked', 'Verification Revoked'),
        ('account_reinstated', 'Account Reinstated'),
    )
    
    moderator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='moderation_actions'
    )
    target_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='moderation_received'
    )
    
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    reason = models.TextField()
    
    duration_days = models.IntegerField(null=True, blank=True)
    related_report = models.ForeignKey(UserReport, on_delete=models.SET_NULL, null=True, blank=True)
    
    notes = models.TextField(blank=True, null=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Moderation Action"
        verbose_name_plural = "Moderation Actions"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['moderator']),
            models.Index(fields=['target_user']),
            models.Index(fields=['action_type']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_action_type_display()} on {self.target_user.email}"
