import random
import string
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction

from apps.pets.models import PetProfile

from apps.rehoming.models import (
    RehomingListing, AdoptionInquiry,
    RehomingRequest
)
from apps.messaging.models import Conversation, Message
from apps.services.models import ServiceProvider, FosterService, VeterinaryClinic, TrainerService, ServiceReview
from apps.admin_panel.models import UserReport, ModerationAction
from apps.analytics.models import PlatformAnalytics
from apps.notifications.models import Notification

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with realistic dummy data for development'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=4,  # Default to 4 as requested
            help='Number of regular users to create'
        )
        parser.add_argument(
            '--listings',
            type=int,
            default=20,
            help='Number of rehoming listings to create (default: 20)'
        )
        parser.add_argument(
            '--applications',
            type=int,
            default=20,
            help='Number of adoption applications to create (default: 20)'
        )
        parser.add_argument(
            '--services',
            type=int,
            default=40,
            help='Number of services to create'
        )
        parser.add_argument(
            '--flush',
            action='store_true',
            help='Delete existing data before seeding'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting database seeding...'))
        
        if options['flush']:
            self.stdout.write(self.style.WARNING('Flushing existing data...'))
            self.flush_data()
        
        with transaction.atomic():
            # Create Admins (2)
            self.create_admins()
            self.stdout.write(self.style.SUCCESS('Created 2 admins'))

            # Create Users (4 total: 2 specific, 2 random)
            users = self.create_specific_users()
            self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))
            
            # Create pet profiles (50 total, distributed among 4 users)
            pet_profiles = self.create_pet_profiles(users, 50)
            self.stdout.write(self.style.SUCCESS(f'Created {len(pet_profiles)} pet profiles'))
            
            # Create rehoming listings (20)
            listings = self.create_rehoming_listings(users, pet_profiles, options['listings'])
            self.stdout.write(self.style.SUCCESS(f'Created {len(listings)} rehoming listings'))
            
            # Create service providers (40)
            providers = self.create_service_providers(options['services'])
            self.stdout.write(self.style.SUCCESS(f'Created {len(providers)} service providers'))
            
            # Create adoption applications (20)
            applications = self.create_adoption_applications(users, listings, options['applications'])
            self.stdout.write(self.style.SUCCESS(f'Created {len(applications)} adoption applications'))
            
            # Create messages & reviews (supplementary data)
            self.create_messages(applications)
            # self.create_reviews(applications, providers) # Optional, can enable if needed
        
        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))

    def flush_data(self):
        """Delete all data except superusers (if any, though flush deletes all usually)"""
        # For a clean sheet, we can just delete everything.
        # If using 'flush' command manually it clears everything including migrations sometimes if careful,
        # but here we just delete rows.
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Flushed existing data'))

    def create_admins(self):
        admins = [
            ('admin1@petcircle.com', 'admin1', 'password123'),
            ('admin2@petcircle.com', 'admin2', 'password123')
        ]
        for email, username, password in admins:
            if not User.objects.filter(email=email).exists():
                User.objects.create_superuser(
                    email=email,
                    username=username,
                    password=password,
                    first_name='Admin',
                    last_name='User',
                    role=User.UserRole.ADMIN,
                    email_verified=True,
                    phone_verified=True
                )

    def create_specific_users(self):
        """Create 4 users: 2 specific, 2 random"""
        users = []
        common_password = 'shahin567'
        
        # Specific Users
        specific_users = [
            ('rocky20809@gmail.com', 'rocky_c'),
            ('rockychowdhury055@gmail.com', 'rocky_055')
        ]
        
        for email, username in specific_users:
            user = User.objects.create_user(
                email=email,
                username=username,
                password=common_password,
                first_name='Rocky',
                last_name='Chowdhury',
                phone_number=self.random_phone(),
                role=User.UserRole.USER,
                location_city='New York',
                location_state='NY',
                zip_code='10001',
                email_verified=True,
                phone_verified=True,
                is_active=True
            )
            users.append(user)
            
        # Random Users
        for i in range(2):
            user = User.objects.create_user(
                email=f'user{i+1}@example.com',
                username=f'random_user_{i+1}',
                password=common_password,
                first_name=self.random_name(),
                last_name=self.random_lastname(),
                phone_number=self.random_phone(),
                role=User.UserRole.USER,
                location_city=random.choice(['Los Angeles', 'Chicago', 'Houston']),
                location_state=random.choice(['CA', 'IL', 'TX']),
                zip_code='90001',
                email_verified=True,
                phone_verified=True,
                is_active=True
            )
            users.append(user)
            
        return users

    def create_pet_profiles(self, users, total_count):
        """Create 50 pet profiles distributed among the 4 users"""
        profiles = []
        species_options = ['dog', 'cat', 'rabbit', 'bird']
        
        from apps.pets.models import PetMedia
        
        for i in range(total_count):
            owner = users[i % len(users)]  # Distribute evenly
            species = random.choice(species_options)
            
            # Approximate birth date from random age
            age = random.randint(1, 15)
            birth_date = timezone.now().date() - timedelta(days=age*365)
            
            profile = PetProfile.objects.create(
                owner=owner,
                name=self.random_pet_name(),
                species=species,
                breed=self.random_breed(species),
                birth_date=birth_date,
                gender=random.choice(['male', 'female']),
                description=self.random_pet_description(),
                status='active'
            )
            
            # Create Media
            PetMedia.objects.create(
                pet=profile,
                url=self.get_random_image(species),
                is_primary=True
            )
            
            profiles.append(profile)
        
        return profiles

    def create_rehoming_listings(self, users, pet_profiles, count):
        """Create 20 rehoming listings with associated requests"""
        listings = []
        # Use first 20 profiles for listings, or random ones if count > profiles (unlikely here)
        listing_pets = pet_profiles[:count]
        
        for pet in listing_pets:
            # 1. Create Confirmed Request
            req = RehomingRequest.objects.create(
                pet=pet,
                owner=pet.owner,
                reason=self.random_rehoming_story(),
                urgency='immediate',
                location_city=pet.owner.location_city,
                location_state=pet.owner.location_state,
                status='confirmed',
                terms_accepted=True,
                confirmed_at=timezone.now()
            )
            
            # 2. Create Listing linked to request
            listing = RehomingListing.objects.create(
                request=req,
                pet=pet,
                owner=pet.owner,
                reason=req.reason,
                urgency=req.urgency,
                location_city=req.location_city,
                location_state=req.location_state,
                location_zip=pet.owner.zip_code,
                status='active',
                published_at=timezone.now()
            )
            listings.append(listing)
            
        return listings

    def create_service_providers(self, count):
        """Create 40 service providers"""
        providers = []
        # Create users for providers first (separate from the 4 main users)
        for i in range(count):
            user = User.objects.create_user(
                email=f'provider{i+100}@service.com',
                username=f'provider_user_{i}',
                password='password123',
                first_name=self.random_name(),
                last_name=self.random_lastname(),
                role=User.UserRole.SERVICE_PROVIDER,
                location_city='New York', 
                location_state='NY',
                email_verified=True,
                phone_verified=True
            )

            
            provider_type = random.choice(['vet', 'foster', 'trainer', 'groomer'])
            provider = ServiceProvider.objects.create(
                user=user,
                business_name=f"{user.last_name} {provider_type.title()} Services",
                provider_type=provider_type,
                description=f"Top rated {provider_type} services in the city.",
                address_line1=f"{random.randint(1, 999)} Service Rd",
                city="New York",
                state="NY",
                zip_code="10001",
                phone=self.random_phone(),
                email=user.email,
                verification_status='verified',
                photos=[self.get_random_image('service')]
            )
            providers.append(provider)
            
            # Create specific service details
            if provider_type == 'vet':
                VeterinaryClinic.objects.create(
                    provider=provider,
                    clinic_type='general',
                    services_offered=['Vaccination', 'Checkup', 'Surgery'],
                    species_treated=['dogs', 'cats'],
                    pricing_info="Affordable rates",
                    photos=[self.get_random_image('vet')]
                )
            elif provider_type == 'foster':
                FosterService.objects.create(
                    provider=provider,
                    capacity=5,
                    species_accepted=['dogs'],
                    daily_rate=Decimal('30.00'),
                    monthly_rate=Decimal('800.00'),
                    photos=[self.get_random_image('room')]
                )
            elif provider_type == 'trainer':
                TrainerService.objects.create(
                    provider=provider,
                    specializations=['Obedience'],
                    training_philosophy="Positive reinforcement",
                    private_session_rate=Decimal('100.00'),
                    photos=[self.get_random_image('dog')]
                )
        
        return providers

    def create_adoption_applications(self, users, listings, count):
        """Create 20 adoption inquiries"""
        inquiries = []
        
        for i in range(count):
            applicant = users[i % len(users)]
            listing = listings[i % len(listings)]
            
            # Ensure applicant is not owner
            if applicant == listing.owner:
                 applicant = users[(i + 1) % len(users)]

            # Check for existing
            if not AdoptionInquiry.objects.filter(listing=listing, requester=applicant).exists():
                inquiry = AdoptionInquiry.objects.create(
                    requester=applicant,
                    listing=listing,
                    message="I would love to adopt this pet!",
                    status='pending'
                )
                inquiries.append(inquiry)
            
        return inquiries

    def create_messages(self, inquiries):
        """Create a few messages for the inquiries"""
        for inquiry in inquiries:
            convo = Conversation.objects.create(conversation_type='direct')
            convo.participants.add(inquiry.requester, inquiry.listing.owner)
            Message.objects.create(
                conversation=convo,
                sender=inquiry.requester,
                content=f"Hi, is {inquiry.listing.pet.name} still available?"
            )

    # Helpers
    def random_name(self):
        return random.choice(['John', 'Alice', 'Bob', 'Sarah', 'Mike', 'Emma'])
    
    def random_lastname(self):
        return random.choice(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])

    def random_phone(self):
        return f"+1{random.randint(1000000000, 9999999999)}"

    def random_pet_name(self):
        return random.choice(['Bella', 'Max', 'Luna', 'Charlie', 'Lucy', 'Cooper', 'Bailey'])

    def random_breed(self, species):
        if species == 'dog': return random.choice(['Labrador', 'Poodle', 'Bulldog'])
        if species == 'cat': return random.choice(['Persian', 'Siamese', 'Maine Coon'])
        return 'Mixed'

    def random_pet_description(self):
        return "A very cute and friendly pet looking for a home."

    def random_rehoming_story(self):
        return "We are moving and sadly cannot take our pet with us."

    def get_random_image(self, category):
        """Return a real Unsplash image URL based on category"""
        base_url = "https://images.unsplash.com/photo-"
        
        images = {
            'dog': [
                "1543466835-00a7907e9de1", "1583511655857-d19b40a7a54e", 
                "1596495578065-6e0763fa1178", "1517849845537-4d257902454a"
            ],
            'cat': [
                "1514888286974-6c03e2ca1dba", "1573865526739-10659fec78a5",
                "1495360019602-9ed7457513aa", "1533738363-b7f9aef128ce"
            ],
            'bird': ["1522858547137-f635581105e4", "1480044965905-83275966eb9b"],
            'rabbit': ["1591561582965-79d860183dba", "1564858888-c71b672804b0"],
            'vet': ["1623366302587-b38b1d489114", "1606425247357-194605e52c7c"],
            'service': ["1516734212186-a967f81ad0d7"],
            'room': ["1513694203232-719a280e022f"]
        }
        
        # Fallback for 'other' or unknown
        key = category if category in images else 'dog' 
        image_id = random.choice(images[key])
        
        return f"{base_url}{image_id}?auto=format&fit=crop&w=600&q=80"
