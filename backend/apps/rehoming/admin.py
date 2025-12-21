from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    RehomingIntervention, RehomingListing, AdoptionApplication, 
    AdoptionContract, AdoptionPayment, PostAdoptionCheckIn, AdoptionReview
)

@admin.register(RehomingIntervention)
class RehomingInterventionAdmin(ModelAdmin):
    list_display = ('user', 'reason_category', 'urgency_level', 'created_at')

@admin.register(RehomingListing)
class RehomingListingAdmin(ModelAdmin):
    list_display = ('pet_name', 'species', 'pet_owner', 'status', 'published_at')
    list_filter = ('status', 'species')

@admin.register(AdoptionApplication)
class AdoptionApplicationAdmin(ModelAdmin):
    list_display = ('applicant', 'listing', 'status', 'match_score', 'created_at')
    list_filter = ('status',)

@admin.register(AdoptionContract)
class AdoptionContractAdmin(ModelAdmin):
    list_display = ('application', 'is_fully_signed', 'created_at')

@admin.register(AdoptionPayment)
class AdoptionPaymentAdmin(ModelAdmin):
    list_display = ('application', 'adoption_fee', 'payment_status', 'created_at')

@admin.register(PostAdoptionCheckIn)
class PostAdoptionCheckInAdmin(ModelAdmin):
    list_display = ('application', 'check_in_day', 'completed_at')

@admin.register(AdoptionReview)
class AdoptionReviewAdmin(ModelAdmin):
    list_display = ('application', 'reviewer', 'rating_overall', 'created_at')
