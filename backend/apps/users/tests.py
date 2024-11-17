from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserModelTests(TestCase):

    def test_create_user_with_valid_data(self):
        """Test creating a user with valid data."""
        user = User.objects.create_user(
            email="testuser@example.com",
            password="testpassword",
            first_name="Test",
            last_name="User",
            role="guest"
        )
        self.assertEqual(user.email, "testuser@example.com")
        self.assertTrue(user.check_password("testpassword"))
        self.assertEqual(user.role, "guest")

    def test_create_user_without_email(self):
        """Test creating a user without an email raises an error."""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email=None,
                password="testpassword",
                first_name="Test",
                last_name="User",
                role="guest"
            )

    def test_create_user_with_invalid_role(self):
        """Test creating a user with an invalid role raises an error."""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email="invalidrole@example.com",
                password="testpassword",
                role="invalid_role"
            )

    def test_create_superuser(self):
        """Test creating a superuser."""
        admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpassword"
        )
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertEqual(admin_user.role, "admin")

    def test_create_superuser_invalid_permissions(self):
        """Test that a superuser must have is_staff and is_superuser set to True."""
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="admin@example.com",
                password="adminpassword",
                is_staff=False
            )

    def test_user_string_representation(self):
        """Test the string representation of the user."""
        user = User.objects.create_user(
            email="testuser@example.com",
            password="testpassword",
            role="guest"
        )
        self.assertEqual(str(user), f"{user.email} ({user.role})")

    def test_email_uniqueness(self):
        """Test that duplicate emails are not allowed."""
        User.objects.create_user(
            email="unique@example.com",
            password="testpassword",
            role="guest"
        )
        with self.assertRaises(Exception):
            User.objects.create_user(
                email="unique@example.com",
                password="testpassword",
                role="guest"
            )
