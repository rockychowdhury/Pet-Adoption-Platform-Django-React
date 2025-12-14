from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import AdoptionApplication

User = get_user_model()


class MeetGreetSchedule(models.Model):
    """
    Schedule and track meet & greet appointments between adopters and pet owners.
    Part of Phase 2 adoption workflow enhancement.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    )
    
    application = models.ForeignKey(
        AdoptionApplication,
        on_delete=models.CASCADE,
        related_name='meet_greet_schedules'
    )
    
    # Scheduling Details
    scheduled_datetime = models.DateTimeField(help_text="Date and time of meet & greet")
    duration_minutes = models.IntegerField(default=60, help_text="Expected duration in minutes")
    
    # Location can be detailed or simple text
    location_type = models.CharField(
        max_length=20,
        choices=[
            ('owner_home', 'Pet Owner\'s Home'),
            ('public_place', 'Public Place'),
            ('adopter_home', 'Adopter\'s Home'),
            ('other', 'Other'),
        ],
        default='public_place'
    )
    location_details = models.TextField(
        help_text="Detailed address or location description"
    )
    
    # Status and Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Confirmation tracking
    confirmed_by_owner = models.BooleanField(default=False)
    confirmed_by_adopter = models.BooleanField(default=False)
    
    # Completion tracking
    completed_at = models.DateTimeField(null=True, blank=True)
    outcome = models.CharField(
        max_length=20,
        blank=True,
        choices=[
            ('success', 'Successful - Proceed to Next Step'),
            ('concerns', 'Some Concerns - Needs Discussion'),
            ('not_a_match', 'Not a Good Match'),
        ]
    )
    
    # Notes
    owner_notes = models.TextField(
        blank=True,
        help_text="Pet owner's notes from the meeting"
    )
    adopter_notes = models.TextField(
        blank=True,
        help_text="Adopter's notes from the meeting"
    )
    
    # Reminders sent
    reminder_sent_to_owner = models.DateTimeField(null=True, blank=True)
    reminder_sent_to_adopter = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Meet & Greet Schedule"
        verbose_name_plural = "Meet & Greet Schedules"
        ordering = ['scheduled_datetime']
    
    def __str__(self):
        return f"Meet & Greet for Application #{self.application.id} on {self.scheduled_datetime}"
    
    @property
    def is_confirmed(self):
        """Check if both parties have confirmed"""
        return self.confirmed_by_owner and self.confirmed_by_adopter
    
    def mark_completed(self, outcome, owner_notes='', adopter_notes=''):
        """Mark the meet & greet as completed"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.outcome = outcome
        if owner_notes:
            self.owner_notes = owner_notes
        if adopter_notes:
            self.adopter_notes = adopter_notes
        self.save()


class HomeCheck(models.Model):
    """
    Track home check visits as part of the adoption approval process.
    Can be performed by admin, volunteer, or the pet owner themselves.
    """
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('passed', 'Passed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    )
    
    application = models.ForeignKey(
        AdoptionApplication,
        on_delete=models.CASCADE,
        related_name='home_checks'
    )
    
    # Scheduling
    scheduled_datetime = models.DateTimeField(help_text="Scheduled date and time for home check")
    
    # Who performs the check
    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='home_checks_performed',
        help_text="Admin, volunteer, or pet owner performing the check"
    )
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Checklist Results (JSON structure)
    # {
    #   "home_safety": {"secure_fencing": bool, "hazards_removed": bool, ...},
    #   "living_space": {"adequate_space": bool, "clean_environment": bool, ...},
    #   "pet_supplies": {"food_bowls": bool, "bed": bool, "toys": bool, ...},
    #   "family_interaction": {"all_members_met": bool, "enthusiasm_level": int, ...}
    # }
    checklist_results = models.JSONField(
        default=dict,
        blank=True,
        help_text="Structured results from home check criteria"
    )
    
    # Overall Assessment
    overall_score = models.IntegerField(
        null=True,
        blank=True,
        help_text="Overall score 0-100"
    )
    passed = models.BooleanField(
        null=True,
        blank=True,
        help_text="Did the home check pass?"
    )
    
    # Notes and Photos
    notes = models.TextField(blank=True, help_text="Detailed notes from the visit")
    photos = models.JSONField(
        default=list,
        blank=True,
        help_text="Optional photos from the visit (URLs)"
    )
    
    # Recommendations
    recommendations = models.TextField(
        blank=True,
        help_text="Recommendations for improvements or next steps"
    )
    
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Home Check"
        verbose_name_plural = "Home Checks"
        ordering = ['-scheduled_datetime']
    
    def __str__(self):
        return f"Home Check for Application #{self.application.id} - {self.get_status_display()}"
    
    def calculate_score(self):
        """Calculate overall score from checklist results"""
        if not self.checklist_results:
            return 0
        
        total_items = 0
        passed_items = 0
        
        for category, items in self.checklist_results.items():
            if isinstance(items, dict):
                for key, value in items.items():
                    total_items += 1
                    if value is True:
                        passed_items += 1
        
        if total_items == 0:
            return 0
        
        score = int((passed_items / total_items) * 100)
        self.overall_score = score
        self.save()
        return score
    
    def mark_completed(self, passed, notes=''):
        """Mark the home check as completed"""
        self.status = 'passed' if passed else 'failed'
        self.passed = passed
        self.completed_at = timezone.now()
        if notes:
            self.notes = notes
        self.save()


class VisitNote(models.Model):
    """
    General notes from any type of visit during the adoption process.
    Provides a timeline of all interactions.
    """
    VISIT_TYPES = (
        ('meet_greet', 'Meet & Greet'),
        ('home_check', 'Home Check'),
        ('follow_up', 'Follow-up Visit'),
        ('trial_period', 'Trial Period Check-in'),
        ('final_handoff', 'Final Pet Handoff'),
        ('other', 'Other'),
    )
    
    application = models.ForeignKey(
        AdoptionApplication,
        on_delete=models.CASCADE,
        related_name='visit_notes'
    )
    
    visit_type = models.CharField(max_length=20, choices=VISIT_TYPES)
    visit_date = models.DateTimeField(default=timezone.now)
    
    note = models.TextField(help_text="Detailed notes from the visit")
    
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='visit_notes_created'
    )
    
    # Optional attachments
    attachments = models.JSONField(
        default=list,
        blank=True,
        help_text="URLs to any attached documents or photos"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Visit Note"
        verbose_name_plural = "Visit Notes"
        ordering = ['-visit_date']
    
    def __str__(self):
        return f"{self.get_visit_type_display()} note for Application #{self.application.id}"
