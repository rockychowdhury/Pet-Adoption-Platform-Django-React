from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from utils.RoleValidity import is_valid_role

class UserManager(BaseUserManager):
    def create_user(self, email, password = None, **kwargs):
        if not email:
            raise ValueError('Email is Required')

        email = self.normalize_email(email)
        user = self.model(email=email,**kwargs)
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_superuser(self, email, password=None, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        if not kwargs.get('is_staff') or not kwargs.get('is_superuser'):
            raise ValueError("Superuser must have is_staff=True and is_superuser=True.")
        user = self.create_user(email=email, password=password, **kwargs)
        user.role = User.UserRole.ADMIN
        user.save()
        return user 



class User(AbstractBaseUser, PermissionsMixin):
    class UserRole(models.TextChoices):
        ADMIN                   = 'admin', _('Admin')
        SERVICE_PROVIDER        = 'service_provider', _('Service Provider')
        USER                    = 'user', _('User')

    class AccountStatus(models.TextChoices):
        ACTIVE = 'active', _('Active')
        SUSPENDED = 'suspended', _('Suspended')
        BANNED = 'banned', _('Banned')

    # Basic Information
    email                   = models.EmailField(unique=True)
    username                = models.CharField(max_length=50, unique=True, blank=True, null=True, help_text="Display name for the user")
    first_name              = models.CharField(max_length=50)
    last_name               = models.CharField(max_length=50)
    phone_number            = models.CharField(max_length=15, blank=True, null=True)
    photoURL                = models.URLField(max_length=200, blank=True, null=True, default='https://i.ibb.co.com/hWK4ZpT/petDP.jpg')
    bio                     = models.TextField(max_length=500, blank=True, null=True)
    
    # Location Fields (for PetCircle peer-to-peer matching)
    location_city           = models.CharField(max_length=100, blank=True, null=True)
    location_state          = models.CharField(max_length=100, blank=True, null=True)
    location_country        = models.CharField(max_length=100, default='USA')
    zip_code                = models.CharField(max_length=10, blank=True, null=True, help_text="Postal code for precise location matching")
    
    # Verification Fields (PetCircle trust system)
    email_verified          = models.BooleanField(default=False)
    phone_verified          = models.BooleanField(default=False)
    verified_identity       = models.BooleanField(default=False)  # Government ID verified
    pet_owner_verified      = models.BooleanField(default=False)  # Pet ownership docs verified
    
    verification_code = models.CharField(max_length=6, blank=True, null=True, help_text="Email verification code")
    verification_code_expires_at = models.DateTimeField(blank=True, null=True)
    phone_verification_code = models.CharField(max_length=6, blank=True, null=True, help_text="Phone verification code (SMS)")
    phone_verification_code_expires_at = models.DateTimeField(blank=True, null=True)

    # Privacy Settings
    class ProfileVisibility(models.TextChoices):
        PUBLIC = 'public', _('Public')
        FRIENDS = 'friends', _('Friends Only')
        PRIVATE = 'private', _('Private')
    
    profile_visibility      = models.CharField(max_length=10, choices=ProfileVisibility.choices, default=ProfileVisibility.PUBLIC)
    
    # Role and Status
    role                    = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.USER)
    account_status          = models.CharField(max_length=20, choices=AccountStatus.choices, default=AccountStatus.ACTIVE)
    
    # Django Auth Fields
    is_active               = models.BooleanField(default=False)
    is_staff                = models.BooleanField(default=False)
    is_superuser            = models.BooleanField(default=False)
    date_joined             = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD              = 'email'
    REQUIRED_FIELDS             = ['first_name', 'last_name']


    class Meta:
        verbose_name            ='User'
        verbose_name_plural     = 'Users'
    
    def __str__(self) -> str:
        return f"{self.email} ({self.role})"
    
    @property
    def is_user(self):
        return self.role == User.UserRole.USER
    
    @property
    def is_service_provider(self):
        return self.role == User.UserRole.SERVICE_PROVIDER

    @property
    def is_admin(self):
        return self.role == User.UserRole.ADMIN
    
    @property
    def is_verified(self):
        """User is considered verified if email and phone are verified"""
        return self.email_verified and self.phone_verified
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def can_create_listing(self):
        """Only verified users can create rehoming listings"""
        return self.is_verified and self.account_status == User.AccountStatus.ACTIVE




class PetProfile(models.Model):
    """
    Pet profile model for user's pets.
    Can be linked to rehoming listings or used as social pet profiles.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pet_profiles')
    name = models.CharField(max_length=100)
    species = models.CharField(
        max_length=50,
        choices=[
            ('dog', 'Dog'),
            ('cat', 'Cat'),
            ('rabbit', 'Rabbit'),
            ('bird', 'Bird'),
            ('other', 'Other'),
        ]
    )
    breed = models.CharField(max_length=100, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True, help_text="Pet's birth date")
    age = models.PositiveIntegerField(help_text="Age in years (if birth date unknown)", blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[('male', 'Male'), ('female', 'Female'), ('unknown', 'Unknown')],
        blank=True,
        null=True
    )
    
    description = models.TextField(max_length=500, blank=True, null=True, help_text="Short description (500 char max)")
    photos = models.JSONField(default=list, blank=True, help_text="Array of photo URLs (up to 5 photos)")
    profile_photo = models.URLField(blank=True, null=True, help_text="Main profile photo URL")
    
    # Status
    is_active = models.BooleanField(default=True, help_text="Pet profile status: active, inactive, deceased")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pet Profile"
        verbose_name_plural = "Pet Profiles"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.owner.email})"
    
    @property
    def age_display(self):
        """Calculate and display age"""
        if self.birth_date:
            from django.utils import timezone
            today = timezone.now().date()
            years = today.year - self.birth_date.year
            if today.month < self.birth_date.month or (today.month == self.birth_date.month and today.day < self.birth_date.day):
                years -= 1
            return f"{years} year{'s' if years != 1 else ''}"
        elif self.age:
            return f"{self.age} year{'s' if self.age != 1 else ''}"
        return "Unknown"


# Keep UserPet as alias for backward compatibility
UserPet = PetProfile


class UserProfile(models.Model):
    """
    Extended profile information for PetCircle users.
    Stores privacy settings and verification badges.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Privacy Settings (JSON structure)
    # {
    #   'profile_visibility': 'public/friends/private',
    #   'contact_visibility': 'public/verified_only/private',
    #   'show_location': bool,
    #   'show_phone': bool
    # }
    privacy_settings = models.JSONField(default=dict, blank=True)
    
    # Verification Badges (JSON structure)
    # {
    #   'email_verified': bool,
    #   'phone_verified': bool,
    #   'identity_verified': bool,
    #   'pet_owner_verified': bool
    # }
    verification_badges = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile for {self.user.email}"
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


class VerificationDocument(models.Model):
    """
    Stores verification documents uploaded by users for identity and pet ownership verification.
    Admins review these documents to grant verification badges.
    """
    DOCUMENT_TYPES = (
        ('government_id', 'Government ID'),
        ('pet_ownership', 'Pet Ownership Proof'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    document_url = models.URLField(max_length=500, help_text="URL to uploaded document (stored in cloud)")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True, help_text="Admin review notes")
    reviewed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='reviewed_documents'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.get_document_type_display()} for {self.user.email} - {self.get_status_display()}"
    
    class Meta:
        verbose_name = 'Verification Document'
        verbose_name_plural = 'Verification Documents'
        ordering = ['-created_at']


class RoleRequest(models.Model):
    """
    Model for users to request a role change (e.g., to Service Provider).
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='role_requests')
    requested_role = models.CharField(max_length=20, choices=User.UserRole.choices)
    reason = models.TextField(help_text="Reason for requesting this role")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True, help_text="Notes from admin regarding approval/rejection")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} requesting {self.requested_role}"

    class Meta:
        ordering = ['-created_at']

