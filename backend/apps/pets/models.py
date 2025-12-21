from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()

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
    
    # Physical Attributes
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Weight in lbs")
    size_category = models.CharField(
        max_length=10,
        choices=[
            ('xs', 'Extra Small'),
            ('small', 'Small'),
            ('medium', 'Medium'),
            ('large', 'Large'),
            ('xl', 'Extra Large'),
        ],
        blank=True,
        null=True
    )

    # Community & Personality Features
    description = models.TextField(max_length=500, blank=True, null=True, help_text="Short description (500 char max)")
    photos = models.JSONField(default=list, blank=True, help_text="Array of photo URLs")
    personality_traits = models.JSONField(default=list, blank=True, help_text="e.g., playful, calm, energetic")
    
    gotcha_day = models.DateField(blank=True, null=True, help_text="Adoption anniversary")
    health_status = models.TextField(blank=True, null=True, help_text="Health notes")

    # Health & Safety (Critical for Rehoming)
    is_spayed_neutered = models.BooleanField(default=False)
    is_microchipped = models.BooleanField(default=False)
    microchip_number = models.CharField(max_length=50, blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True, help_text="Pet profile status: active, inactive, deceased")
    is_for_rehoming = models.BooleanField(default=False, help_text="Linked to rehoming listing")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pet Profile"
        verbose_name_plural = "Pet Profiles"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner']),
            models.Index(fields=['species']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.owner.email})"
