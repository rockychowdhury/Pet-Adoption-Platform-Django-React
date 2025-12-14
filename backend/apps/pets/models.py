from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta


User = get_user_model()

class RehomingListing(models.Model):
    """
    Comprehensive rehoming listing model for PetCircle.
    Replaces the old Pet model with full feature set from specification.
    """
    
    class ListingStatus(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        PENDING_REVIEW = 'pending_review', _('Pending Review')
        ACTIVE = 'active', _('Active')
        ON_HOLD = 'on_hold', _('On Hold')
        ADOPTED = 'adopted', _('Adopted')
        EXPIRED = 'expired', _('Expired')
        REJECTED = 'rejected', _('Rejected')
        WITHDRAWN = 'withdrawn', _('Withdrawn')
    
    class UrgencyLevel(models.TextChoices):
        IMMEDIATE = 'immediate', _('Immediate')
        ONE_MONTH = '1_month', _('Within 1 Month')
        THREE_MONTHS = '3_months', _('Within 3 Months')
        FLEXIBLE = 'flexible', _('Flexible')
    
    SIZE_CHOICES = (
        ('xs', 'Extra Small (0-10 lbs)'),
        ('small', 'Small (11-25 lbs)'),
        ('medium', 'Medium (26-60 lbs)'),
        ('large', 'Large (61-100 lbs)'),
        ('xl', 'Extra Large (100+ lbs)'),
    )
    
    # Owner & Pet Profile Reference
    pet_owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="rehoming_listings",
        verbose_name="Pet Owner"
    )
    pet_profile = models.ForeignKey(
        'users.PetProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="rehoming_listings",
        help_text="Link to pet profile, or create inline"
    )
    
    # Basic Pet Information (can be inline if not linking to UserPet)
    pet_name = models.CharField(max_length=100, verbose_name="Pet Name")
    species = models.CharField(max_length=50, verbose_name="Species")
    breed = models.CharField(max_length=100, verbose_name="Breed", blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True, help_text="Pet's birth date for accurate age calculation")
    age_months = models.PositiveIntegerField(verbose_name="Age (in months)", help_text="Age in months if birth date unknown")
    gender = models.CharField(
        max_length=10,
        choices=[('male', 'Male'), ('female', 'Female'), ('unknown', 'Unknown')],
        verbose_name="Gender"
    )
    color = models.CharField(max_length=50, verbose_name="Color", blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Weight (in lbs)", null=True, blank=True)
    size = models.CharField(max_length=15, choices=SIZE_CHOICES, default='medium', verbose_name="Size")
    
    # Medical History (Comprehensive JSON Structure)
    # {
    #   "spayed_neutered": "yes|no|scheduled",
    #   "microchipped": boolean,
    #   "microchip_number": string,
    #   "vaccinations_up_to_date": "yes|no|partial",
    #   "vaccination_records_url": string,
    #   "current_medications": [string],
    #   "medical_conditions": ["none"|"allergies"|"arthritis"|...],
    #   "last_vet_visit": "YYYY-MM-DD",
    #   "vet_contact": {"name": string, "clinic": string, "phone": string}
    # }
    medical_history = models.JSONField(default=dict, blank=True, verbose_name="Medical History")
    
    # Behavioral Profile (10 Questions from Spec)
    # {
    #   "energy_level": 1-5,
    #   "good_with_children": "yes|no|unknown",
    #   "children_age_range": string,
    #   "good_with_dogs": "yes|no|selective|unknown",
    #   "good_with_cats": "yes|no|unknown",
    #   "house_trained": "yes|mostly|no",
    #   "crate_trained": boolean,
    #   "separation_anxiety": "yes|no|mild",
    #   "exercise_needs": "minimal|moderate|high|intense",
    #   "ideal_home_type": "any|house_yard_preferred|house_yard_required"
    # }
    behavioral_profile = models.JSONField(default=dict, blank=True, verbose_name="Behavioral Profile")
    
    # Aggression Disclosure (REQUIRED)
    aggression_disclosed = models.BooleanField(default=False, help_text="Has aggression been disclosed?")
    aggression_to_people = models.BooleanField(default=False, help_text="Has bitten or injured a person?")
    aggression_to_animals = models.BooleanField(default=False, help_text="Has bitten or injured another animal?")
    aggression_details = models.TextField(blank=True, help_text="Describe any aggression incidents")
    
    # Rehoming Story (1000+ chars required)
    rehoming_story = models.TextField(
        verbose_name="Rehoming Story",
        help_text="Tell us about the pet and why they need a new home (1000+ characters required)"
    )
    
    # Media (5-15 photos required, 1 optional video)
    photos = models.JSONField(
        default=list,
        help_text="Array of photo URLs (5 required, 15 max)",
        verbose_name="Photos"
    )
    watermarked_photos = models.JSONField(
        default=list,
        blank=True,
        help_text="Auto-generated watermarked versions",
        verbose_name="Watermarked Photos"
    )
    video_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Optional video (15 sec - 3 min)",
        verbose_name="Video URL"
    )
    
    # Adoption Fee & Terms
    adoption_fee = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.00,
        verbose_name="Adoption Fee",
        help_text="$0-300 allowed"
    )
    fee_explanation = models.TextField(
        blank=True,
        help_text="Required if fee > $0",
        verbose_name="Fee Explanation"
    )
    
    # Included Items (JSON array of checkboxes)
    # ["food", "bowls", "leash", "crate", "bed", "toys", "medical_records", "microchip_info", "other"]
    included_items = models.JSONField(default=list, blank=True, help_text="Items included with adoption")
    
    # Custom Questions for Applicants (JSON array)
    # [{"question": "Do you have experience with high-energy dogs?", "required": true}, ...]
    custom_questions = models.JSONField(
        default=list,
        blank=True,
        help_text="Custom screening questions for applicants"
    )
    
    # Timeline & Urgency
    timeline_adoption_date = models.DateField(
        null=True,
        blank=True,
        help_text="Ideal adoption date",
        verbose_name="Ideal Adoption Date"
    )
    urgency_level = models.CharField(
        max_length=20,
        choices=UrgencyLevel.choices,
        default=UrgencyLevel.FLEXIBLE,
        verbose_name="Urgency"
    )
    
    # Adopter Preferences
    adopter_experience_required = models.CharField(
        max_length=50,
        blank=True,
        help_text="e.g., 'First-time owner OK', 'Experienced dog owner required'"
    )
    willing_to_stay_in_touch = models.BooleanField(default=True)
    take_back_policy = models.CharField(
        max_length=200,
        blank=True,
        help_text="Will you take the pet back if adoption doesn't work out?"
    )
    
    # Location
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=100)
    location_zip = models.CharField(max_length=10, blank=True)
    location_lat = models.FloatField(null=True, blank=True)
    location_lng = models.FloatField(null=True, blank=True)
    service_area_miles = models.IntegerField(
        default=50,
        help_text="Service area in miles (999=statewide, 9999=national)"
    )
    hide_exact_address = models.BooleanField(default=True, help_text="Hide address until application approved")
    
    # Status & Moderation
    status = models.CharField(
        max_length=20,
        choices=ListingStatus.choices,
        default=ListingStatus.DRAFT,
        verbose_name="Listing Status"
    )
    rejection_reason = models.TextField(blank=True, null=True, help_text="Reason for rejection by admin")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True, help_text="When listing was approved and published")
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Auto-set to published_at + 90 days")
    
    class Meta:
        verbose_name = "Rehoming Listing"
        verbose_name_plural = "Rehoming Listings"
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['species', 'status']),
            models.Index(fields=['location_city', 'location_state']),
            models.Index(fields=['adoption_fee']),
            models.Index(fields=['-published_at']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(adoption_fee__gte=0) & models.Q(adoption_fee__lte=300),
                name='adoption_fee_range'
            ),
        ]
    
    def __str__(self):
        return f"{self.pet_name} ({self.species}) - {self.get_status_display()}"
    
    @property
    def age_in_months(self):
        """Calculate age in months from birth_date if available"""
        if self.birth_date:
            today = timezone.now().date()
            months = (today.year - self.birth_date.year) * 12 + (today.month - self.birth_date.month)
            return max(0, months)
        return self.age_months
    
    @property
    def age_display(self):
        """Human-readable age display"""
        months = self.age_in_months
        if months < 12:
            return f"{months} month{'s' if months != 1 else ''}"
        else:
            years = months // 12
            remaining_months = months % 12
            if remaining_months == 0:
                return f"{years} year{'s' if years != 1 else ''}"
            return f"{years}y {remaining_months}m"
    
    @property
    def is_expired(self):
        """Check if listing has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def photo_count(self):
        """Count of photos"""
        return len(self.photos) if isinstance(self.photos, list) else 0
    
    @property
    def has_video(self):
        """Check if listing has video"""
        return bool(self.video_url)
    
    def publish(self):
        """Publish the listing (set by admin approval)"""
        self.status = self.ListingStatus.ACTIVE
        self.published_at = timezone.now()
        self.expires_at = self.published_at + timedelta(days=90)
        self.save()
    
    def expire(self):
        """Mark listing as expired"""
        self.status = self.ListingStatus.EXPIRED
        self.save()
    
    def check_and_expire(self):
        """Check if listing should be expired and update status"""
        if self.is_expired and self.status == self.ListingStatus.ACTIVE:
            self.expire()




class PetDocument(models.Model):
    """
    Documents for rehoming listings (vaccination records, vet records, etc.)
    """
    DOCUMENT_TYPES = (
        ('vaccination', 'Vaccination Record'),
        ('vet_records', 'Veterinary Records'),
        ('microchip', 'Microchip Registration'),
        ('other', 'Other'),
    )
    
    pet = models.ForeignKey(RehomingListing, on_delete=models.CASCADE, related_name='documents')
    document_url = models.URLField(max_length=500)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, default='other')
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} for {self.pet.pet_name}"
