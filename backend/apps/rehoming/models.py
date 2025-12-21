from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

User = get_user_model()

class RehomingIntervention(models.Model):
    """
    Pre-rehoming questionnaire responses.
    """
    REASON_CHOICES = (
        ('moving', 'Moving'),
        ('allergies', 'Allergies'),
        ('financial', 'Financial Issues'),
        ('behavioral', 'Behavioral Issues'),
        ('no_time', 'No Time'),
        ('other', 'Other'),
    )
    
    URGENCY_CHOICES = (
        ('immediate', 'Immediate'),
        ('one_month', 'Within 1 Month'),
        ('three_months', 'Within 3 Months'),
        ('flexible', 'Flexible'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rehoming_interventions')
    reason_category = models.CharField(max_length=100, choices=REASON_CHOICES)
    reason_text = models.TextField(help_text="Detailed explanation of reason for rehoming")
    urgency_level = models.CharField(max_length=20, choices=URGENCY_CHOICES)
    
    resources_viewed = models.JSONField(default=list, blank=True)
    resources_acknowledged = models.BooleanField(default=False)
    
    cooling_period_started = models.DateTimeField(null=True, blank=True)
    cooling_period_completed = models.BooleanField(default=False)
    proceeded_to_listing = models.BooleanField(default=False)
    
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Intervention for {self.user.email} - {self.reason_category}"


class RehomingListing(models.Model):
    """
    Pets available for adoption.
    """
    class ListingStatus(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        PENDING_REVIEW = 'pending_review', _('Pending Review')
        ACTIVE = 'active', _('Active')
        ON_HOLD = 'on_hold', _('On Hold')
        ADOPTED = 'adopted', _('Adopted')
        EXPIRED = 'expired', _('Expired')
        REJECTED = 'rejected', _('Rejected')

    class UrgencyLevel(models.TextChoices):
        IMMEDIATE = 'immediate', _('Immediate')
        ONE_MONTH = '1_month', _('Within 1 Month')
        THREE_MONTHS = '3_months', _('Within 3 Months')
        FLEXIBLE = 'flexible', _('Flexible')
        
    class PrivacyLevel(models.TextChoices):
        PUBLIC = 'public', _('Public')
        VERIFIED_ONLY = 'verified_only', _('Verified Members Only')
        PRIVATE = 'private', _('Private')

    pet_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rehoming_listings')
    intervention = models.ForeignKey(RehomingIntervention, on_delete=models.CASCADE, null=True, blank=True)
    pet_profile = models.ForeignKey('pets.PetProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='rehoming_listings')
    
    pet_name = models.CharField(max_length=100)
    species = models.CharField(max_length=50, choices=[('dog','Dog'), ('cat','Cat'), ('rabbit','Rabbit'), ('bird','Bird'), ('other','Other')])
    breed = models.CharField(max_length=100, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True, help_text="Age in years")
    gender = models.CharField(max_length=10, choices=[('male','Male'), ('female','Female'), ('unknown','Unknown')])
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    size_category = models.CharField(max_length=20, choices=[('xs','XS'), ('small','Small'), ('medium','Medium'), ('large','Large'), ('xl','XL')])
    color_markings = models.TextField(blank=True, null=True)
    
    medical_history = models.JSONField(default=dict, blank=True)
    behavioral_profile = models.JSONField(default=dict, blank=True)
    
    aggression_disclosed = models.BooleanField(default=False)
    aggression_details = models.TextField(blank=True, null=True)
    
    rehoming_reason = models.CharField(max_length=100, blank=True, null=True)
    rehoming_story = models.TextField(help_text="Full story")
    ideal_home = models.TextField(blank=True, null=True)
    
    adoption_fee = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fee_explanation = models.TextField(blank=True, null=True)
    
    included_items = models.JSONField(default=list, blank=True)
    photos = models.JSONField(default=list, blank=True)
    video_url = models.URLField(blank=True, null=True)
    
    urgency_level = models.CharField(max_length=20, choices=UrgencyLevel.choices)
    ideal_adoption_date = models.DateField(blank=True, null=True)
    
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=50)
    location_zip = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    service_area_miles = models.IntegerField(default=50)
    
    privacy_level = models.CharField(max_length=20, choices=PrivacyLevel.choices, default=PrivacyLevel.PUBLIC)
    custom_questions = models.JSONField(default=list, blank=True)
    
    status = models.CharField(max_length=20, choices=ListingStatus.choices, default='draft')
    rejection_reason = models.TextField(blank=True, null=True)
    
    view_count = models.IntegerField(default=0)
    application_count = models.IntegerField(default=0)
    
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['pet_owner']),
            models.Index(fields=['species']),
            models.Index(fields=['location_city', 'location_state']),
            models.Index(fields=['status']),
            models.Index(fields=['-published_at']),
        ]

    def __str__(self):
        return f"{self.pet_name} - {self.status}"


class AdoptionApplication(models.Model):
    """
    Adoption applications submitted.
    """
    class ApplicationStatus(models.TextChoices):
        PENDING_REVIEW = 'pending_review', _('Pending Review')
        INFO_REQUESTED = 'info_requested', _('Info Requested')
        REJECTED = 'rejected', _('Rejected')
        APPROVED_MEET_GREET = 'approved_meet_greet', _('Approved for Meet & Greet')
        MEET_GREET_SUCCESS = 'meet_greet_success', _('Meet & Greet Successful')
        HOME_CHECK_PENDING = 'home_check_pending', _('Home Check Pending')
        HOME_CHECK_PASSED = 'home_check_passed', _('Home Check Passed')
        TRIAL_PERIOD = 'trial_period', _('Trial Period')
        READY_FOR_ADOPTION = 'ready_for_adoption', _('Ready for Adoption')
        ADOPTED = 'adopted', _('Adopted')
        ADOPTION_COMPLETED = 'adoption_completed', _('Adoption Completed')
        RETURN_REQUESTED = 'return_requested', _('Return Requested')
        RETURNED = 'returned', _('Returned')

    listing = models.ForeignKey(RehomingListing, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adoption_applications')
    adopter_profile = models.ForeignKey('users.AdopterProfile', on_delete=models.CASCADE, related_name='applications')
    
    application_message = models.TextField()
    custom_answers = models.JSONField(default=dict, blank=True)
    match_score = models.IntegerField(default=0)
    
    status = models.CharField(max_length=30, choices=ApplicationStatus.choices, default='pending_review')
    rejection_reason = models.TextField(blank=True, null=True)
    pet_owner_notes = models.TextField(blank=True, null=True)
    
    meet_greet_scheduled = models.DateTimeField(null=True, blank=True)
    meet_greet_location = models.CharField(max_length=300, blank=True, null=True)
    meet_greet_feedback = models.JSONField(null=True, blank=True)
    
    home_check_required = models.BooleanField(default=False)
    home_check_completed = models.BooleanField(default=False)
    home_check_passed = models.BooleanField(null=True, blank=True)
    home_check_notes = models.TextField(blank=True, null=True)
    home_check_photos = models.JSONField(default=list, blank=True)
    
    trial_period = models.BooleanField(default=False)
    trial_start_date = models.DateField(null=True, blank=True)
    trial_end_date = models.DateField(null=True, blank=True)
    trial_feedback = models.JSONField(null=True, blank=True)
    
    adoption_fee_amount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    adoption_contract_signed = models.BooleanField(default=False)
    microchip_transferred = models.BooleanField(default=False)
    
    finalized_at = models.DateTimeField(null=True, blank=True)
    return_requested = models.BooleanField(default=False)
    return_reason = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['listing']),
            models.Index(fields=['applicant']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Application by {self.applicant.email} for {self.listing.pet_name}"


class AdoptionContract(models.Model):
    """
    Legal adoption agreements.
    """
    application = models.OneToOneField(AdoptionApplication, on_delete=models.CASCADE, related_name='contract')
    contract_template = models.CharField(max_length=50, blank=True)
    contract_text = models.TextField()
    terms_and_conditions = models.JSONField(default=dict, blank=True)
    
    pet_owner_name = models.CharField(max_length=200)
    pet_owner_signature = models.TextField(blank=True, null=True)
    pet_owner_signed_at = models.DateTimeField(null=True, blank=True)
    pet_owner_ip = models.GenericIPAddressField(null=True, blank=True)
    
    adopter_name = models.CharField(max_length=200)
    adopter_signature = models.TextField(blank=True, null=True)
    adopter_signed_at = models.DateTimeField(null=True, blank=True)
    adopter_ip = models.GenericIPAddressField(null=True, blank=True)
    
    is_fully_signed = models.BooleanField(default=False)
    document_pdf_url = models.URLField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['is_fully_signed']),
        ]

    def __str__(self):
        return f"Contract for {self.application}"


class AdoptionPayment(models.Model):
    """
    Payment processing and escrow.
    """
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('held', 'Held in Escrow'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('failed', 'Failed'),
    )
    
    application = models.OneToOneField(AdoptionApplication, on_delete=models.CASCADE, related_name='payment')
    adoption_fee = models.DecimalField(max_digits=7, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=7, decimal_places=2, default=0) # Calculated
    payout_amount = models.DecimalField(max_digits=7, decimal_places=2, default=0) # Calculated
    
    payment_method = models.CharField(max_length=50, choices=[('credit_card','Credit Card'), ('paypal','PayPal')])
    stripe_payment_id = models.CharField(max_length=100, blank=True, null=True)
    stripe_payout_id = models.CharField(max_length=100, blank=True, null=True)
    
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    held_until = models.DateTimeField(null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)
    
    refund_amount = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    refund_reason = models.TextField(blank=True, null=True)
    transaction_notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['payment_status']),
            models.Index(fields=['stripe_payment_id']),
        ]


class PostAdoptionCheckIn(models.Model):
    """
    Follow-up surveys post-adoption.
    """
    CHECK_IN_DAYS = (
        (3, '3 Days'),
        (7, '1 Week'),
        (14, '2 Weeks'),
        (30, '1 Month'),
    )

    application = models.ForeignKey(AdoptionApplication, on_delete=models.CASCADE, related_name='check_ins')
    check_in_day = models.IntegerField(choices=CHECK_IN_DAYS)
    survey_questions = models.JSONField(default=list)
    responses = models.JSONField(null=True, blank=True)
    
    issues_reported = models.BooleanField(default=False)
    issue_details = models.TextField(blank=True, null=True)
    support_requested = models.BooleanField(default=False)
    
    vet_visit_completed = models.BooleanField(null=True, blank=True)
    vet_receipt_url = models.URLField(blank=True, null=True)
    photos_shared = models.JSONField(default=list, blank=True)
    
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['application']),
            models.Index(fields=['check_in_day']),
        ]


class AdoptionReview(models.Model):
    """
    Reviews post-adoption (both parties).
    Move from reviews app.
    """
    application = models.ForeignKey(AdoptionApplication, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='written_adoption_reviews')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_adoption_reviews')
    
    reviewer_role = models.CharField(max_length=20, choices=[('pet_owner','Pet Owner'), ('adopter','Adopter')])
    
    rating_overall = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    rating_responsiveness = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], null=True, blank=True)
    rating_preparation = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], null=True, blank=True)
    rating_honesty = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], null=True, blank=True)
    rating_follow_through = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], null=True, blank=True)
    
    review_text = models.TextField()
    would_recommend = models.BooleanField()
    tags = models.JSONField(default=list, blank=True)
    
    is_featured = models.BooleanField(default=False)
    helpful_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('application', 'reviewer')
