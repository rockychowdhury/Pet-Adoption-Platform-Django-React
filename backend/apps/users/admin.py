from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from .models import User, UserProfile, VerificationDocument, RoleRequest

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = ("email", "first_name", "last_name", "role", "email_verified", "verified_identity", "is_staff")
    list_filter = ("role", "email_verified", "verified_identity", "is_staff", "is_active")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = ("user", "created_at")
    search_fields = ("user__email",)

@admin.register(VerificationDocument)
class VerificationDocumentAdmin(ModelAdmin):
    list_display = ("user", "document_type", "status", "created_at")
    list_filter = ("status", "document_type")
    search_fields = ("user__email",)

@admin.register(RoleRequest)
class RoleRequestAdmin(ModelAdmin):
    list_display = ("user", "requested_role", "status", "created_at")
    list_filter = ("status", "requested_role")
    search_fields = ("user__email",)

from .models import AdopterProfile

@admin.register(AdopterProfile)
class AdopterProfileAdmin(ModelAdmin):
    list_display = ("user", "housing_type", "readiness_score")
    search_fields = ("user__email",)