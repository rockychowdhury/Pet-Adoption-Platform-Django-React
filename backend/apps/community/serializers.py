from rest_framework import serializers
from .models import Group, Post, Comment, Event
from apps.users.serializers import PublicUserSerializer

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'admin', 'slug']

class CommentSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']

class PostSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'author', 'content', 'post_type', 'media_urls', 
            'location', 'privacy_level', 'tagged_pets', 
            'group', 'comments_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 'view_count', 'share_count']

class EventSerializer(serializers.ModelSerializer):
    organizer = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer', 'created_at', 'updated_at', 'rsvp_count']
