from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from .models import User, RoleRequest, UserTrustReview

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = ("email", "first_name", "last_name", "role", "email_verified", "verified_identity", "is_staff")
    list_filter = ("role", "email_verified", "verified_identity", "is_staff", "is_active")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
    readonly_fields = ["date_joined", "last_login"]

@admin.register(RoleRequest)
class RoleRequestAdmin(ModelAdmin):
    list_display = ("user", "requested_role", "status", "created_at")
    list_filter = ("status", "requested_role")
    search_fields = ("user__email",)

@admin.register(UserTrustReview)
class UserTrustReviewAdmin(ModelAdmin):
    list_display = ("reviewer", "reviewee", "rating", "created_at")
    search_fields = ("reviewer__email", "reviewee__email")