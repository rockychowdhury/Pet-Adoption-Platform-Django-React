import logging
import json
from django.utils import timezone

logger = logging.getLogger('petcircle.business')

def log_business_event(event_type, user, details=None, level=logging.INFO):
    """
    Standardized logging for business-critical events.
    
    Args:
        event_type (str): Type of event (e.g., 'REHOMING_LISTING_CREATED')
        user (User): The user who initiated the action
        details (dict, optional): Additional context for the event
        level (int): Logging level (default: logging.INFO)
    """
    event_data = {
        'timestamp': timezone.now().isoformat(),
        'event_type': event_type,
        'user_id': user.id if user and hasattr(user, 'id') else None,
        'user_email': user.email if user and hasattr(user, 'email') else 'system',
        'details': details or {}
    }
    
    # Log as JSON for easier parsing by log aggregators
    message = json.dumps(event_data)
    logger.log(level, message)
