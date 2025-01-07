from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model


User = get_user_model()

class Pet(models.Model):
    class PetStatus(models.TextChoices):
        AVAILABLE = 'available', _('Available')
        PENDING = 'pending', _('Pending')
        ADOPTED = 'adopted', _('Adopted')

    name                = models.CharField(max_length=100, verbose_name="Pet Name")
    species             = models.CharField(max_length=50, verbose_name="Species")
    breed               = models.CharField(max_length=100, verbose_name="Breed", blank=True, null=True)
    age                 = models.PositiveIntegerField(verbose_name="Age (in months)", help_text="Enter pet's age in months")
    color               = models.CharField(max_length=50, verbose_name="Color")
    weight              = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Weight (in kg)")
    gender              = models.CharField(
                            max_length=10,
                            choices=[('male', 'Male'), ('female', 'Female')],
                            verbose_name="Gender"
                        )
    
    description         = models.TextField(verbose_name="Description", blank=True, null=True)
    photo_url           = models.URLField(max_length=300, verbose_name="Photo URL", blank=True, null=True)
    is_vaccinated       = models.BooleanField(default=False, verbose_name="Vaccinated")
    status              = models.CharField(
                            max_length=10,
                            choices=PetStatus.choices,
                            default=PetStatus.AVAILABLE,
                            verbose_name="Adoption Status"
                        )
    
    shelter             = models.ForeignKey(
                            User,
                            on_delete=models.CASCADE,
                            related_name="pets",
                            verbose_name="Shelter"
                        )
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.species}) - {self.get_status_display()}"
