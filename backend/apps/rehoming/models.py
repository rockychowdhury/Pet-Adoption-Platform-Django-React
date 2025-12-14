from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class RehomingIntervention(models.Model):
    """
    Pre-rehoming intervention questionnaire to help owners explore alternatives.
    Implements 48-hour optional cooling period before listing creation.
    """
    REASON_CHOICES = (
        ('moving', 'Moving/Housing Restrictions'),
        ('allergies', 'Allergies'),
        ('financial', 'Financial Hardship'),
        ('time', 'Time Constraints'),
        ('behavioral', 'Behavioral Issues'),
        ('health', 'Health Issues (Owner)'),
        ('too_many', 'Too Many Pets'),
        ('other', 'Other'),
    )
    URGENCY_CHOICES = (
        ('immediate', 'Immediate'),
        ('1_month', '1 Month'),
        ('3_months', '3 Months'),
        ('flexible', 'Flexible'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rehoming_interventions')
    reason_category = models.CharField(max_length=20, choices=REASON_CHOICES)
    reason_text = models.TextField(help_text="Detailed explanation for rehoming (500+ words)")
    urgency_level = models.CharField(max_length=20, choices=URGENCY_CHOICES)
    
    # Store resources shown to the user based on their reason
    resources_viewed = models.JSONField(default=list, blank=True, help_text="List of resource types shown")
    
    # Cooling Period (48 hours optional)
    cooling_period_end = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the 48-hour cooling period ends (optional)"
    )
    
    # Timestamps
    acknowledged_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When user acknowledged viewing intervention resources"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Rehoming Intervention"
        verbose_name_plural = "Rehoming Interventions"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.get_reason_category_display()}"
    
    @property
    def can_proceed(self):
        """Check if cooling period has passed and user can proceed to create listing"""
        if not self.cooling_period_end:
            return True  # No cooling period set
        return timezone.now() >= self.cooling_period_end
    
    def set_cooling_period(self, hours=48):
        """Set cooling period from now"""
        self.cooling_period_end = timezone.now() + timedelta(hours=hours)
        self.save()
        return self.cooling_period_end
    
    @property
    def time_remaining(self):
        """Get remaining time in cooling period"""
        if not self.cooling_period_end:
            return None
        if self.can_proceed:
            return timedelta(0)
        return self.cooling_period_end - timezone.now()


class ListingReview(models.Model):
    """
    Tracks the moderation status of a pet rehoming listing.
    Admins review listings before they go public to ensure safety and quality.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('changes_requested', 'Changes Requested'),
    )
    
    # Reference to RehomingListing in pets app
    pet = models.OneToOneField('pets.RehomingListing', on_delete=models.CASCADE, related_name='listing_review')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_feedback = models.TextField(
        blank=True,
        null=True,
        help_text="Feedback for the user if changes are requested"
    )
    internal_notes = models.TextField(blank=True, null=True, help_text="Internal notes for admins")
    
    # Automated Checks (JSON structure)
    # {
    #   "required_fields_complete": boolean,
    #   "photos_quality": boolean,
    #   "vaccination_records": boolean,
    #   "no_contact_info_in_text": boolean,
    #   "fee_within_limits": boolean,
    #   "account_verified": boolean
    # }
    automated_checks = models.JSONField(
        default=dict,
        blank=True,
        help_text="Results of automated quality checks"
    )
    
    quality_score = models.IntegerField(
        default=0,
        help_text="Overall quality score 0-100 based on automated checks"
    )
    
    # Red Flags (JSON array)
    # ["multiple_listings_short_time", "suspected_breeding", "contradictory_info", "price_anomaly"]
    red_flags = models.JSONField(
        default=list,
        blank=True,
        help_text="List of red flags detected"
    )
    
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_listings'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Listing Review"
        verbose_name_plural = "Listing Reviews"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review for {self.pet.pet_name} - {self.get_status_display()}"
    
    def calculate_quality_score(self):
        """Calculate quality score based on automated checks"""
        if not self.automated_checks:
            return 0
        
        checks = self.automated_checks
        total_checks = len(checks)
        if total_checks == 0:
            return 0
        
        passed_checks = sum(1 for value in checks.values() if value)
        score = int((passed_checks / total_checks) * 100)
        
        # Deduct points for red flags
        red_flag_penalty = len(self.red_flags) * 10
        score = max(0, score - red_flag_penalty)
        
        self.quality_score = score
        self.save()
        return score
    
    def run_automated_checks(self):
        """Run all automated checks on the listing"""
        listing = self.pet
        checks = {}
        
        # Check required fields
        checks['required_fields_complete'] = all([
            listing.pet_name,
            listing.species,
            listing.rehoming_story and len(listing.rehoming_story) >= 1000,
            listing.medical_history,
            listing.behavioral_profile,
            listing.aggression_disclosed,
        ])
        
        # Check photos (5 minimum required)
        checks['photos_quality'] = listing.photo_count >= 5
        
        # Check vaccination records uploaded
        has_vax_records = listing.medical_history.get('vaccination_records_url') if isinstance(listing.medical_history, dict) else False
        checks['vaccination_records'] = bool(has_vax_records)
        
        # Check for contact info in text (simple check for phone/email patterns)
        import re
        text_to_check = f"{listing.rehoming_story} {listing.aggression_details}"
        has_phone = bool(re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text_to_check))
        has_email = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text_to_check))
        checks['no_contact_info_in_text'] = not (has_phone or has_email)
        
        # Check adoption fee within limits ($0-300)
        checks['fee_within_limits'] = 0 <= listing.adoption_fee <= 300
        
        # Check account verification
        checks['account_verified'] = listing.pet_owner.email_verified and listing.pet_owner.phone_verified
        
        self.automated_checks = checks
        self.calculate_quality_score()
        return checks
