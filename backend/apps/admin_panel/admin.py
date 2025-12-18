from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import UserReport, LegalAgreement, PlatformMetrics, ModerationAction

@admin.register(UserReport)
class UserReportAdmin(ModelAdmin):
    list_display = ("id", "report_type", "reporter", "status", "priority", "created_at")
    list_filter = ("status", "priority", "report_type")
    search_fields = ("reporter__email", "description")
    readonly_fields = ("created_at", "resolved_at")

@admin.register(LegalAgreement)
class LegalAgreementAdmin(ModelAdmin):
    list_display = ("id", "application", "agreement_type", "is_fully_signed", "created_at")
    list_filter = ("agreement_type",)
    search_fields = ("application__id",)
    readonly_fields = ("created_at",)

@admin.register(PlatformMetrics)
class PlatformMetricsAdmin(ModelAdmin):
    list_display = ("date", "total_users", "active_listings", "total_adoptions")
    readonly_fields = ("created_at",)

@admin.register(ModerationAction)
class ModerationActionAdmin(ModelAdmin):
    list_display = ("action_type", "moderator", "target_user", "created_at")
    list_filter = ("action_type",)
    search_fields = ("moderator__email", "target_user__email", "reason")
    readonly_fields = ("created_at",)
