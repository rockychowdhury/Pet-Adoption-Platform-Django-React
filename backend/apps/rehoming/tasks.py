from celery import shared_task
from .models import AdoptionInquiry
from .services.ai_service import calculate_match_score
from apps.users.serializers import UserSerializer

import logging

logger = logging.getLogger(__name__)

@shared_task
def analyze_application_match(inquiry_id):
    try:
        inquiry = AdoptionInquiry.objects.get(id=inquiry_id)
        
        # Prepare Data
        pet_data = {
            "name": inquiry.listing.pet.name,
            "species": inquiry.listing.pet.species,
            "breed": inquiry.listing.pet.breed,
            "age": inquiry.listing.pet.age,
            "gender": inquiry.listing.pet.gender,
            "description": inquiry.listing.pet.description or "",
            "listing_description": inquiry.listing.description or ""
        }
        
        applicant = inquiry.requester
        applicant_data = {
            "full_name": f"{applicant.first_name} {applicant.last_name}",
            "email_verified": applicant.email_verified,
            "profile_complete": applicant.profile_is_complete,
            # Add more fields if available in User model like location etc.
        }
        
        # Run AI Analysis
        score = calculate_match_score(pet_data, applicant_data, inquiry.message)
        
        # Update Model
        inquiry.match_percentage = score
        inquiry.ai_processed = True
        inquiry.save()
        
        logger.info(f"Updated match score for Inquiry {inquiry_id}: {score}%")
        
    except AdoptionInquiry.DoesNotExist:
        logger.error(f"Inquiry {inquiry_id} not found.")
    except Exception as e:
        logger.error(f"Error in analyze_application_match: {e}")
