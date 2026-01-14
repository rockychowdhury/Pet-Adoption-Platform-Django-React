from django.core.management.base import BaseCommand
from apps.pets.models import PersonalityTrait

class Command(BaseCommand):
    help = 'Populates the database with common personality traits'

    def handle(self, *args, **kwargs):
        traits = [
            'Playful', 'Calm', 'Energetic', 'Affectionate', 'Independent',
            'Friendly', 'Shy', 'Protective', 'Curious', 'Lazy',
            'Good with Kids', 'Good with Dogs', 'Good with Cats',
            'Intelligent', 'Loyal', 'Quiet', 'Talkative', 'Gentle'
        ]

        created_count = 0
        for trait_name in traits:
            obj, created = PersonalityTrait.objects.get_or_create(name=trait_name)
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully populated {created_count} new personality traits.'))
