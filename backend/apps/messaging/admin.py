from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Conversation, Message, MessageReceipt

@admin.register(Conversation)
class ConversationAdmin(ModelAdmin):
    list_display = ('id', 'conversation_type', 'created_at')

@admin.register(Message)
class MessageAdmin(ModelAdmin):
    list_display = ('sender', 'conversation', 'message_type', 'created_at')
