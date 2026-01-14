from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PetProfile(models.Model):
    """
    Refactored PetProfile: The canonical source of pet truth.
    Stores immutable/slow-changing facts about the pet.
    """
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="pets"
    )

    # Identity
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=20, choices=[
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('rabbit', 'Rabbit'),
        ('bird', 'Bird'),
        ('other', 'Other')
    ])
    breed = models.CharField(max_length=100, blank=True)

    birth_date = models.DateField(null=True, blank=True)

    gender = models.CharField(
        max_length=10,
        choices=[('male','Male'), ('female','Female'), ('unknown','Unknown')],
        default='unknown'
    )

    # Physical
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    size_category = models.CharField(
        max_length=10,
        choices=[('small','Small'), ('medium','Medium'), ('large','Large')],
        blank=True,
        null=True
    )

    # Health (baseline only)
    spayed_neutered = models.BooleanField(default=False)
    microchipped = models.BooleanField(default=False)

    # Lifecycle
    status = models.CharField(
        max_length=20,
        choices=[
            ('active','Active'),
            ('rehomed','Rehomed'),
            ('deceased','Deceased')
        ],
        default='active'
    )
    
    # Description (Moved from listing/old profile)
    description = models.TextField(max_length=1000, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.species})"

    @property
    def profile_is_complete(self):
        """
        Checks if the pet profile has all required fields for rehoming.
        """
        required_fields = [
            self.name,
            self.species,
            self.breed,
            self.birth_date or self.age_display, # birth_date is enough? age_display isn't a field.
            self.gender,
            self.description
        ]
        # Check birth_date specificly
        has_age = self.birth_date is not None
        has_photo = self.media.exists()
        
        # Check simple fields
        basic_fields = [self.name, self.species, self.gender, self.description]
        
        return all(basic_fields) and has_age and has_photo

    class Meta:
        ordering = ['-created_at']


class PetMedia(models.Model):
    pet = models.ForeignKey(PetProfile, on_delete=models.CASCADE, related_name="media")
    url = models.URLField()
    delete_url = models.URLField(max_length=500, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_primary:
            # Demote others
            PetMedia.objects.filter(pet=self.pet, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Media for {self.pet.name}"


class PersonalityTrait(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name


class PetPersonality(models.Model):
    pet = models.ForeignKey(PetProfile, on_delete=models.CASCADE, related_name='traits')
    trait = models.ForeignKey(PersonalityTrait, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('pet', 'trait')

    def __str__(self):
        return f"{self.pet.name} is {self.trait.name}"
