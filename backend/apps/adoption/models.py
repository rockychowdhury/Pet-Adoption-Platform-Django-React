from django.db import models
from django.contrib.auth import get_user_model
from apps.pets.models import Pet

User = get_user_model()

class AdoptionApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('adopted', 'Adopted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    )

    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='applications')
    message = models.TextField(help_text="Why do you want to adopt this pet?")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True, help_text="Reason for rejection")
    shelter_notes = models.TextField(blank=True, null=True, help_text="Internal notes for the shelter")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('applicant', 'pet')

    def __str__(self):
        return f"Application by {self.applicant.email} for {self.pet.name}"
