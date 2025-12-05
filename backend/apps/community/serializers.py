from rest_framework import serializers
from .models import Post, Comment, Reaction, Event
from apps.users.serializers import UserSerializer  # Assuming UserSerializer exists

class ReactionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Reaction
        fields = ['id', 'user', 'reaction_type']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'content', 'created_at']
        read_only_fields = ['user', 'post']

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)
    reaction_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'image', 'created_at', 'updated_at', 'comments', 'reactions', 'reaction_count']
        read_only_fields = ['user']

    def get_reaction_count(self, obj):
        return obj.reactions.count()

class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.StringRelatedField(read_only=True)
    attendees_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'organizer', 'title', 'description', 'location', 'start_time', 'end_time', 'image', 'attendees_count', 'created_at']
        read_only_fields = ['organizer']

    def get_attendees_count(self, obj):
        return obj.attendees.count()
