from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class Group(models.Model):
    """
    Community groups for PetCircle users.
    """
    GROUP_TYPE_CHOICES = (
        ('public', 'Public'),
        ('private', 'Private'),
        ('official', 'Official'),
    )
    
    CATEGORY_CHOICES = (
        ('species', 'Species Specific'),
        ('location', 'Location Based'),
        ('interest', 'Interest Based'),
        ('support', 'Support'),
        ('other', 'Other'),
    )

    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(max_length=1000)
    group_type = models.CharField(max_length=20, choices=GROUP_TYPE_CHOICES, default='public')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, null=True, blank=True)
    
    cover_photo = models.ImageField(upload_to='groups/covers/', blank=True, null=True)
    cover_photo_url = models.URLField(blank=True, null=True)
    
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='administered_groups')
    members = models.ManyToManyField(User, through='GroupMembership', related_name='joined_groups')
    moderators = models.ManyToManyField(User, related_name='moderated_groups', blank=True)
    
    location_city = models.CharField(max_length=100, blank=True, null=True)
    location_state = models.CharField(max_length=50, blank=True, null=True)
    
    rules = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    
    # Cached counts
    member_count = models.IntegerField(default=0)
    post_count = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['group_type']),
            models.Index(fields=['category']),
            models.Index(fields=['location_city', 'location_state']),
        ]

    def __str__(self):
        return self.name


class GroupMembership(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
        ('member', 'Member'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('pending', 'Pending Approval'),
        ('banned', 'Banned'),
    )

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('group', 'user')


class Post(models.Model):
    """
    Social feed posts.
    """
    POST_TYPE_CHOICES = (
        ('standard', 'Standard'),
        ('question', 'Question'),
        ('story', 'Story'),
        ('poll', 'Poll'),
        ('event', 'Event'),
        ('lost_pet', 'Lost Pet'),
        ('success_story', 'Success Story'),
    )
    
    PRIVACY_CHOICES = (
        ('public', 'Public'),
        ('friends', 'Friends Only'),
        ('group_only', 'Group Members Only'),
        ('private', 'Private'),
    )

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=5000)
    post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, default='standard')
    
    media_urls = models.JSONField(default=list, blank=True)
    
    location = models.CharField(max_length=200, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    privacy_level = models.CharField(max_length=20, choices=PRIVACY_CHOICES, default='public')
    
    tagged_pets = models.ManyToManyField('pets.PetProfile', blank=True, related_name='tagged_in_posts')
    tagged_users = models.ManyToManyField(User, blank=True, related_name='tagged_in_posts')
    
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    
    is_pinned = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    view_count = models.IntegerField(default=0)
    share_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post_type']),
            models.Index(fields=['group']),
            models.Index(fields=['privacy_level']),
        ]

    def __str__(self):
        return f"{self.author.email}: {self.content[:30]}..."


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=2000)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    media_url = models.URLField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']


class Reaction(models.Model):
    REACTION_TYPES = (
        ('like', 'Like'),
        ('love', 'Love'),
        ('care', 'Care'),
        ('wow', 'Wow'),
        ('sad', 'Sad'),
        ('funny', 'Funny'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=20, choices=REACTION_TYPES)
    
    # Generic relation to support reacting to Post or Comment
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')


class Event(models.Model):
    EVENT_TYPES = (
        ('playdate', 'Playdate'),
        ('meetup', 'Meetup'),
        ('charity', 'Charity'),
        ('training', 'Training'),
        ('other', 'Other'),
    )

    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=2000)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    
    location_name = models.CharField(max_length=200, blank=True, null=True)
    location_address = models.CharField(max_length=300, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    
    max_attendees = models.IntegerField(null=True, blank=True)
    
    cover_photo = models.ImageField(upload_to='events/covers/', blank=True, null=True)
    cover_photo_url = models.URLField(blank=True, null=True)
    
    attendees = models.ManyToManyField(User, through='EventRSVP', related_name='attending_events')
    rsvp_count = models.IntegerField(default=0)
    is_cancelled = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['start_time']),
            models.Index(fields=['event_type']),
        ]

    def __str__(self):
        return self.title


class EventRSVP(models.Model):
    RSVP_CHOICES = (
        ('going', 'Going'),
        ('maybe', 'Maybe'),
        ('not_going', 'Not Going'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=RSVP_CHOICES, default='going')
    num_guests = models.IntegerField(default=0)
    rsvp_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('event', 'user')


class Poll(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='poll_content')
    question = models.CharField(max_length=300)
    duration_days = models.IntegerField(default=7)
    expires_at = models.DateTimeField()
    is_closed = models.BooleanField(default=False)
    total_votes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class PollOption(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=200)
    vote_count = models.IntegerField(default=0)
    order = models.IntegerField(default=0)


class PollVote(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='votes')
    option = models.ForeignKey(PollOption, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('poll', 'user')
