from django.core.management.base import BaseCommand
from apps.pets.models import PetProfile, PersonalityTrait
from apps.rehoming.models import RehomingRequest, RehomingListing

class Command(BaseCommand):
    help = 'Deletes all pet and rehoming data and populates personality traits.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting data reset...")

        # 1. Delete Rehoming Data
        self.stdout.write("Deleting Rehoming Listings...")
        count, _ = RehomingListing.objects.all().delete()
        self.stdout.write(f"Deleted {count} Rehoming Listings.")

        self.stdout.write("Deleting Rehoming Requests...")
        count, _ = RehomingRequest.objects.all().delete()
        self.stdout.write(f"Deleted {count} Rehoming Requests.")

        # 2. Delete Pet Data (Cascades to media, traits, etc.)
        self.stdout.write("Deleting Pet Profiles...")
        count, _ = PetProfile.objects.all().delete()
        self.stdout.write(f"Deleted {count} Pet Profiles.")

        # 3. Populate Personality Traits
        self.stdout.write("Populating Personality Traits...")
        traits = [
            'Playful', 'Calm', 'Energetic', 'Affectionate', 'Independent',
            'Friendly', 'Shy', 'Protective', 'Curious', 'Lazy',
            'Good with Kids', 'Good with Dogs', 'Good with Cats',
            'Intelligent', 'Loyal', 'Quiet', 'Talkative', 'Gentle',
            'House Trained', 'Crate Trained', 'Leash Trained'
        ]

        created_count = 0
        for trait_name in traits:
            obj, created = PersonalityTrait.objects.get_or_create(name=trait_name)
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully populated {created_count} new personality traits.'))
        self.stdout.write(self.style.SUCCESS("Data reset and population complete."))
