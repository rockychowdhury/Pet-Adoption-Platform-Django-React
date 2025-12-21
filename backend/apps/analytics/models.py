from django.db import models

class PlatformAnalytics(models.Model):
    """
    Daily aggregated platform metrics.
    """
    date = models.DateField(unique=True)
    
    total_users = models.IntegerField(default=0)
    new_users = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    
    total_posts = models.IntegerField(default=0)
    total_comments = models.IntegerField(default=0)
    total_messages = models.IntegerField(default=0)
    
    total_listings_active = models.IntegerField(default=0)
    new_listings = models.IntegerField(default=0)
    total_applications = models.IntegerField(default=0)
    adoptions_finalized = models.IntegerField(default=0)
    
    service_bookings = models.IntegerField(default=0)
    revenue_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Platform Analytics"
        ordering = ['-date']
        indexes = [
            models.Index(fields=['-date']),
        ]

    def __str__(self):
        return f"Analytics for {self.date}"
