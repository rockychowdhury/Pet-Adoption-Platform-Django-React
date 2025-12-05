from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews', help_text="The shelter or user being reviewed")
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('reviewer', 'target_user')

    def __str__(self):
        return f"Review by {self.reviewer.email} for {self.target_user.email}"
