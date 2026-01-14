from django.core.management.base import BaseCommand
from apps.users.models import User

class Command(BaseCommand):
    help = 'Deletes all users and creates 2 admin accounts.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting user reset...")

        # 1. Delete All Users
        self.stdout.write("Deleting all users...")
        count, _ = User.objects.all().delete()
        self.stdout.write(f"Deleted {count} users.")

        # 2. Create Admin 1
        self.stdout.write("Creating Admin 1...")
        User.objects.create_superuser(
            email='admin@example.com',
            password='password123',
            first_name='System',
            last_name='Admin'
        )
        self.stdout.write(self.style.SUCCESS("Created Admin 1 (admin@example.com / password123)"))

        # 3. Create Admin 2
        self.stdout.write("Creating Admin 2...")
        User.objects.create_superuser(
            email='admin2@example.com',
            password='password123',
            first_name='Backup',
            last_name='Admin'
        )
        self.stdout.write(self.style.SUCCESS("Created Admin 2 (admin2@example.com / password123)"))
        
        self.stdout.write(self.style.SUCCESS("User reset and admin creation complete."))
