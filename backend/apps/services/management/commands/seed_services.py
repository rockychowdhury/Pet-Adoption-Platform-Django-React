from django.core.management.base import BaseCommand
from apps.services.models import ServiceCategory, Species, ServiceOption, Specialization

class Command(BaseCommand):
    help = 'Seeds initial service data (Categories, Species, Options, Specializations)'

    def handle(self, *args, **options):
        self.stdout.write('Seeding service data...')

        # 1. Species
        species_list = ['Dog', 'Cat', 'Bird', 'Small Animal', 'Horse', 'Reptile']
        for s in species_list:
            Species.objects.get_or_create(name=s, slug=s.lower().replace(' ', '-'))
        self.stdout.write(f'Created {len(species_list)} species.')

        # 2. Categories
        categories = [
            {
                'name': 'Veterinary', 
                'slug': 'veterinary', 
                'icon': 'Stethoscope',
                'options': ['Wellness Exam', 'Vaccination', 'Surgery', 'Dental Cleaning', 'emergency']
            },
            {
                'name': 'Training', 
                'slug': 'training', 
                'icon': 'GraduationCap',
                'options': ['Puppy Training', 'Obedience', 'Behavior Modification', 'Agility']
            },
            {
                'name': 'Foster', 
                'slug': 'foster', 
                'icon': 'Home',
                'options': ['Short-term Foster', 'Long-term Foster', 'Medical Foster', 'Hospice Foster']
            },
             {
                'name': 'Grooming', 
                'slug': 'grooming', 
                'icon': 'Scissors',
                'options': ['Bath & Brush', 'Full Haircut', 'Nail Trim', 'De-shedding']
            },
            {
                'name': 'Boarding', 
                'slug': 'boarding', 
                'icon': 'Hotel',
                'options': ['Overnight Boarding', 'Daycare', 'In-home Sitting']
            }
        ]

        for cat_data in categories:
            category, _ = ServiceCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'icon_name': cat_data['icon']
                }
            )
            
            # Options
            for opt_name in cat_data['options']:
                ServiceOption.objects.get_or_create(
                    category=category,
                    name=opt_name
                )

        self.stdout.write(f'Created {len(categories)} categories and sub-options.')

        # 3. Specializations (Trainer specific)
        trainer_cat = ServiceCategory.objects.get(slug='training')
        specializations = [
            'Puppy Socialization',
            'Aggression Management',
            'Separation Anxiety',
            'Service Dog Training',
            'Competition Obedience',
            'Trick Training'
        ]
        
        for spec in specializations:
            Specialization.objects.get_or_create(
                category=trainer_cat,
                name=spec
            )
            
        self.stdout.write(f'Created {len(specializations)} trainer specializations.')
        self.stdout.write(self.style.SUCCESS('Successfully seeded service data!'))
