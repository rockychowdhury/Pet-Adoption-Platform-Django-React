from django.db import models
from django.contrib.auth import get_user_model
from apps.pets.models import Pet

User = get_user_model()

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post by {self.user.email} at {self.created_at}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.email} on Post {self.post.id}"

class Reaction(models.Model):
    REACTION_CHOICES = (
        ('like', 'Like'),
        ('love', 'Love'),
        ('care', 'Care'),
        ('wow', 'Wow'),
        ('sad', 'Sad'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reactions')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=10, choices=REACTION_CHOICES)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.email} reacted {self.reaction_type} to Post {self.post.id}"

class Event(models.Model):
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    image = models.URLField(blank=True, null=True)
    attendees = models.ManyToManyField(User, related_name='attending_events', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
