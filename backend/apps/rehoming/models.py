from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class RehomingRequest(models.Model):
    """
    Tracks the rehoming decision process before a listing goes live.
    Includes agreement acceptance and cooling period.
    """
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('cooling_period', 'Cooling Period'),  # 24hr wait for non-immediate
        ('confirmed', 'Confirmed'),  # Ready to create listing
        ('cancelled', 'Cancelled'),  # Owner changed mind
        ('expired', 'Expired'),  # Draft never completed
    ]
    
    URGENCY_CHOICES = [
        ('immediate', 'Immediate - Emergency'),
        ('soon', 'Within 1 Month'),
        ('flexible', 'Flexible Timeline'),
    ]
    
    pet = models.ForeignKey(
        'pets.PetProfile',
        on_delete=models.CASCADE,
        related_name='rehoming_requests'
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rehoming_requests')
    
    # Agreement & Terms
    terms_accepted = models.BooleanField(default=False)
    terms_accepted_at = models.DateTimeField(null=True, blank=True)
    terms_version = models.CharField(max_length=20, default='1.0')  # Track which terms version
    
    # Rehoming Details
    reason = models.TextField(
        help_text="Please explain why you need to rehome your pet. This helps us find the best match."
    )
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES)
    ideal_home_notes = models.TextField(
        blank=True,
        help_text="Describe the ideal new home for your pet"
    )
    
    # Location (for initial filtering)
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=50)
    location_zip = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Privacy
    privacy_level = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public - Anyone can see'),
            ('verified', 'Verified Users Only')
        ],
        default='public'
    )
    
    # Status & Timeline
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    cooling_period_start = models.DateTimeField(null=True, blank=True)
    cooling_period_end = models.DateTimeField(null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Profile completion checks (cached for reference)
    owner_profile_complete = models.BooleanField(default=False)
    pet_profile_complete = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['owner', 'status']),
        ]
    
    def __str__(self):
        return f"Rehoming Request for {self.pet.name} - {self.status}"
    
    @property
    def is_in_cooling_period(self):
        """Check if still in cooling period"""
        if self.status != 'cooling_period' or not self.cooling_period_end:
            return False
        from django.utils import timezone
        return timezone.now() < self.cooling_period_end
    
    @property
    def can_proceed_to_listing(self):
        """Check if request can be converted to active listing"""
        return self.status == 'confirmed' and self.terms_accepted
    
    def cancel(self, reason=""):
        """Cancel the rehoming request"""
        from django.utils import timezone
        self.status = 'cancelled'
        self.cancelled_at = timezone.now()
        self.cancellation_reason = reason
        self.save()


class RehomingListing(models.Model):
    """
    Public/verified listing created from a confirmed RehomingRequest.
    This is what adopters browse.
    """
    
    STATUS_CHOICES = [
        ('pending_review', 'Pending Review'),  # If moderation enabled
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('under_review', 'Under Review'),  # During adoption process
        ('rehomed', 'Successfully Rehomed'),
        ('closed', 'Closed'),
    ]
    
    # Link to request that created this
    request = models.OneToOneField(
        RehomingRequest,
        on_delete=models.CASCADE,
        related_name='listing'
    )
    
    pet = models.OneToOneField(
        'pets.PetProfile',
        on_delete=models.CASCADE,
        related_name='rehoming_listing'
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    
    # Copy key fields from request (for query performance)
    reason = models.TextField()
    urgency = models.CharField(max_length=20)
    ideal_home_notes = models.TextField(blank=True)
    
    # Location
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=50)
    location_zip = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Privacy
    privacy_level = models.CharField(max_length=20, default='public')
    
    # Listing Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Engagement
    view_count = models.IntegerField(default=0)
    inquiry_count = models.IntegerField(default=0)
    
    # Timeline
    published_at = models.DateTimeField(auto_now_add=True)
    paused_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    rehomed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['status', 'urgency']),
            models.Index(fields=['location_state', 'status']),
            models.Index(fields=['published_at']),
        ]
    
    def __str__(self):
        return f"Listing for {self.pet.name} - {self.status}"
    
    def mark_as_rehomed(self):
        """Mark pet and listing as rehomed"""
        from django.utils import timezone
        self.status = 'rehomed'
        self.rehomed_at = timezone.now()
        self.pet.status = 'rehomed'
        self.pet.save()
        self.save()


class AdoptionInquiry(models.Model):
    """
    Previously RehomingRequest.
    A simple handshake request from an adopter to start a conversation.
    """
    listing = models.ForeignKey(RehomingListing, on_delete=models.CASCADE, related_name="inquiries")
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_inquiries")

    message = models.TextField(help_text="Introductory message to the owner")

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending','Pending'),
            ('accepted','Accepted'),
            ('declined','Declined'),
            ('withdrawn','Withdrawn')
        ],
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('listing', 'requester') 

    def __str__(self):
        return f"Inquiry by {self.requester.email} for {self.listing.pet.name}"
