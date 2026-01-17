
import os
import sys
import django

# Setup Django
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PetCircle.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def fix_user():
    email = "rocky20809@gmail.com"
    try:
        user = User.objects.get(email=email)
        print(f"Found user: {user.email}")
        print(f"  Current Status:")
        print(f"    - Email Verified: {user.email_verified}")
        print(f"    - Phone Verified: {user.phone_verified}")
        print(f"    - Identity Verified: {user.verified_identity}")
        print(f"    - Account Status: {user.account_status}")
        print(f"    - Can Create Listing: {user.can_create_listing}")

        if not user.can_create_listing:
            print("\nUpdating user verification status...")
            user.email_verified = True
            user.phone_verified = True
            user.account_status = 'active' # Ensure active
            user.save()
            
            # Refresh
            user.refresh_from_db()
            print(f"  New Status:")
            print(f"    - Email Verified: {user.email_verified}")
            print(f"    - Phone Verified: {user.phone_verified}")
            print(f"    - Can Create Listing: {user.can_create_listing}")
            
            if user.can_create_listing:
                print("\n✅ User successfully verified manually.")
            else:
                print("\n❌ User still cannot create listing. Check model logic.")
        else:
            print("\n✅ User is already verified and cleared to create listings.")

    except User.DoesNotExist:
        print(f"❌ User with email {email} not found.")

if __name__ == '__main__':
    fix_user()
