from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ServiceProvider(models.Model):
    """
    Enhanced service provider model with full contact, verification, and media support.
    Base model for all service provider types (foster, vet, trainer, etc.)
    """
    PROVIDER_TYPES = (
        ('vet', 'Veterinarian'),
        ('foster', 'Foster Home'),
        ('trainer', 'Trainer'),
        ('walker', 'Pet Walker'),
        ('groomer', 'Groomer'),
        ('sitter', 'Pet Sitter'),
    )
    
    VERIFICATION_STATUS_CHOICES = (
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('suspended', 'Suspended'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='service_provider_profile')
    business_name = models.CharField(max_length=100)
    provider_type = models.CharField(max_length=20, choices=PROVIDER_TYPES)
    description = models.TextField(help_text="Business description (500+ words required)")
    website = models.URLField(blank=True, null=True)
    
    # Full Address
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, verbose_name="City")
    state = models.CharField(max_length=100, verbose_name="State")
    zip_code = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Contact Info
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    
    # Verification & Licensing
    license_number = models.CharField(max_length=50, blank=True, help_text="Professional license number")
    insurance_info = models.TextField(blank=True, help_text="Insurance details")
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS_CHOICES,
        default='pending'
    )
    
    # Media
    photos = models.JSONField(
        default=list,
        help_text="Array of photo URLs (business photos)"
    )
    
    # Services Offered (JSON array)
    services_offered = models.JSONField(default=list, help_text="List of services offered")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Service Provider"
        verbose_name_plural = "Service Providers"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['provider_type', 'verification_status']),
            models.Index(fields=['city', 'state']),
            models.Index(fields=['latitude', 'longitude']),
        ]
    
    def __str__(self):
        return f"{self.business_name} ({self.get_provider_type_display()})"
    
    @property
    def full_address(self):
        """Get formatted full address"""
        parts = [self.address_line1]
        if self.address_line2:
            parts.append(self.address_line2)
        parts.append(f"{self.city}, {self.state} {self.zip_code}")
        return ", ".join(parts)
    
    @property
    def photo_count(self):
        """Count of photos"""
        return len(self.photos) if isinstance(self.photos, list) else 0
    
    @property
    def average_rating(self):
        """Calculate average rating from reviews"""
        reviews = self.reviews.all()
        if not reviews.exists():
            return 0
        total = sum(r.rating_overall for r in reviews)
        return round(total / reviews.count(), 1)
    
    @property
    def review_count(self):
        """Count of reviews"""
        return self.reviews.count()


class FosterService(models.Model):
    """
    Specific details for Foster Homes with comprehensive environment and pricing info.
    """
    AVAILABILITY_CHOICES = (
        ('available', 'Available'),
        ('limited', 'Limited'),
        ('full', 'Full'),
    )
    
    provider = models.OneToOneField(ServiceProvider, on_delete=models.CASCADE, related_name='foster_details')
    
    # Capacity
    capacity = models.IntegerField(default=1, help_text="Maximum number of animals")
    current_count = models.IntegerField(default=0, help_text="Current number of animals in care")
    current_availability = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default='available'
    )
    
    # Species Accepted (JSON array)
    # ['dogs', 'cats', 'small_animals', 'birds', 'reptiles']
    species_accepted = models.JSONField(
        default=list,
        help_text="List of species accepted"
    )
    
    # Environment Details (JSON structure)
    # {
    #   "type": "home_based|facility",
    #   "indoor_space_sqft": int,
    #   "outdoor_space": boolean,
    #   "fenced_yard": boolean,
    #   "fence_height_ft": int,
    #   "other_pets": boolean,
    #   "children_in_household": boolean,
    #   "children_ages": [int]
    # }
    environment_details = models.JSONField(
        default=dict,
        help_text="Detailed environment information"
    )
    
    # Care Standards (JSON structure)
    # {
    #   "exercise_routine": string,
    #   "feeding_schedule": string,
    #   "medication_administration": boolean,
    #   "special_diet_accommodation": boolean
    # }
    care_standards = models.JSONField(
        default=dict,
        help_text="Care standards and routines"
    )
    
    # Pricing
    daily_rate = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Daily rate in USD"
    )
    weekly_discount = models.IntegerField(
        default=0,
        help_text="Percentage discount for weekly booking (0-100)"
    )
    monthly_rate = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Monthly rate in USD"
    )
    
    # Media
    photos = models.JSONField(
        default=list,
        help_text="Array of photo URLs (8+ photos required)"
    )
    video_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional facility tour video URL"
    )
    
    class Meta:
        verbose_name = "Foster Service"
        verbose_name_plural = "Foster Services"
    
    def __str__(self):
        return f"Foster details for {self.provider.business_name}"
    
    @property
    def availability_percentage(self):
        """Calculate availability as percentage"""
        if self.capacity == 0:
            return 0
        return int(((self.capacity - self.current_count) / self.capacity) * 100)
    
    @property
    def weekly_rate(self):
        """Calculate weekly rate with discount"""
        weekly_base = self.daily_rate * 7
        discount_amount = weekly_base * (self.weekly_discount / 100)
        return weekly_base - discount_amount


class VeterinaryClinic(models.Model):
    """
    Specific details for Veterinary Clinics with comprehensive service and amenity info.
    """
    CLINIC_TYPE_CHOICES = (
        ('general', 'General Practice'),
        ('emergency', 'Emergency'),
        ('specialty', 'Specialty'),
        ('mobile', 'Mobile Vet'),
    )
    
    provider = models.OneToOneField(ServiceProvider, on_delete=models.CASCADE, related_name='vet_details')
    
    # Clinic Type
    clinic_type = models.CharField(
        max_length=20,
        choices=CLINIC_TYPE_CHOICES,
        default='general'
    )
    
    # Services Offered (JSON array)
    # ['wellness_exams', 'vaccinations', 'dental', 'surgery', 'diagnostics',
    #  'emergency_care', 'boarding', 'grooming']
    services_offered = models.JSONField(
        default=list,
        help_text="List of services offered"
    )
    
    # Species Treated (JSON array)
    # ['dogs', 'cats', 'exotic', 'birds', 'reptiles']
    species_treated = models.JSONField(
        default=list,
        help_text="List of species treated"
    )
    
    # Hours of Operation (JSON structure)
    # {
    #   "monday": {"open": "09:00", "close": "17:00", "closed": false},
    #   "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
    #   ...
    # }
    hours_of_operation = models.JSONField(
        default=dict,
        help_text="Hours for each day of the week"
    )
    
    # Pricing
    pricing_info = models.TextField(
        help_text="Text description of pricing or specific procedure prices"
    )
    
    # Media
    photos = models.JSONField(
        default=list,
        help_text="Array of photo URLs (6+ photos required)"
    )
    
    # Amenities (JSON array)
    # ['separate_cat_area', 'parking', 'wheelchair_accessible',
    #  'on_site_pharmacy', 'boarding_available']
    amenities = models.JSONField(
        default=list,
        help_text="List of amenities available"
    )
    
    # Emergency Services
    emergency_services = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Veterinary Clinic"
        verbose_name_plural = "Veterinary Clinics"
    
    def __str__(self):
        return f"Vet details for {self.provider.business_name}"
    
    def is_open_now(self):
        """Check if clinic is currently open"""
        from django.utils import timezone
        import datetime
        
        now = timezone.now()
        day_name = now.strftime('%A').lower()
        
        if day_name not in self.hours_of_operation:
            return False
        
        day_hours = self.hours_of_operation[day_name]
        if day_hours.get('closed', False):
            return False
        
        try:
            open_time = datetime.datetime.strptime(day_hours['open'], '%H:%M').time()
            close_time = datetime.datetime.strptime(day_hours['close'], '%H:%M').time()
            current_time = now.time()
            return open_time <= current_time <= close_time
        except (KeyError, ValueError):
            return False


class TrainerService(models.Model):
    """
    Specific details for Pet Trainers with comprehensive service and pricing info.
    Supports behavioral intervention resources mentioned in rehoming intervention.
    """
    TRAINING_METHOD_CHOICES = (
        ('positive_reinforcement', 'Positive Reinforcement'),
        ('clicker_training', 'Clicker Training'),
        ('balanced', 'Balanced Training'),
        ('other', 'Other Methods'),
    )
    
    provider = models.OneToOneField(ServiceProvider, on_delete=models.CASCADE, related_name='trainer_details')
    
    # Specializations (JSON array)
    # ['behavioral_issues', 'obedience', 'puppy_training', 'agility', 'therapy_dog', 'service_dog']
    specializations = models.JSONField(
        default=list,
        help_text="List of training specializations"
    )
    
    # Training Methods
    primary_method = models.CharField(
        max_length=30,
        choices=TRAINING_METHOD_CHOICES,
        default='positive_reinforcement'
    )
    training_philosophy = models.TextField(
        help_text="Detailed explanation of training approach and philosophy"
    )
    
    # Certifications (JSON array)
    # [{"name": "CPDT-KA", "organization": "CCPDT", "year": 2020}, ...]
    certifications = models.JSONField(
        default=list,
        help_text="List of professional certifications"
    )
    
    # Experience
    years_experience = models.IntegerField(default=0)
    
    # Species Trained (JSON array)
    species_trained = models.JSONField(
        default=list,
        help_text="Species the trainer works with (typically dogs, cats)"
    )
    
    # Behavioral Issues Addressed (JSON array)
    # ['aggression', 'separation_anxiety', 'fear', 'reactivity', 'house_training', 'jumping', 'barking']
    behavioral_issues_addressed = models.JSONField(
        default=list,
        help_text="Specific behavioral issues the trainer can address"
    )
    
    # Training Options
    offers_private_sessions = models.BooleanField(default=True)
    offers_group_classes = models.BooleanField(default=False)
    offers_board_and_train = models.BooleanField(default=False)
    offers_virtual_training = models.BooleanField(default=False)
    
    # Pricing
    private_session_rate = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Hourly rate for private sessions"
    )
    group_class_rate = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Per-class rate for group sessions"
    )
    
    # Package Options (JSON structure)
    # [
    #   {"name": "Basic Obedience Package", "sessions": 6, "price": 450, "description": "..."},
    #   {"name": "Behavioral Modification", "sessions": 10, "price": 800, "description": "..."}
    # ]
    package_options = models.JSONField(
        default=list,
        blank=True,
        help_text="Pre-packaged training programs with pricing"
    )
    
    # Availability
    max_clients = models.IntegerField(
        default=10,
        help_text="Maximum number of concurrent clients"
    )
    current_client_count = models.IntegerField(default=0)
    accepting_new_clients = models.BooleanField(default=True)
    
    # Media
    photos = models.JSONField(
        default=list,
        help_text="Photos of trainer with dogs, training sessions, etc."
    )
    video_url = models.URLField(
        blank=True,
        null=True,
        help_text="Promotional video or training demonstration"
    )
    
    class Meta:
        verbose_name = "Trainer Service"
        verbose_name_plural = "Trainer Services"
    
    def __str__(self):
        return f"Trainer details for {self.provider.business_name}"
    
    @property
    def is_accepting_clients(self):
        """Check if trainer is accepting new clients based on capacity"""
        if not self.accepting_new_clients:
            return False
        return self.current_client_count < self.max_clients
    
    @property
    def availability_percentage(self):
        """Calculate availability as percentage"""
        if self.max_clients == 0:
            return 0
        return int(((self.max_clients - self.current_client_count) / self.max_clients) * 100)


from apps.pets.models import PetProfile


class ServiceBooking(models.Model):
    """
    Booking/reservation system for foster care and potentially other services.
    """
    BOOKING_TYPE_CHOICES = (
        ('short_term', 'Short Term'),
        ('medium_term', 'Medium Term'),
        ('long_term', 'Long Term'),
        ('respite', 'Respite Care'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    )
    
    provider = models.ForeignKey(FosterService, on_delete=models.CASCADE, related_name='bookings')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_bookings')
    pet = models.ForeignKey(PetProfile, on_delete=models.CASCADE, related_name='foster_bookings')
    
    booking_type = models.CharField(max_length=50, choices=BOOKING_TYPE_CHOICES)
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    daily_rate = models.DecimalField(max_digits=6, decimal_places=2)
    deposit_paid = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    
    special_requirements = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    cancellation_reason = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['start_date', 'end_date']),
        ]
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Booking for {self.pet.name} with {self.provider.provider.business_name}"
        
    @property
    def total_days(self):
        """Calculate duration days"""
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            return max(1, delta.days)
        return 0
        
    @property
    def total_cost(self):
        """Calculate total cost"""
        return self.daily_rate * self.total_days


class ServiceReview(models.Model):
    """
    Enhanced service review with detailed rating categories matching spec.
    """
    provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_reviews')
    
    # Overall + Specific Ratings (1-5 stars each)
    rating_overall = models.IntegerField(choices=[(i, f"{i} Stars") for i in range(1, 6)])
    rating_communication = models.IntegerField(choices=[(i, f"{i} Stars") for i in range(1, 6)])
    rating_cleanliness = models.IntegerField(choices=[(i, f"{i} Stars") for i in range(1, 6)])
    rating_quality = models.IntegerField(choices=[(i, f"{i} Stars") for i in range(1, 6)], verbose_name="Quality of Care")
    rating_value = models.IntegerField(choices=[(i, f"{i} Stars") for i in range(1, 6)], verbose_name="Value for Money")
    
    # Review Content
    review_text = models.TextField(help_text="Detailed review (200+ words required)")
    photo_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional photo with review"
    )
    
    # Service Type Used
    service_type = models.CharField(
        max_length=20,
        help_text="Type of service used (foster, vet, etc.)"
    )
    
    # Verification
    verified_client = models.BooleanField(
        default=False,
        help_text="Has admin verified this person actually used the service?"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('provider', 'reviewer')
        verbose_name = "Service Review"
        verbose_name_plural = "Service Reviews"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.rating_overall}* for {self.provider.business_name} by {self.reviewer.email}"
    
    @property
    def average_rating(self):
        """Calculate average of all rating categories"""
        ratings = [
            self.rating_overall,
            self.rating_communication,
            self.rating_cleanliness,
            self.rating_quality,
            self.rating_value,
        ]
        return round(sum(ratings) / len(ratings), 1)
