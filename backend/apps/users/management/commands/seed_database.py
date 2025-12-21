import random
import string
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction

from apps.pets.models import PetProfile
from apps.users.models import UserProfile, VerificationDocument, AdopterProfile
from apps.rehoming.models import (
    RehomingListing, AdoptionApplication, AdoptionContract, 
    RehomingIntervention, AdoptionReview
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
            default=50,
            help='Number of users to create (default: 50)'
        )
        parser.add_argument(
            '--listings',
            type=int,
            default=50,
            help='Number of rehoming listings to create (default: 50)'
        )
        parser.add_argument(
            '--applications',
            type=int,
            default=30,
            help='Number of adoption applications to create (default: 30)'
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
            # Create users
            users = self.create_users(options['users'])
            self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))
            
            # Create pet profiles
            pet_profiles = self.create_pet_profiles(users)
            self.stdout.write(self.style.SUCCESS(f'Created {len(pet_profiles)} pet profiles'))
            
            # Create rehoming listings
            listings = self.create_rehoming_listings(users, pet_profiles, options['listings'])
            self.stdout.write(self.style.SUCCESS(f'Created {len(listings)} rehoming listings'))
            
            # Create service providers
            providers = self.create_service_providers(users)
            self.stdout.write(self.style.SUCCESS(f'Created {len(providers)} service providers'))
            
            # Create adopter profiles and applications
            applications = self.create_adoption_applications(users, listings, options['applications'])
            self.stdout.write(self.style.SUCCESS(f'Created {len(applications)} adoption applications'))
            
            # Create messages
            messages = self.create_messages(applications)
            self.stdout.write(self.style.SUCCESS(f'Created {len(messages)} messages'))
            
            # Create reviews
            reviews = self.create_reviews(applications, providers)
            self.stdout.write(self.style.SUCCESS(f'Created {len(reviews)} reviews'))
            
            # Create reports
            reports = self.create_reports(users, listings)
            self.stdout.write(self.style.SUCCESS(f'Created {len(reports)} reports'))
        
        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))

    def flush_data(self):
        """Delete all data except superusers"""
        User.objects.filter(is_superuser=False).delete()
        self.stdout.write(self.style.SUCCESS('Flushed existing data'))

    def create_users(self, count):
        """Create diverse set of users"""
        users = []
        cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 
                  'San Antonio', 'San Diego', 'Dallas', 'San Jose']
        states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'CA', 'TX', 'CA']
        
        # Create pet owners (70%)
        pet_owner_count = int(count * 0.7)
        for i in range(pet_owner_count):
            email = f'petowner{i+1}@example.com'
            user = User.objects.create_user(
                email=email,
                password='password123',
                first_name=self.random_name(),
                last_name=self.random_lastname(),
                username=f'petowner{i+1}',
                phone_number=self.random_phone(),
                role=User.UserRole.USER,
                location_city=random.choice(cities),
                location_state=random.choice(states),
                location_country='USA',
                zip_code=self.random_zip(),
                email_verified=random.choice([True, True, True, False]),  # 75% verified
                phone_verified=random.choice([True, True, False]),
                is_active=True
            )
            users.append(user)
            
            # Create user profile
            UserProfile.objects.create(user=user)
        
        # Create adopters (20%)
        adopter_count = int(count * 0.2)
        for i in range(adopter_count):
            email = f'adopter{i+1}@example.com'
            user = User.objects.create_user(
                email=email,
                password='password123',
                first_name=self.random_name(),
                last_name=self.random_lastname(),
                username=f'adopter{i+1}',
                phone_number=self.random_phone(),
                role=User.UserRole.USER,
                location_city=random.choice(cities),
                location_state=random.choice(states),
                zip_code=self.random_zip(),
                email_verified=True,
                phone_verified=True,
                is_active=True
            )
            users.append(user)
            UserProfile.objects.create(user=user)
        
        # Create service providers (6%)
        provider_count = int(count * 0.06)
        for i in range(provider_count):
            email = f'provider{i+1}@example.com'
            user = User.objects.create_user(
                email=email,
                password='password123',
                first_name=self.random_name(),
                last_name=self.random_lastname(),
                username=f'provider{i+1}',
                phone_number=self.random_phone(),
                role=User.UserRole.SERVICE_PROVIDER,
                location_city=random.choice(cities),
                location_state=random.choice(states),
                email_verified=True,
                phone_verified=True,
                is_active=True
            )
            users.append(user)
            UserProfile.objects.create(user=user)
        
        # Create admins (4%)
        admin_count = max(2, int(count * 0.04))
        for i in range(admin_count):
            email = f'admin{i+1}@example.com'
            user = User.objects.create_superuser(
                email=email,
                password='password123',
                first_name='Admin',
                last_name=f'User{i+1}',
                username=f'admin{i+1}',
                role=User.UserRole.ADMIN,
                email_verified=True,
                phone_verified=True,
            )
            users.append(user)
        
        return users

    def create_pet_profiles(self, users):
        """Create pet profiles for pet owners"""
        pet_owners = [u for u in users if u.role == User.UserRole.USER]
        profiles = []
        species_options = ['dog', 'cat', 'rabbit', 'bird', 'other']
        
        for owner in pet_owners:
            # Each owner has 1-3 pets
            num_pets = random.randint(1, 3)
            for _ in range(num_pets):
                profile = PetProfile.objects.create(
                    owner=owner,
                    name=self.random_pet_name(),
                    species=random.choice(species_options),
                    breed=self.random_breed(),
                    age=random.randint(1, 15),
                    gender=random.choice(['male', 'female', 'unknown']),
                    description=self.random_pet_description(),
                    photos=[f'https://placekitten.com/400/300?{random.randint(1,1000)}'],
                    is_active=True
                )
                profiles.append(profile)
        
        return profiles

    def create_rehoming_listings(self, users, pet_profiles, count):
        """Create rehoming listings"""
        pet_owners = [u for u in users if u.role == User.UserRole.USER and u.can_create_listing]
        if not pet_owners:
            return []
        
        listings = []
        statuses = [
            ('active', 0.5),
            ('pending_review', 0.2),
            ('adopted', 0.16),
            ('draft', 0.08),
            ('expired', 0.04),
            ('rejected', 0.02)
        ]
        
        for i in range(min(count, len(pet_owners) * 2)):
            owner = random.choice(pet_owners)
            owner_pets = [p for p in pet_profiles if p.owner == owner]
            pet = random.choice(owner_pets) if owner_pets else None
            
            # Choose status based on weights
            status = random.choices(
                [s[0] for s in statuses],
                weights=[s[1] for s in statuses]
            )[0]
            
            listing = RehomingListing.objects.create(
                pet_owner=owner,
                pet_profile=pet,
                pet_name=pet.name if pet else self.random_pet_name(),
                species=pet.species if pet else random.choice(['dog', 'cat', 'rabbit']),
                breed=pet.breed if pet else self.random_breed(),
                age=random.randint(1, 15),
                gender=random.choice(['male', 'female']),
                weight=Decimal(str(random.uniform(5, 100))),
                size_category=random.choice(['xs', 'small', 'medium', 'large', 'xl']),
                medical_history={
                    'spayed_neutered': random.choice(['yes', 'no', 'scheduled']),
                    'microchipped': random.choice([True, False]),
                    'vaccinations_up_to_date': random.choice(['yes', 'no', 'partial']),
                    'current_medications': [],
                    'medical_conditions': random.sample(['none', 'allergies', 'arthritis'], k=random.randint(1, 2))
                },
                behavioral_profile={
                    'energy_level': random.randint(1, 5),
                    'good_with_children': random.choice(['yes', 'no', 'unknown']),
                    'good_with_dogs': random.choice(['yes', 'no', 'selective']),
                    'good_with_cats': random.choice(['yes', 'no', 'unknown']),
                    'house_trained': random.choice(['yes', 'mostly', 'no']),
                },
                aggression_disclosed=True,
                aggression_details="Some aggression history notes.",
                rehoming_story=self.random_rehoming_story(),
                photos=[f'https://placekitten.com/600/400?{random.randint(1,1000)}' for _ in range(random.randint(5, 10))],
                adoption_fee=Decimal(str(random.choice([0, 50, 100, 150, 200, 250]))),
                included_items=['food', 'bowls', 'toys', 'medical_records'],
                custom_questions=self.random_custom_questions() if random.random() > 0.7 else [],
                urgency_level=random.choice(['immediate', '1_month', '3_months', 'flexible']),
                location_city=owner.location_city,
                location_state=owner.location_state,
                location_zip=owner.zip_code,
                status=status,
                published_at=timezone.now() - timedelta(days=random.randint(1, 60)) if status == 'active' else None
            )
            listings.append(listing)
        
        return listings

    def create_service_providers(self, users):
        """Create service provider profiles"""
        providers_users = [u for u in users if u.role == User.UserRole.SERVICE_PROVIDER]
        providers = []
        
        for i, user in enumerate(providers_users):
            provider_type = random.choice(['foster', 'vet', 'trainer'])
            
            provider = ServiceProvider.objects.create(
                user=user,
                business_name=f"{user.first_name}'s {provider_type.title()} Service",
                provider_type=provider_type,
                description=f"Professional {provider_type} services for your pets.",
                address_line1=f"{random.randint(100, 9999)} Main St",
                city=user.location_city,
                state=user.location_state,
                zip_code=user.zip_code or '10001',
                phone=user.phone_number,
                email=user.email,
                verification_status='verified',
                photos=[f'https://placehold.co/600x400?text=Service{i}']
            )
            providers.append(provider)
            
            # Create specific service details
            if provider_type == 'foster':
                FosterService.objects.create(
                    provider=provider,
                    capacity=random.randint(5, 20),
                    current_count=random.randint(0, 10),
                    species_accepted=['dogs', 'cats'],
                    daily_rate=Decimal(str(random.randint(25, 75))),
                    monthly_rate=Decimal(str(random.randint(500, 1500))),
                    photos=[f'https://placehold.co/600x400?text=Foster{i}']
                )
            elif provider_type == 'vet':
                VeterinaryClinic.objects.create(
                    provider=provider,
                    clinic_type=random.choice(['general', 'emergency', 'specialty']),
                    services_offered=['wellness_exams', 'vaccinations', 'surgery'],
                    species_treated=['dogs', 'cats'],
                    pricing_info="Consultation: $50-100, Vaccinations: $20-40",
                    photos=[f'https://placehold.co/600x400?text=Vet{i}']
                )
            else:  # trainer
                TrainerService.objects.create(
                    provider=provider,
                    specializations=['obedience', 'behavioral_issues'],
                    training_philosophy="Positive reinforcement based training",
                    private_session_rate=Decimal(str(random.randint(50, 150))),
                    photos=[f'https://placehold.co/600x400?text=Trainer{i}']
                )
        
        return providers

    def create_adoption_applications(self, users, listings, count):
        """Create adoption applications with adopter profiles"""
        adopters = [u for u in users if u.role == User.UserRole.USER]
        active_listings = [l for l in listings if l.status == 'active']
        
        if not adopters or not active_listings:
            return []
        
        applications = []
        statuses = ['pending_review', 'info_requested', 'rejected', 'approved_meet_greet', 'adopted']
        
        # Track which adopter-listing pairs we've created to avoid duplicates
        created_pairs = set()
        attempts = 0
        max_attempts = count * 3  # Try up to 3x the requested count
        
        while len(applications) < count and attempts < max_attempts:
            adopter = random.choice(adopters)
            listing = random.choice(active_listings)
            pair = (adopter.id, listing.id)
            
            # Skip if we've already created this pair
            if pair in created_pairs:
                attempts += 1
                continue
            
            created_pairs.add(pair)
            attempts += 1
            
            # Create or get adopter profile
            adopter_profile, _ = AdopterProfile.objects.get_or_create(
                user=adopter,
                defaults={
                    'housing_type': random.choice(['house', 'apartment', 'condo']),
                    'own_or_rent': random.choice(['own', 'rent']),
                    'yard_type': random.choice(['none', 'small_fenced', 'large_fenced']),
                    'num_adults': random.randint(1, 4),
                    'num_children': random.randint(0, 3),
                    'activity_level': random.randint(1, 5),
                    'exercise_commitment': random.randint(1, 3),
                    'travel_frequency': random.choice(['rarely', 'monthly', 'weekly']),
                    'why_adopt': 'I have always loved animals and want to provide a loving home.',
                    'work_schedule': '9-5 weekdays, remote 2 days/week'
                }
            )
            adopter_profile.calculate_readiness_score()
            
            app = AdoptionApplication.objects.create(
                applicant=adopter,
                listing=listing,
                adopter_profile=adopter_profile,
                application_message=self.random_application_message(),
                match_score=adopter_profile.readiness_score,
                status=random.choice(statuses)
            )
            applications.append(app)
        
        return applications
        
        return applications

    def create_messages(self, applications):
        """Create messages between applicants and pet owners"""
        messages = []
        
        for app in applications[:min(len(applications), 50)]:
            # Create conversation
            p1 = app.applicant
            p2 = app.listing.pet_owner
            
            # Find existing or create new
            conversation = Conversation.objects.filter(participants=p1).filter(participants=p2).first()
            if not conversation:
                conversation = Conversation.objects.create(conversation_type='direct')
                conversation.participants.add(p1, p2)

            # Create 3-10 messages per conversation
            num_messages = random.randint(3, 10)
            for i in range(num_messages):
                sender = random.choice([p1, p2])
                msg = Message.objects.create(
                    conversation=conversation,
                    sender=sender,
                    content=self.random_message_text(),
                    # is_read handled via MessageReceipt
                    created_at=timezone.now() - timedelta(days=random.randint(0, 30))
                )
                messages.append(msg)
                
                # Update last message
                conversation.update_last_message(msg)
        
        return messages

    def create_reviews(self, applications, providers):
        """Create adoption and service reviews"""
        reviews = []
        
        # Adoption reviews for adopted applications
        adopted_apps = [a for a in applications if a.status == 'adopted']
        for app in adopted_apps[:min(len(adopted_apps), 30)]:
            # Pet owner reviews adopter
            review = AdoptionReview.objects.create(
                application=app,
                reviewer=app.listing.pet_owner,
                reviewee=app.applicant,
                reviewer_role='pet_owner',
                rating_overall=random.randint(3, 5),
                rating_responsiveness=random.randint(3, 5),
                rating_preparation=random.randint(3, 5),
                review_text="Great adopter, very responsible and caring!",
                would_recommend=True,
                tags=['responsive', 'friendly'],
                # pet_name is not on AdoptionReview model in seed, wait model?
            )
            reviews.append(review)
        
        # Service reviews
        for provider in providers[:min(len(providers), 20)]:
            reviewer = random.choice([u for u in User.objects.all() if u.role == User.UserRole.USER][:10])
            try:
                review = ServiceReview.objects.create(
                    provider=provider,
                    reviewer=reviewer,
                    service_type=provider.provider_type,
                    rating_overall=random.randint(3, 5),
                    rating_communication=random.randint(3, 5),
                    rating_cleanliness=random.randint(3, 5),
                    rating_quality=random.randint(3, 5),
                    rating_value=random.randint(3, 5),
                    review_text="Excellent service, highly recommend!"
                )
                reviews.append(review)
            except:
                pass  # Skip if duplicate
        
        return reviews

    def create_reports(self, users, listings):
        """Create user reports"""
        reports = []
        reporters = random.sample([u for u in users if u.role != User.UserRole.ADMIN], min(10, len(users)))
        
        for reporter in reporters:
            if listings:
                listing = random.choice(listings)
                from django.contrib.contenttypes.models import ContentType
                listing_content_type = ContentType.objects.get_for_model(RehomingListing)
                report = UserReport.objects.create(
                    reporter=reporter,
                    reported_user=listing.pet_owner,
                    reported_content_type=listing_content_type,
                    reported_content_id=listing.id,
                    report_type=random.choice(['spam', 'misrepresentation', 'inappropriate']),
                    description="This listing seems suspicious.",
                    status='pending'
                )
                reports.append(report)
        
        return reports

    # Helper methods for generating random data
    def random_name(self):
        names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria']
        return random.choice(names)
    
    def random_lastname(self):
        lastnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
        return random.choice(lastnames)
    
    def random_phone(self):
        return f'+1{random.randint(2000000000, 9999999999)}'
    
    def random_zip(self):
        return f'{random.randint(10000, 99999)}'
    
    def random_pet_name(self):
        names = ['Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Daisy', 'Rocky', 'Molly', 'Buddy', 'Sadie']
        return random.choice(names)
    
    def random_breed(self):
        breeds = ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Beagle', 'Poodle', 'Mixed Breed']
        return random.choice(breeds)
    
    def random_pet_description(self):
        return "A loving and energetic companion looking for a forever home."
    
    def random_rehoming_story(self):
        stories = [
            "We are moving to a new apartment that doesn't allow pets. Our beloved pet needs a new home where they can continue to thrive.",
            "Due to unexpected allergies in the family, we sadly need to rehome our wonderful companion. They deserve a loving home.",
            "Our work schedule has changed dramatically and we can no longer provide the attention and care this pet deserves."
        ]
        return random.choice(stories)
    
    def random_custom_questions(self):
        questions = [
            {"question": "Do you have experience with this breed?", "required": True},
            {"question": "What is your work schedule like?", "required": True},
            {"question": "Do you have a fenced yard?", "required": False}
        ]
        return random.sample(questions, k=random.randint(1, 3))
    
    def random_application_message(self):
        return "I am very interested in adopting this pet. I have a loving home and plenty of time to care for them. I have experience with pets and am committed to providing the best care possible."
    
    def random_message_text(self):
        messages = [
            "Hi! I'm very interested in your pet. Can we schedule a meet and greet?",
            "Thank you for your application. I'd love to learn more about your experience.",
            "When would be a good time for you to visit and meet the pet?",
            "I have a few questions about the pet's medical history.",
            "The pet sounds wonderful! I'd love to move forward with the adoption process."
        ]
        return random.choice(messages)
