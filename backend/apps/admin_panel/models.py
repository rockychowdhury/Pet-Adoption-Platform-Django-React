from django.db import models
from django.contrib.auth import get_user_model
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
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('action_taken', 'Action Taken'),
        ('dismissed', 'Dismissed'),
    )
    
    PRIORITY_CHOICES = (
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    )
    
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='filed_reports')
    reported_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='reports_against'
    )
    
    # Generic content reference
    reported_content_type = models.CharField(
        max_length=20,
        help_text="e.g., listing, message, review, profile"
    )
    reported_content_id = models.IntegerField()
    
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    description = models.TextField(help_text="Detailed description of the issue")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium',
        help_text="Auto-calculated from report_type"
    )
    admin_notes = models.TextField(blank=True, help_text="Internal notes for admin review")
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'User Report'
        verbose_name_plural = 'User Reports'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"Report #{self.id} - {self.get_report_type_display()} by {self.reporter.email}"
    
    def save(self, *args, **kwargs):
        """Auto-set priority based on report type"""
        if not self.priority or self.priority == 'medium':
            if self.report_type == 'animal_welfare':
                self.priority = 'high'
            elif self.report_type in ['harassment', 'scam']:
                self.priority = 'high'
            else:
                self.priority = 'medium'
        super().save(*args, **kwargs)
    
    def resolve(self, notes=''):
        """Mark report as resolved"""
        self.status = 'action_taken'
        self.resolved_at = timezone.now()
        if notes:
            self.admin_notes = notes
        self.save()


class LegalAgreement(models.Model):
    """
    Digital adoption agreements with signature tracking.
    Enhanced with version tracking and terms snapshot.
    """
    application = models.OneToOneField(
        'adoption.AdoptionApplication',
        on_delete=models.CASCADE,
        related_name='legal_agreement'
    )
    
    agreement_type = models.CharField(max_length=20, default='adoption')
    document_url = models.URLField(help_text="URL to generated PDF agreement")
    
    # Version Tracking
    agreement_template_version = models.CharField(
        max_length=20,
        default='1.0',
        help_text="Track template version for legal compliance"
    )
    terms_text = models.TextField(
        blank=True,
        help_text="Snapshot of terms at time of signing"
    )
    
    # Digital signatures
    pet_owner_signed_at = models.DateTimeField(null=True, blank=True)
    pet_owner_ip = models.GenericIPAddressField(null=True, blank=True)
    
    adopter_signed_at = models.DateTimeField(null=True, blank=True)
    adopter_ip = models.GenericIPAddressField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Legal Agreement'
        verbose_name_plural = 'Legal Agreements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Agreement for Application #{self.application.id}"
    
    @property
    def is_fully_signed(self):
        return self.pet_owner_signed_at is not None and self.adopter_signed_at is not None
    
    @property
    def pending_signature_from(self):
        """Get which party still needs to sign"""
        if not self.pet_owner_signed_at:
            return 'pet_owner'
        if not self.adopter_signed_at:
            return 'adopter'
        return None
    
    def sign_as_pet_owner(self, ip_address):
        """Record pet owner signature"""
        self.pet_owner_signed_at = timezone.now()
        self.pet_owner_ip = ip_address
        self.save()
    
    def sign_as_adopter(self, ip_address):
        """Record adopter signature"""
        self.adopter_signed_at = timezone.now()
        self.adopter_ip = ip_address
        self.save()


class PlatformMetrics(models.Model):
    """
    Daily snapshot of platform metrics for analytics dashboard.
    Populated by daily cron job or scheduled task.
    """
    date = models.DateField(unique=True)
    
    # User Metrics
    total_users = models.IntegerField(default=0)
    new_users_today = models.IntegerField(default=0)
    active_users_30d = models.IntegerField(default=0, help_text="Users active in last 30 days")
    
    # Listing Metrics
    total_listings = models.IntegerField(default=0)
    active_listings = models.IntegerField(default=0)
    pending_listings = models.IntegerField(default=0)
    
    # Adoption Metrics
    total_adoptions = models.IntegerField(default=0)
    adoptions_this_month = models.IntegerField(default=0)
    adoptions_today = models.IntegerField(default=0)
    
    # Application Metrics
    total_applications = models.IntegerField(default=0)
    pending_applications = models.IntegerField(default=0)
    
    # Moderation Metrics
    pending_reports = models.IntegerField(default=0)
    resolved_reports_today = models.IntegerField(default=0)
    
    # Engagement Metrics
    messages_sent_today = models.IntegerField(default=0)
    reviews_posted_today = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name = 'Platform Metrics'
        verbose_name_plural = 'Platform Metrics'
    
    def __str__(self):
        return f"Metrics for {self.date}"
    
    @classmethod
    def calculate_for_date(cls, date=None):
        """
        Calculate and save metrics for a specific date.
        If date is None, use today.
        """
        if date is None:
            date = timezone.now().date()
        
        from apps.adoption.models import AdoptionApplication
        from apps.pets.models import RehomingListing
        from apps.messaging.models import Message
        from apps.reviews.models import AdoptionReview
        
        # Calculate all metrics
        metrics, created = cls.objects.get_or_create(date=date)
        
        # User metrics
        metrics.total_users = User.objects.count()
        metrics.new_users_today = User.objects.filter(date_joined__date=date).count()
        thirty_days_ago = date - timezone.timedelta(days=30)
        # Active users = users with any activity (applications, messages, etc.)
        # This is a simplified version
        metrics.active_users_30d = User.objects.filter(
            date_joined__gte=thirty_days_ago
        ).count()
        
        # Listing metrics
        metrics.total_listings = RehomingListing.objects.count()
        metrics.active_listings = RehomingListing.objects.filter(
            status='active'
        ).count()
        metrics.pending_listings = RehomingListing.objects.filter(
            status='pending_review'
        ).count()
        
        # Adoption metrics
        metrics.total_adoptions = AdoptionApplication.objects.filter(
            status__in=['adopted', 'completed']
        ).count()
        metrics.adoptions_this_month = AdoptionApplication.objects.filter(
            status__in=['adopted', 'completed'],
            updated_at__year=date.year,
            updated_at__month=date.month
        ).count()
        metrics.adoptions_today = AdoptionApplication.objects.filter(
            status__in=['adopted', 'completed'],
            updated_at__date=date
        ).count()
        
        # Application metrics
        metrics.total_applications = AdoptionApplication.objects.count()
        metrics.pending_applications = AdoptionApplication.objects.filter(
            status__in=['pending_review', 'info_requested']
        ).count()
        
        # Moderation metrics
        metrics.pending_reports = UserReport.objects.filter(
            status='pending'
        ).count()
        metrics.resolved_reports_today = UserReport.objects.filter(
            resolved_at__date=date
        ).count()
        
        # Engagement metrics
        metrics.messages_sent_today = Message.objects.filter(
            created_at__date=date
        ).count()
        metrics.reviews_posted_today = AdoptionReview.objects.filter(
            created_at__date=date
        ).count()
        
        metrics.save()
        return metrics


class ModerationAction(models.Model):
    """
    Logs all moderation actions for audit trail and accountability.
    """
    ACTION_TYPES = (
        ('approve_listing', 'Approve Listing'),
        ('reject_listing', 'Reject Listing'),
        ('suspend_user', 'Suspend User'),
        ('ban_user', 'Ban User'),
        ('warn_user', 'Warn User'),
        ('remove_content', 'Remove Content'),
        ('verify_identity', 'Verify Identity'),
        ('verify_pet_owner', 'Verify Pet Owner'),
        ('resolve_report', 'Resolve Report'),
        ('dismiss_report', 'Dismiss Report'),
    )
    
    moderator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='moderation_actions'
    )
    action_type = models.CharField(max_length=30, choices=ACTION_TYPES)
    
    # Generic content reference
    target_content_type = models.CharField(max_length=20)
    target_content_id = models.IntegerField()
    
    target_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='moderation_received'
    )
    
    reason = models.TextField(help_text="Public-facing reason for action")
    internal_notes = models.TextField(blank=True, help_text="Internal admin notes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Moderation Action"
        verbose_name_plural = "Moderation Actions"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['moderator', '-created_at']),
            models.Index(fields=['action_type', '-created_at']),
            models.Index(fields=['target_user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_action_type_display()} by {self.moderator.email} at {self.created_at}"
    
    @classmethod
    def log_action(cls, moderator, action_type, target_content_type, target_content_id,
                   target_user=None, reason='', internal_notes=''):
        """Helper method to log a moderation action"""
        action = cls.objects.create(
            moderator=moderator,
            action_type=action_type,
            target_content_type=target_content_type,
            target_content_id=target_content_id,
            target_user=target_user,
            reason=reason,
            internal_notes=internal_notes
        )
        return action
