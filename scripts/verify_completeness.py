import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PetCircle.settings')
django.setup()

from apps.pets.models import PetProfile, PersonalityTrait, PetPersonality, PetMedia
from apps.users.models import User

def test_profile_completeness():
    print("Testing Profile Completeness Logic...")
    
    # Create dummy user
    user, _ = User.objects.get_or_create(email='test_completeness@example.com', defaults={'first_name': 'Test', 'last_name': 'User', 'password': 'password'})
    
    # Create minimal pet
    pet = PetProfile.objects.create(
        owner=user,
        name="Incomplete Pet",
        species="dog",
        gender="male",
        description="A nice dog"
    )
    
    print(f"1. Basic Pet (No Breed, No Birth Date, No Photos, No Traits): Complete? {pet.profile_is_complete}")
    assert not pet.profile_is_complete, "Should be incomplete"
    
    # Add Breed
    pet.breed = "Labrador"
    pet.save()
    print(f"2. +Breed: Complete? {pet.profile_is_complete}")
    assert not pet.profile_is_complete
    
    # Add Birth Date
    pet.birth_date = date(2020, 1, 1)
    pet.save()
    print(f"3. +Birth Date: Complete? {pet.profile_is_complete}")
    assert not pet.profile_is_complete

    # Add 1 Photo (Need 3)
    PetMedia.objects.create(pet=pet, url="http://example.com/1.jpg")
    print(f"4. +1 Photo: Complete? {pet.profile_is_complete}")
    assert not pet.profile_is_complete
    
    # Add 2 more Photos
    PetMedia.objects.create(pet=pet, url="http://example.com/2.jpg")
    PetMedia.objects.create(pet=pet, url="http://example.com/3.jpg")
    print(f"5. +3 Photos Total: Complete? {pet.profile_is_complete}")
    assert not pet.profile_is_complete, "Still need traits"
    
    # Add 1 Trait (Need 2)
    trait1, _ = PersonalityTrait.objects.get_or_create(name="Friendly")
    PetPersonality.objects.create(pet=pet, trait=trait1)
    print(f"6. +1 Trait: Complete? {pet.profile_is_complete}")
    assert not pet.profile_is_complete
    
    # Add 2nd Trait
    trait2, _ = PersonalityTrait.objects.get_or_create(name="Calm")
    PetPersonality.objects.create(pet=pet, trait=trait2)
    print(f"7. +2 Traits Total: Complete? {pet.profile_is_complete}")
    assert pet.profile_is_complete, "Should be complete now"
    
    print("SUCCESS: Logic verified correctly.")
    
    # Cleanup
    pet.delete()
    user.delete()

if __name__ == "__main__":
    test_profile_completeness()
