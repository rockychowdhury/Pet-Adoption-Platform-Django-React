from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    ServiceCategory, Species, Specialization, ServiceOption,
    ServiceProvider, ServiceMedia, BusinessHours,
    FosterService, VeterinaryClinic, TrainerService,
    ServiceBooking, ServiceReview
)

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(ModelAdmin):
    list_display = ('name', 'slug', 'icon_name')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Species)
class SpeciesAdmin(ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Specialization)
class SpecializationAdmin(ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)

@admin.register(ServiceOption)
class ServiceOptionAdmin(ModelAdmin):
    list_display = ('name', 'category', 'base_price')
    list_filter = ('category',)

@admin.register(ServiceProvider)
class ServiceProviderAdmin(ModelAdmin):
    list_display = ('user', 'business_name', 'category', 'verification_status')
    list_filter = ('category', 'verification_status')

@admin.register(FosterService)
class FosterServiceAdmin(ModelAdmin):
    list_display = ('provider', 'capacity', 'current_count')

@admin.register(ServiceBooking)
class ServiceBookingAdmin(ModelAdmin):
    list_display = ('provider', 'client', 'pet', 'status', 'start_date')
    list_filter = ('status', 'booking_type')

@admin.register(ServiceMedia)
class ServiceMediaAdmin(ModelAdmin):
    list_display = ('provider', 'is_primary', 'created_at')

@admin.register(BusinessHours)
class BusinessHoursAdmin(ModelAdmin):
    list_display = ('provider', 'day', 'open_time', 'close_time', 'is_closed')
    list_filter = ('day', 'is_closed')

@admin.register(VeterinaryClinic)
class VeterinaryClinicAdmin(ModelAdmin):
    list_display = ('provider', 'clinic_type')

@admin.register(TrainerService)
class TrainerServiceAdmin(ModelAdmin):
    list_display = ('provider', 'primary_method', 'years_experience')

@admin.register(ServiceReview)
class ServiceReviewAdmin(ModelAdmin):
    list_display = ('provider', 'reviewer', 'rating_overall', 'created_at')
