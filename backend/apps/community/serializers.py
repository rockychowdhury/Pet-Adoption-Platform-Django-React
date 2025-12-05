from rest_framework import serializers
from .models import Post, Comment, Reaction, Event
from apps.users.serializers import PublicUserSerializer

class ReactionSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)

    class Meta:
        model = Reaction
        fields = ['id', 'user', 'reaction_type']

class CommentSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'content', 'created_at']
        read_only_fields = ['user', 'post']

class PostSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)
    reaction_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'image', 'created_at', 'updated_at', 'comments', 'reactions', 'reaction_count', 'is_liked']
        read_only_fields = ['user']

    def get_reaction_count(self, obj):
        return obj.reactions.count()
    
    def get_is_liked(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return obj.reactions.filter(user=user).exists()
        return False

class EventSerializer(serializers.ModelSerializer):
    organizer = PublicUserSerializer(read_only=True)
    attendees_count = serializers.SerializerMethodField()
    is_attending = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'organizer', 'title', 'description', 'location', 'start_time', 'end_time', 'image', 'attendees_count', 'is_attending', 'created_at']
        read_only_fields = ['organizer']

    def get_attendees_count(self, obj):
        return obj.attendees.count()

    def get_is_attending(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return obj.attendees.filter(id=user.id).exists()
        return False
