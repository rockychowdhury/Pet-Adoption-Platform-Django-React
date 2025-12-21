from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import PlatformAnalytics

@admin.register(PlatformAnalytics)
class PlatformAnalyticsAdmin(ModelAdmin):
    list_display = ('date', 'total_users', 'total_listings_active', 'adoptions_finalized')
