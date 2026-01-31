
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.pets.models import PersonalityTrait
from apps.services.models import ServiceCategory, Species, Specialization, ServiceOption

class Command(BaseCommand):
    help = 'Populates default lookup data (Traits, Categories, Species, etc.)'

    def handle(self, *args, **options):
        self.stdout.write('Populating default data...')
        
        with transaction.atomic():
            self.populate_personality_traits()
            self.populate_species()
            self.populate_service_categories()
        
        self.stdout.write(self.style.SUCCESS('Successfully populated default data.'))

    def populate_personality_traits(self):
        traits = [
            'Friendly', 'Playful', 'Calm', 'Energy', 'Protective', 
            'Affectionate', 'Independent', 'Intelligent', 'Curious', 
            'Loyal', 'Gentle', 'Social', 'Quiet', 'Vocal', 'Timid'
        ]
        count = 0
        for name in traits:
            _, created = PersonalityTrait.objects.get_or_create(name=name)
            if created: count += 1
        self.stdout.write(f'Created {count} personality traits')

    def populate_species(self):
        species_list = [
            ('Dog', 'dog'),
            ('Cat', 'cat'),
            ('Rabbit', 'rabbit'),
            ('Bird', 'bird'),
            ('Reptile', 'reptile'),
            ('Small Animal', 'small-animal'),
            ('Horse', 'horse')
        ]
        count = 0
        for name, slug in species_list:
            _, created = Species.objects.get_or_create(name=name, defaults={'slug': slug})
            if created: count += 1
        self.stdout.write(f'Created {count} species')

    def populate_service_categories(self):
        # 1. Veterinary
        vet_cat, _ = ServiceCategory.objects.get_or_create(
            name='Veterinary', 
            defaults={'slug': 'vet', 'description': 'Medical care for pets', 'icon_name': 'stethoscope'}
        )
        self._populate_service_options(vet_cat, [
            'Wellness Exam', 'Vaccination', 'Dental Cleaning', 'Surgery', 'Emergency Care', 'Microchipping'
        ])
        
        # 2. Grooming
        groom_cat, _ = ServiceCategory.objects.get_or_create(
            name='Grooming', 
            defaults={'slug': 'grooming', 'description': 'Professional grooming services', 'icon_name': 'scissors'}
        )
        self._populate_service_options(groom_cat, [
            'Bath & Brush', 'Full Haircut', 'Nail Trim', 'Ear Cleaning', 'Teeth Brushing'
        ])

        # 3. Training
        train_cat, _ = ServiceCategory.objects.get_or_create(
            name='Training', 
            defaults={'slug': 'training', 'description': 'Behavioral training and obedience', 'icon_name': 'award'}
        )
        self._populate_service_options(train_cat, [
            'Puppy Kindergarten', 'Basic Obedience', 'Advanced Obedience', 'Behavior Modification', 'Agility Training'
        ])
        self._populate_specializations(train_cat, [
            'Aggression', 'Anxiety', 'Puppy Socialization', 'Service Dog Training'
        ])

        # 4. Foster
        foster_cat, _ = ServiceCategory.objects.get_or_create(
            name='Foster', 
            defaults={'slug': 'foster', 'description': 'Temporary home care', 'icon_name': 'home'}
        )
        self._populate_service_options(foster_cat, [
            'Short-term Foster', 'Long-term Foster', 'Medical Foster', 'Hospice Foster'
        ])

        # 5. Sitting/Boarding
        board_cat, _ = ServiceCategory.objects.get_or_create(
            name='Boarding', 
            defaults={'slug': 'boarding', 'description': 'Overnight care', 'icon_name': 'tent'}
        )
        self._populate_service_options(board_cat, [
            'Kennel Boarding', 'In-Home Boarding', 'House Sitting', 'Drop-in Visits'
        ])
        
        # 6. Walking
        walk_cat, _ = ServiceCategory.objects.get_or_create(
            name='Walking', 
            defaults={'slug': 'walking', 'description': 'Dog walking services', 'icon_name': 'footprints'}
        )
        self._populate_service_options(walk_cat, [
            '30-min Walk', '60-min Walk', 'Group Walk', 'Solo Walk'
        ])

    def _populate_service_options(self, category, options):
        for name in options:
            ServiceOption.objects.get_or_create(category=category, name=name)

    def _populate_specializations(self, category, specs):
        for name in specs:
            Specialization.objects.get_or_create(category=category, name=name)
