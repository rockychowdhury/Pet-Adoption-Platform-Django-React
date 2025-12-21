from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Group, Post, Comment, Event

@admin.register(Group)
class GroupAdmin(ModelAdmin):
    list_display = ('name', 'group_type', 'member_count', 'created_at')
    search_fields = ('name',)

@admin.register(Post)
class PostAdmin(ModelAdmin):
    list_display = ('author', 'short_content', 'privacy_level', 'created_at')
    list_filter = ('privacy_level', 'post_type')
    
    def short_content(self, obj):
        return obj.content[:50]

@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    list_display = ('author', 'post', 'created_at')

@admin.register(Event)
class EventAdmin(ModelAdmin):
    list_display = ('title', 'organizer', 'start_time', 'location_name')
