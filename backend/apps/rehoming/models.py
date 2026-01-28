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
        ('confirmed', 'Confirmed'),  # Ready to create listing
        ('listed', 'Listed'),       # Listing has been created
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
    location_state = models.CharField( max_length=50)
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
    
    # Valid status transitions
    STATUS_TRANSITIONS = {
        'pending_review': ['active', 'rejected'],
        'active': ['paused', 'under_review', 'closed', 'rehomed'],
        'paused': ['active', 'closed'],
        'under_review': ['active', 'rehomed', 'closed'],
        'rehomed': [],  # Terminal state
        'closed': []    # Terminal state
    }

    # Link to request that created this
    request = models.OneToOneField(
        RehomingRequest,
        on_delete=models.CASCADE,
        related_name='listing',
        null=False,
        blank=False
    )
    
    pet = models.OneToOneField(
        'pets.PetProfile',
        on_delete=models.CASCADE,
        related_name='rehoming_listing'
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')

    def can_transition_to(self, new_status):
        """Check if status transition is allowed"""
        return new_status in self.STATUS_TRANSITIONS.get(self.status, [])
    
    def save(self, *args, **kwargs):
        """Validate status transitions before saving"""
        if self.pk:  # Existing object
            try:
                old_instance = RehomingListing.objects.get(pk=self.pk)
                if old_instance.status != self.status:
                    if not old_instance.can_transition_to(self.status):
                        from django.core.exceptions import ValidationError
                        raise ValidationError(
                            f"Cannot transition from '{old_instance.status}' to '{self.status}'"
                        )
            except RehomingListing.DoesNotExist:
                pass # Should not happen if self.pk exists
        super().save(*args, **kwargs)
    
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
    
    def mark_as_rehomed(self, new_owner=None):
        """Mark pet and listing as rehomed"""
        from django.utils import timezone
        self.status = 'rehomed'
        self.rehomed_at = timezone.now()
        
        self.pet.status = 'rehomed'
        if new_owner:
            self.pet.owner = new_owner
            
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

    STATUS_CHOICES = [
        ('pending_review', 'Pending Review'),
        ('approved_meet_greet', 'Approved for Meet & Greet'),
        ('adopted', 'Adopted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='pending_review'
    )
    
    owner_notes = models.TextField(blank=True, null=True, help_text="Notes from the owner regarding this application")
    rejection_reason = models.TextField(blank=True, null=True, help_text="Reason for rejection")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('listing', 'requester') 

    def __str__(self):
        return f"Inquiry by {self.requester.email} for {self.listing.pet.name}"
