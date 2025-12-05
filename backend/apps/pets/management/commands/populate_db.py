import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.pets.models import Pet
from apps.community.models import Post, Comment, Reaction, Event
from apps.reviews.models import Review
from apps.adoption.models import AdoptionApplication

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
                'is_superuser': True
            }
        )
        if created:
            admin.set_password('password123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Created Admin user'))

        # Shelter
        shelter, created = User.objects.get_or_create(
            email='shelter@example.com',
            defaults={
                'first_name': 'Happy',
                'last_name': 'Paws',
                'role': 'shelter',
                'bio': 'We are a dedicated shelter finding homes for loving pets.'
            }
        )
        if created:
            shelter.set_password('password123')
            shelter.save()
            self.stdout.write(self.style.SUCCESS('Created Shelter user'))
        
        # Adopter 1
        adopter1, created = User.objects.get_or_create(
            email='adopter@example.com',
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'adopter',
                'bio': 'Looking for a furry friend.'
            }
        )
        if created:
            adopter1.set_password('password123')
            adopter1.save()
            self.stdout.write(self.style.SUCCESS('Created Adopter 1'))

        # Adopter 2
        adopter2, created = User.objects.get_or_create(
            email='jane@example.com',
            defaults={
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'adopter',
                'bio': 'Animal lover and volunteer.'
            }
        )
        if created:
            adopter2.set_password('password123')
            adopter2.save()
            self.stdout.write(self.style.SUCCESS('Created Adopter 2'))

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
        
        # Clear existing pets if you want to start fresh, or just add more
        # Pet.objects.all().delete() 

        created_pets = []
        for i, image_url in enumerate(pet_images):
            name = names[i] if i < len(names) else f"Pet {i+1}"
            species = 'Dog' if 'cat' not in image_url.lower() and 'ai-generated' not in image_url.lower() else 'Cat'
            if i == 1: species = 'Dog' # sergey-semin
            if i == 9 or i == 10: species = 'Cat'

            pet, created = Pet.objects.get_or_create(
                name=name,
                shelter=shelter,
                defaults={
                    'species': species,
                    'breed': random.choice(breeds),
                    'age': random.randint(2, 60),
                    'gender': random.choice(['male', 'female']),
                    'weight': random.uniform(3.0, 30.0),
                    'description': f"A lovely {species.lower()} looking for a home. Very friendly and playful.",
                    'photo_url': image_url,
                    'is_vaccinated': random.choice([True, False]),
                    'status': 'available',
                    'color': random.choice(['Brown', 'Black', 'White', 'Spotted', 'Golden']),
                }
            )
            created_pets.append(pet)
            if created:
                self.stdout.write(f"Created pet: {name}")

        # 3. Create Community Posts
        posts_content = [
            "Just adopted a new puppy! So excited.",
            "Does anyone know a good vet in the downtown area?",
            "Happy Paws Shelter is doing an amazing job!",
            "Found a stray cat near the park, looking for owner.",
            "Tips for training a stubborn husky?"
        ]
        
        for content in posts_content:
            Post.objects.get_or_create(
                user=random.choice([adopter1, adopter2, shelter]),
                content=content,
                defaults={'image': random.choice(pet_images) if random.random() > 0.7 else None}
            )
        self.stdout.write(self.style.SUCCESS('Created Community Posts'))

        # 4. Create Reviews
        Review.objects.get_or_create(
            reviewer=adopter1,
            target_user=shelter,
            defaults={
                'rating': 5,
                'comment': "Amazing shelter! The staff is so helpful and the pets are well cared for."
            }
        )
        Review.objects.get_or_create(
            reviewer=adopter2,
            target_user=shelter,
            defaults={
                'rating': 4,
                'comment': "Great experience adopting my cat here."
            }
        )
        self.stdout.write(self.style.SUCCESS('Created Reviews'))

        # 5. Create Adoption Applications
        if created_pets:
            AdoptionApplication.objects.get_or_create(
                applicant=adopter1,
                pet=created_pets[0],
                defaults={
                    'message': "I have a large backyard and love dogs!",
                    'status': 'pending'
                }
            )
            AdoptionApplication.objects.get_or_create(
                applicant=adopter2,
                pet=created_pets[1],
                defaults={
                    'message': "I've always wanted a Siamese cat.",
                    'status': 'approved'
                }
            )
        self.stdout.write(self.style.SUCCESS('Created Adoption Applications'))

        # 6. Create Events
        Event.objects.get_or_create(
            title="Weekend Adoption Fair",
            organizer=shelter,
            defaults={
                'description': "Come meet our lovely pets this weekend at the city park!",
                'location': "City Park, Main St.",
                'start_time': timezone.now() + timedelta(days=5),
                'end_time': timezone.now() + timedelta(days=5, hours=4),
                'image': "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1000&q=80"
            }
        )
        self.stdout.write(self.style.SUCCESS('Created Events'))

        self.stdout.write(self.style.SUCCESS('Successfully populated database with realistic dummy data!'))
