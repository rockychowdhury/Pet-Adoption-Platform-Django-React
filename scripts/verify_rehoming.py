
import os
import sys
import django
from django.utils import timezone
from textwrap import dedent

# Setup Django
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PetCircle.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.pets.models import PetProfile as Pet
from apps.rehoming.models import RehomingRequest, RehomingListing

User = get_user_model()

def run_verification():
    print("🚀 Starting Rehoming Flow Verification...")
    
    # 1. Setup User & Pet
    client = APIClient()
    email = f"tester_{timezone.now().timestamp()}@example.com"
    user = User.objects.create_user(
        email=email, 
        password="password123", 
        first_name="Test", 
        last_name="User",
        phone_number="1234567890",
        location_city="Test City",
        location_state="TS",
        email_verified=True,
        phone_verified=True
    )
    client.force_authenticate(user=user)
    
    birth_date = timezone.now().date() - timezone.timedelta(days=365*5)
    
    pet = Pet.objects.create(
        owner=user,
        name="TestPet",
        species="dog",
        breed="Labrador",
        birth_date=birth_date,
        gender="male",
        description="A good boy"
    )
    print(f"✅ User & Pet created: {user.email}, {pet.name}")

    # 2. Create Rehoming Request
    request_data = {
        "pet": pet.id,
        "reason": "moving",
        "urgency": "soon",
        "agreement_responsibility": True,
        "agreement_info_accuracy": True,
        "agreement_terms": True
    }
    
    response = client.post('/api/rehoming/requests/', request_data, format='json')
    if response.status_code != 201:
        print(f"❌ Failed to create request: {response.data}")
        return
        
    req_id = response.data['id']
    req_obj = RehomingRequest.objects.get(id=req_id)
    print(f"✅ Rehoming Request created: {req_id} (Status: {req_obj.status})")
    
    if req_obj.status != 'cooling_period':
        print(f"❌ Status mismatch. Expected 'cooling_period', got '{req_obj.status}'")
    
    # Check cooling period
    if not req_obj.cooling_period_end:
        print("❌ Cooling period end not set!")
    else:
        print(f"✅ Cooling period active until: {req_obj.cooling_period_end}")

    # 3. Attempt Early Confirmation (Should Fail)
    print("🔸 Attempting early confirmation...")
    response = client.post(f'/api/rehoming/requests/{req_id}/confirm/', {}, format='json')
    if response.status_code == 400 and 'seconds_remaining' in response.data:
        print(f"✅ Early confirmation blocked nicely. Seconds remaining: {response.data['seconds_remaining']}")
    else:
        print(f"❌ Early confirmation NOT blocked correctly. Status: {response.status_code}, Data: {response.data}")

    # 4. Fast Forward Time & Confirm
    print("🔸 Fast-forwarding time to bypass cooling...")
    req_obj.cooling_period_end = timezone.now() - timezone.timedelta(seconds=1)
    req_obj.save()
    
    response = client.post(f'/api/rehoming/requests/{req_id}/confirm/', {}, format='json')
    if response.status_code == 200:
        print("✅ Confirmation successful after cooling period.")
        req_obj.refresh_from_db()
        print(f"   New Status: {req_obj.status}")
    else:
        print(f"❌ Confirmation failed after time skip. Status: {response.status_code}, Data: {response.data}")
        return

    # 5. Create Listing (Should Succeed)
    print("🔸 Creating Listing with confirmed request...")
    listing_data = {
        "request_id": req_id,
        "pet": pet.id,
        "reason": "moving",
        "urgency": "soon",
        "location_city": "New York",
        "location_state": "NY",
        "ideal_home": "Quiet place",
        "privacy_level": "public"
    }
    response = client.post('/api/rehoming/listings/', listing_data, format='json')
    if response.status_code == 201:
        print("✅ Listing created successfully.")
    else:
        print(f"❌ Failed to create listing: {response.data}")

    # 6. Violate Constraint (Duplicate Listing)
    print("🔸 Attempting to create duplicate listing (Should Fail)...")
    response = client.post('/api/rehoming/listings/', listing_data, format='json')
    if response.status_code == 400:
        print("✅ Duplicate listing blocked.")
    else:
        print(f"❌ Duplicate listing allowed! Status: {response.status_code}")

    # 7. Check Constraints (No Request ID)
    print("🔸 Attempting to create listing without request ID (Should Fail)...")
    bad_data = {
        "location_city": "Nowhere",
        "location_state": "NA",
        "ideal_home": "Void"
    }
    response = client.post('/api/rehoming/listings/', bad_data, format='json')
    if response.status_code == 400:
        print("✅ Missing request_id blocked.")
    else:
        print(f"❌ Missing request_id allowed! Status: {response.status_code}")

    print("\n🎉 Verification Complete!")

if __name__ == '__main__':
    try:
        run_verification()
    except Exception as e:
        print(f"\n❌ Script Error: {e}")
