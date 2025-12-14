from django.db import models
from django.contrib.auth import get_user_model
from apps.pets.models import RehomingListing

User = get_user_model()

class AdoptionApplication(models.Model):
    """
    Comprehensive adoption application with full workflow support.
    """
    STATUS_CHOICES = (
        ('pending_review', 'Pending Review'),
        ('info_requested', 'Info Requested'),
        ('rejected', 'Rejected'),
        ('approved_meet_greet', 'Approved for Meet & Greet'),
        ('meet_greet_success', 'Meet & Greet Success'),
        ('trial_period', 'Trial Period'),
        ('adopted', 'Adopted'),
        ('completed', 'Completed'),
        ('returned', 'Returned'),
    )

    RESIDENCE_CHOICES = (
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('condo', 'Condo'),
        ('townhouse', 'Townhouse'),
        ('other', 'Other'),
    )

    OWNERSHIP_CHOICES = (
        ('own', 'Own'),
        ('rent', 'Rent'),
    )

    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    pet = models.ForeignKey(RehomingListing, on_delete=models.CASCADE, related_name='applications')
    
    # Link to comprehensive adopter profile
    adopter_profile = models.ForeignKey(
        'AdopterProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='applications',
        help_text="Snapshot of adopter profile at time of application"
    )

    # Required personalized message (500+ words)
    message = models.TextField(help_text="Why do you want to adopt this specific pet? (500+ words)")
    
    # Enhanced fields for PetCircle
    custom_answers = models.JSONField(
        default=dict,
        blank=True,
        help_text="Answers to pet owner's custom questions"
    )
    readiness_score = models.IntegerField(
        default=0,
        help_text="Calculated from adopter profile (0-100)"
    )
    
    # Status & Review
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending_review')
    rejection_reason = models.TextField(blank=True, null=True, help_text="Reason for rejection")
    owner_notes = models.TextField(blank=True, null=True, help_text="Internal notes for the pet owner")
    
    # Info Request Workflow
    info_requested_at = models.DateTimeField(null=True, blank=True)
    info_request_message = models.TextField(
        blank=True,
        help_text="Questions from pet owner requesting more info"
    )
    
    # Meet & Greet Approval
    contact_info_revealed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When contact info was revealed after meet & greet approval"
    )
    
    # Trial Period
    trial_period_start = models.DateTimeField(null=True, blank=True)
    trial_period_end = models.DateTimeField(null=True, blank=True)
    trial_period_duration = models.IntegerField(
        default=30,
        help_text="Trial period duration in days"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('applicant', 'pet')
        verbose_name = "Adoption Application"
        verbose_name_plural = "Adoption Applications"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['applicant', 'status']),
            models.Index(fields=['pet', 'status']),
        ]

    def __str__(self):
        return f"Application by {self.applicant.email} for {self.pet.pet_name}"
    
    @property
    def is_approved_for_contact(self):
        """Check if contact info should be revealed"""
        return self.status in ['approved_meet_greet', 'meet_greet_success', 
                                'trial_period', 'adopted', 'completed']
    
    @property
    def is_in_trial_period(self):
        """Check if currently in trial period"""
        if self.status != 'trial_period' or not self.trial_period_start or not self.trial_period_end:
            return False
        from django.utils import timezone
        now = timezone.now()
        return self.trial_period_start <= now <= self.trial_period_end
    
    def start_trial_period(self, days=30):
        """Start trial period"""
        from django.utils import timezone
        from datetime import timedelta
        self.trial_period_start = timezone.now()
        self.trial_period_end = self.trial_period_start + timedelta(days=days)
        self.trial_period_duration = days
        self.status = 'trial_period'
        self.save()


class AdopterProfile(models.Model):
    """
    Comprehensive adopter profile for matching and readiness assessment.
    Created on first adoption application.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='adopter_profile')
    
    # Housing Information
    HOUSING_CHOICES = (
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('condo', 'Condo'),
        ('townhouse', 'Townhouse'),
        ('other', 'Other'),
    )
    housing_type = models.CharField(max_length=20, choices=HOUSING_CHOICES)
    own_or_rent = models.CharField(max_length=10, choices=[('own', 'Own'), ('rent', 'Rent')])
    landlord_approval = models.BooleanField(default=False, help_text="Required if renting")
    landlord_document_url = models.URLField(blank=True, null=True)
    
    YARD_CHOICES = (
        ('none', 'No Yard'),
        ('small_unfenced', 'Small Unfenced Yard'),
        ('small_fenced', 'Small Fenced Yard'),
        ('medium_unfenced', 'Medium Unfenced Yard'),
        ('medium_fenced', 'Medium Fenced Yard'),
        ('large_fenced', 'Large Fenced Yard'),
        ('acreage', 'Acreage'),
    )
    yard_type = models.CharField(max_length=20, choices=YARD_CHOICES)
    yard_fenced = models.BooleanField(default=False)
    
    # Household Information
    num_adults = models.IntegerField(default=1)
    num_children = models.IntegerField(default=0)
    children_ages = models.JSONField(default=list, help_text="List of children's ages")
    
    # Current Pets (JSON structure: [{species, breed, age, spayed_neutered}])
    current_pets = models.JSONField(default=list)
    
    # Experience & Lifestyle
    # JSON: {dogs: years, cats: years, other: years}
    pet_experience = models.JSONField(default=dict)
    
    # Previous ownership - track surrenders
    ever_surrendered_pet = models.BooleanField(default=False)
    surrender_explanation = models.TextField(
        blank=True,
        help_text="If yes, explain what happened"
    )
    
    work_schedule = models.CharField(
        max_length=100,
        help_text="e.g., '9-5 weekdays', 'work from home'"
    )
    
    ACTIVITY_CHOICES = [(i, str(i)) for i in range(1, 6)]
    activity_level = models.IntegerField(
        choices=ACTIVITY_CHOICES,
        help_text="1=Sedentary, 5=Very Active"
    )
    
    exercise_commitment_hours = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        help_text="Hours per day willing to dedicate to pet exercise"
    )
    
    TRAVEL_CHOICES = (
        ('rarely', 'Rarely'),
        ('monthly', 'Monthly'),
        ('weekly', 'Weekly'),
        ('frequently', 'Frequently'),
    )
    travel_frequency = models.CharField(max_length=20, choices=TRAVEL_CHOICES)
    
    # References (JSON: [{name, relationship, phone, email}])
    references = models.JSONField(default=list, help_text="Personal references (2 required)")
    
    # Veterinarian Reference (if previous/current pet owner)
    vet_reference_clinic = models.CharField(max_length=200, blank=True)
    vet_reference_phone = models.CharField(max_length=15, blank=True)
    
    # Motivation
    why_adopt = models.TextField(help_text="Why do you want to adopt a pet? (500+ words)")
    ideal_pet_description = models.TextField(
        blank=True,
        help_text="Describe your ideal pet (optional)"
    )
    
    # Calculated Score (0-100)
    readiness_score = models.IntegerField(
        default=0,
        help_text="Calculated based on profile completeness and suitability"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Adopter Profile'
        verbose_name_plural = 'Adopter Profiles'
        constraints = [
            models.CheckConstraint(
                check=models.Q(readiness_score__gte=0) & models.Q(readiness_score__lte=100),
                name='readiness_score_range'
            ),
        ]
    
    def __str__(self):
        return f"Adopter Profile for {self.user.email}"
    
    def calculate_readiness_score(self):
        """
        Calculate adopter readiness score based on profile completeness.
        Algorithm matches spec requirements.
        """
        score = 0
        
        # Housing (20 points)
        if self.housing_type:
            score += 10
        if self.own_or_rent == 'own' or self.landlord_approval:
            score += 10
            
        # Household (15 points)
        if self.num_adults > 0:
            score += 5
        if self.children_ages or self.num_children == 0:
            score += 10
            
        # Experience (25 points)
        if self.pet_experience:
            total_years = sum(self.pet_experience.values())
            score += min(25, total_years * 5)
            
        # Lifestyle (20 points)
        if self.work_schedule:
            score += 10
        if self.exercise_commitment_hours and self.exercise_commitment_hours > 0:
            score += 10
            
        # References (10 points)
        score += min(10, len(self.references) * 5)
        
        # Motivation (10 points)
        if self.why_adopt and len(self.why_adopt) > 100:
            score += 10
            
        self.readiness_score = score
        return score

    def save(self, *args, **kwargs):
        """Auto-calculate readiness score on save"""
        self.calculate_readiness_score()
        super().save(*args, **kwargs)
    
    @property
    def readiness_level(self):
        """Get readiness level category"""
        if self.readiness_score >= 80:
            return 'Ready'
        elif self.readiness_score >= 60:
            return 'Good'
        else:
            return 'Needs Improvement'
