import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.pets.models import Pet

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
        
        # Adopter
        adopter, created = User.objects.get_or_create(
            email='adopter@example.com',
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'adopter',
                'bio': 'Looking for a furry friend.'
            }
        )
        if created:
            adopter.set_password('password123')
            adopter.save()
            self.stdout.write(self.style.SUCCESS('Created Adopter user'))

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
        species_list = ['Dog', 'Cat', 'Dog', 'Dog', 'Cat', 'Dog', 'Dog', 'Dog', 'Dog', 'Cat', 'Cat', 'Dog'] # Roughly matching images if possible, but random is fine for dummy

        # Clear existing pets to avoid duplicates if running multiple times (optional, but good for "10 dummy data")
        # Pet.objects.all().delete() 
        # Actually, let's just add them.

        for i, image_url in enumerate(pet_images):
            name = names[i] if i < len(names) else f"Pet {i+1}"
            species = 'Dog' if 'cat' not in image_url.lower() and 'ai-generated' not in image_url.lower() else 'Cat' # Simple heuristic
            if i == 1: species = 'Dog' # sergey-semin looks like a dog
            if i == 9 or i == 10: species = 'Cat'

            Pet.objects.create(
                name=name,
                species=species,
                breed=random.choice(breeds),
                age=random.randint(2, 60),
                gender=random.choice(['male', 'female']),
                size=random.choice(['Small', 'Medium', 'Large']),
                color=random.choice(['Brown', 'Black', 'White', 'Spotted', 'Golden']),
                weight=random.uniform(3.0, 30.0),
                description=f"A lovely {species.lower()} looking for a home. Very friendly and playful.",
                photo_url=image_url,
                is_vaccinated=random.choice([True, False]),
                status='available',
                shelter=shelter
            )
            self.stdout.write(f"Created pet: {name}")

        self.stdout.write(self.style.SUCCESS('Successfully populated database with dummy data!'))
