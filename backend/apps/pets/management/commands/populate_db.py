import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.pets.models import Pet
from apps.reviews.models import AdoptionReview
from apps.adoption.models import AdoptionApplication, AdopterProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with dummy data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating database...')

        # 1. Create Users
        # Admin
        admin, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
                'email_verified': True,
                'phone_verified': True
            }
        )
        if created:
            admin.set_password('password123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Created Admin user'))

        # Pet Owner
        pet_owner, created = User.objects.get_or_create(
            email='petowner@example.com',
            defaults={
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'role': 'pet_owner',
                'bio': 'Responsible pet owner looking to rehome my beloved pets.',
                'email_verified': True, # Important for listing creation
                'phone_verified': True,
                'location_city': 'New York',
                'location_state': 'NY'
            }
        )
        if created:
            pet_owner.set_password('password123')
            pet_owner.save()
            self.stdout.write(self.style.SUCCESS('Created Pet Owner user'))
        
        # Adopter 1
        adopter1, created = User.objects.get_or_create(
            email='adopter@example.com',
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'adopter',
                'bio': 'Looking for a furry friend.',
                'location_city': 'Brooklyn',
                'location_state': 'NY'
            }
        )
        if created:
            adopter1.set_password('password123')
            adopter1.save()
            # Create Adopter Profile
            AdopterProfile.objects.get_or_create(
                user=adopter1,
                defaults={
                    'housing_type': 'house',
                    'own_or_rent': 'own',
                    'yard_type': 'large',
                    'yard_fenced': True,
                    'num_adults': 2,
                    'pet_experience': {'dogs': 5},
                    'why_adopt': 'We love dogs and have a big yard.',
                    'activity_level': 4,
                    'exercise_commitment_hours': 2.0,
                    'travel_frequency': 'rarely',
                    'work_schedule': '9-5',
                    'readiness_score': 85
                }
            )
            self.stdout.write(self.style.SUCCESS('Created Adopter 1 with Profile'))

        # Adopter 2
        adopter2, created = User.objects.get_or_create(
            email='jane@example.com',
            defaults={
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'adopter',
                'bio': 'Animal lover and volunteer.',
                'location_city': 'Queens',
                'location_state': 'NY'
            }
        )
        if created:
            adopter2.set_password('password123')
            adopter2.save()
            AdopterProfile.objects.get_or_create(
                user=adopter2,
                defaults={
                    'housing_type': 'apartment',
                    'own_or_rent': 'rent',
                    'landlord_approval': True,
                    'yard_type': 'none',
                    'num_adults': 1,
                    'pet_experience': {'cats': 10},
                    'why_adopt': 'Need a companion.',
                    'activity_level': 2,
                    'exercise_commitment_hours': 0.5,
                    'travel_frequency': 'monthly',
                    'work_schedule': 'work from home',
                    'readiness_score': 90
                }
            )
            self.stdout.write(self.style.SUCCESS('Created Adopter 2 with Profile'))

        # 2. Create Pets
        pet_images = [
            "https://i.ibb.co.com/8NJ2xnW/authbg.jpg",
            "https://i.ibb.co.com/5nyNcXB/sergey-semin-v-MNr5gbee-Tk-unsplash.jpg",
            "https://i.ibb.co.com/rvN3Zv4/parttime-portraits-at-Olnt-Wc-O4k-unsplash.jpg",
            "https://i.ibb.co.com/NWG711x/amy-humphries-All-EP6-K-TAg-unsplash.jpg",
            "https://i.ibb.co.com/hskkRk7/alan-king-KZv7w34tlu-A-unsplash.jpg",
            "https://i.ibb.co.com/VpqXszb/charlesdeluvio-p-OUA8-Xay514-unsplash.jpg",
            "https://i.ibb.co.com/LrrW9wW/flouffy-g2-Ftl-Frc164-unsplash.jpg",
            "https://i.ibb.co.com/xCJ1HwK/alvan-nee-ZCHj-2l-JP00-unsplash.jpg",
            "https://i.ibb.co.com/f1bWkvQ/karsten-winegeart-Qb7-D1xw28-Co-unsplash.jpg",
            "https://i.ibb.co.com/vYgNbgh/cat-2536662-1280.jpg",
            "https://i.ibb.co.com/RvkQhmX/cat-551554-1280.jpg",
            "https://i.ibb.co.com/sF4R1cB/ai-generated-8674235-1280.png"
        ]

        names = ['Bella', 'Max', 'Charlie', 'Luna', 'Lucy', 'Cooper', 'Bailey', 'Daisy', 'Sadie', 'Molly', 'Buddy', 'Rocky']
        breeds = ['Golden Retriever', 'Siamese', 'Beagle', 'Husky', 'Persian', 'Labrador', 'Poodle', 'Bulldog', 'Tabby', 'German Shepherd']
        
        created_pets = []
        for i, image_url in enumerate(pet_images):
            name = names[i] if i < len(names) else f"Pet {i+1}"
            species = 'Dog' if 'cat' not in image_url.lower() and 'ai-generated' not in image_url.lower() else 'Cat'
            if i == 1: species = 'Dog' # sergey-semin
            if i == 9 or i == 10: species = 'Cat'

            pet, created = Pet.objects.get_or_create(
                name=name,
                owner=pet_owner,
                defaults={
                    'species': species,
                    'breed': random.choice(breeds),
                    'age': random.randint(2, 60),
                    'gender': random.choice(['male', 'female']),
                    'weight': random.uniform(3.0, 30.0),
                    'description': f"A lovely {species.lower()} looking for a home. Very friendly and playful.",
                    'rehoming_story': f"We are moving to a place that doesn't allow pets. {name} has been our best friend for years.",
                    'adoption_fee': random.choice([0.00, 50.00, 100.00]),
                    'location_city': 'New York',
                    'location_state': 'NY',
                    'medical_profile': {'spayed_neutered': True, 'vaccinations_up_to_date': True},
                    'behavioral_profile': {'good_with_kids': True, 'energy_level': 'medium'},
                    'compatibility': {'kids': True, 'other_pets': True},
                    'photo_url': image_url,
                    'is_vaccinated': random.choice([True, False]),
                    'status': 'published', 
                    'color': random.choice(['Brown', 'Black', 'White', 'Spotted', 'Golden']),
                }
            )
            created_pets.append(pet)
            if created:
                self.stdout.write(f"Created pet: {name}")

        # 3. Create Adoption Applications & Reviews
        if created_pets:
            # App 1: Pending
            app1, created = AdoptionApplication.objects.get_or_create(
                applicant=adopter1,
                pet=created_pets[0],
                defaults={
                    'message': "I have a large backyard and love dogs!",
                    'status': 'pending',
                    'readiness_score': 85
                }
            )
            
            # App 2: Adoption Completed & Reviewed
            app2, created = AdoptionApplication.objects.get_or_create(
                applicant=adopter2,
                pet=created_pets[1],
                defaults={
                    'message': "I've always wanted a Siamese cat.",
                    'status': 'adoption_completed',
                    'readiness_score': 90
                }
            )
            
            # Create Review for App 2
            if created or not app2.reviews.exists():
                AdoptionReview.objects.create(
                    application=app2,
                    reviewer=adopter2,
                    reviewee=pet_owner,
                    reviewer_role='adopter',
                    rating_overall=5,
                    rating_responsiveness=5,
                    rating_preparation=4,
                    rating_honesty=5,
                    rating_communication=5,
                    review_text="Great experience adopting! Smooth process.",
                    would_recommend=True
                )
                self.stdout.write(self.style.SUCCESS('Created Adoption Review'))


        # 4. Service Providers
        # Vet
        vet_user, created = User.objects.get_or_create(
            email='vet@example.com',
            defaults={
                'first_name': 'Dr. Emily',
                'last_name': 'Vet',
                'role': 'service_provider',
                'email_verified': True,
                'phone_verified': True
            }
        )
        if created:
            vet_user.set_password('password123')
            vet_user.save()
            
            from apps.services.models import ServiceProvider, VeterinaryClinic
            provider = ServiceProvider.objects.create(
                user=vet_user,
                business_name="Happy Paws Clinic",
                provider_type="vet",
                description="Full service veterinary clinic.",
                location_city="New York",
                location_state="NY",
                is_verified=True,
                services_offered=['Vaccinations', 'Surgery', 'Checkups']
            )
            VeterinaryClinic.objects.create(
                provider=provider,
                emergency_services=True,
                hours_of_operation={"Mon-Fri": "9-6", "Sat": "10-2"}
            )
            self.stdout.write(self.style.SUCCESS('Created Vet Provider'))

        # Foster
        foster_user, created = User.objects.get_or_create(
            email='foster@example.com',
            defaults={
                'first_name': 'Foster',
                'last_name': 'Mom',
                'role': 'service_provider',
                'email_verified': True,
                'phone_verified': True
            }
        )
        if created:
            foster_user.set_password('password123')
            foster_user.save()
            
            from apps.services.models import ServiceProvider, FosterService
            provider = ServiceProvider.objects.create(
                user=foster_user,
                business_name="Safe Haven Foster",
                provider_type="foster",
                description="Loving home for dogs in transition.",
                location_city="Brooklyn",
                location_state="NY",
                is_verified=True,
                services_offered=['Long-term foster', 'Socialization']
            )
            FosterService.objects.create(
                provider=provider,
                capacity=3,
                accepted_species=['Dog'],
                housing_conditions="Large fenced backyard."
            )
            self.stdout.write(self.style.SUCCESS('Created Foster Provider'))

        self.stdout.write(self.style.SUCCESS('Successfully populated database with PetCarePlus data!'))
