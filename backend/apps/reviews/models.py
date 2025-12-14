from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class AdoptionReview(models.Model):
    """
    Detailed review system for completed adoptions.
    Both pet owners and adopters can review each other after adoption.
    """
    application = models.ForeignKey(
        'adoption.AdoptionApplication',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_received')
    
    REVIEWER_ROLE_CHOICES = (
        ('pet_owner', 'Pet Owner'),
        ('adopter', 'Adopter'),
    )
    reviewer_role = models.CharField(max_length=20, choices=REVIEWER_ROLE_CHOICES)
    
    # Overall rating (required)
    rating_overall = models.IntegerField(choices=[(i, f"{i} Stars") for i in range(1, 6)])
    
    # Role-specific ratings (optional but recommended)
    # For adopters reviewing pet owners: responsiveness, honesty, communication
    # For pet owners reviewing adopters: responsiveness, preparation, follow-through
    rating_responsiveness = models.IntegerField(
        choices=[(i, f"{i} Stars") for i in range(1, 6)],
        null=True,
        blank=True
    )
    rating_preparation = models.IntegerField(
        choices=[(i, f"{i} Stars") for i in range(1, 6)],
        null=True,
        blank=True,
        help_text="For pet owners reviewing adopters"
    )
    rating_honesty = models.IntegerField(
        choices=[(i, f"{i} Stars") for i in range(1, 6)],
        null=True,
        blank=True,
        help_text="For adopters reviewing pet owners (description accuracy)"
    )
    rating_communication = models.IntegerField(
        choices=[(i, f"{i} Stars") for i in range(1, 6)],
        null=True,
        blank=True
    )
    rating_care_quality = models.IntegerField(
        choices=[(i, f"{i} Stars") for i in range(1, 6)],
        null=True,
        blank=True,
        help_text="For adopters reviewing pet owners (pet care quality)"
    )
    rating_followthrough = models.IntegerField(
        choices=[(i, f"{i} Stars") for i in range(1, 6)],
        null=True,
        blank=True,
        help_text="For pet owners reviewing adopters"
    )
    
    # Review content
    review_text = models.TextField(help_text="Detailed review of the adoption experience (200+ chars)")
    would_recommend = models.BooleanField(default=True)
    
    # Denormalized pet name for display
    pet_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Pet name from application for easy reference"
    )
    
    # Review prompt tracking
    review_prompt_sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When review prompt email was sent (7 days after adoption)"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Adoption Review'
        verbose_name_plural = 'Adoption Reviews'
        unique_together = ('application', 'reviewer')  # One review per person per application
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.rating_overall}* Review by {self.reviewer.email} for {self.reviewee.email}"
    
    @property
    def average_category_rating(self):
        """Calculate average of all category ratings"""
        ratings = [
            r for r in [
                self.rating_responsiveness,
                self.rating_preparation,
                self.rating_honesty,
                self.rating_communication,
                self.rating_care_quality,
                self.rating_followthrough,
            ] if r is not None
        ]
        if not ratings:
            return self.rating_overall
        return round(sum(ratings) / len(ratings), 1)
    
    def save(self, *args, **kwargs):
        """Auto-populate pet_name from application if not set"""
        if not self.pet_name and self.application:
            self.pet_name = self.application.pet.pet_name
        super().save(*args, **kwargs)
    
    @classmethod
    def send_review_prompts_for_adoption(cls, application):
        """
        Send review prompts to both parties 7 days after adoption.
        Called by scheduled task.
        """
        # Check if adoption was completed 7 days ago
        if application.status not in ['adopted', 'completed']:
            return False
        
        # Check if 7 days have passed since adoption completion
        if application.updated_at:
            prompt_date = application.updated_at + timedelta(days=7)
        if timezone.now() < prompt_date:
            return False
        
        # Check if prompts already sent
        prompts_sent = cls.objects.filter(
            application=application,
            review_prompt_sent_at__isnull=False
        ).exists()
        
        if prompts_sent:
            return False
        
        # TODO: Send actual emails to both parties
        # For now, just mark as prompted
        
        return True
