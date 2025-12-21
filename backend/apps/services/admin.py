from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    ServiceProvider, FosterService, VeterinaryClinic, TrainerService, 
    ServiceReview, ServiceBooking
)

@admin.register(ServiceProvider)
class ServiceProviderAdmin(ModelAdmin):
    list_display = ('user', 'business_name', 'provider_type', 'verification_status')
    list_filter = ('provider_type', 'verification_status')

@admin.register(FosterService)
class FosterServiceAdmin(ModelAdmin):
    list_display = ('provider', 'capacity', 'current_count')

@admin.register(ServiceBooking)
class ServiceBookingAdmin(ModelAdmin):
    list_display = ('provider', 'client', 'pet', 'status', 'start_date')
    list_filter = ('status', 'booking_type')

@admin.register(ServiceReview)
class ServiceReviewAdmin(ModelAdmin):
    list_display = ('provider', 'reviewer', 'rating_overall', 'created_at')
