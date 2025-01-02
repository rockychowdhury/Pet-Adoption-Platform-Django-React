from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from utils.RoleValidity import is_valid_role

class UserManager(BaseUserManager):
    def create_user(self, email, password = None, **kwargs):
        if not email:
            raise ValueError('Email is Required')

        email = self.normalize_email(email)
        user = self.model(email=email,**kwargs)
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_superuser(self,email, password=None, **kwargs):
        kwargs.setdefault('is_staff',True)
        kwargs.setdefault('is_superuser',True)
        if not kwargs.get('is_staff') or not kwargs.get('is_superuser'):
            raise ValueError("Superuser must have is_staff=True and is_superuser=True.")
        user = self.create_user(email=email,password=password,**kwargs)
        user.role = User.UserRole.ADMIN
        user.save()
        return 



class User(AbstractBaseUser, PermissionsMixin):
    class UserRole(models.TextChoices):
        ADMIN                   = 'admin', 'Admin'
        PET_OWNER               = 'pet_owner','Pet Owner'
        ADOPTER                 = 'adopter', 'Adopter'
        GUEST                   = 'guest', 'Guest'

    email                   = models.EmailField(unique=True)
    first_name              = models.CharField(max_length=50)
    last_name               = models.CharField(max_length=50)
    phone_number            = models.CharField(max_length=15, blank=True, null=True)
    profile_picture         = models.URLField(max_length=200, blank=True, null=True)
    bio                     = models.TextField(max_length=200, blank=True, null=True)
    role                    = models.CharField(max_length=10, choices=UserRole.choices, default=UserRole.GUEST)
    
    is_active                   = models.BooleanField(default=True)
    is_staff                    = models.BooleanField(default=False)
    is_superuser                = models.BooleanField(default=False)
    date_joined                 = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD              = 'email'
    REQUIRED_FIELDS             = ['first_name', 'last_name']


    class Meta:
        verbose_name            ='User'
        verbose_name_plural     = 'Users'
    
    def __str__(self) -> str:
        return f"{self.email} ({self.role})"
