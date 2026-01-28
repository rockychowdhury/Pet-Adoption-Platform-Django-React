import random
import hmac
import hashlib
from urllib.parse import quote
from django.conf import settings


def generate_otp():
    """
    Generate a 6-digit numeric OTP code.
    
    Returns:
        str: 6-digit numeric code
    """
    return str(random.randint(100000, 999999))


def format_whatsapp_link(business_number, code):
    """
    Create a WhatsApp deep link with pre-filled verification message.
    
    Args:
        business_number (str): WhatsApp Business phone number (with country code)
        code (str): Verification code to pre-fill
    
    Returns:
        str: WhatsApp deep link URL
    
    Example:
        >>> format_whatsapp_link("+1234567890", "123456")
        'https://wa.me/1234567890?text=Verify%3A%20123456'
    """
    # Remove '+' and any spaces from the phone number
    clean_number = business_number.replace('+', '').replace(' ', '').replace('-', '')
    
    # Create the verification message
    message = f"Verify: {code}"
    
    # URL encode the message
    encoded_message = quote(message)
    
    # Construct the wa.me link
    whatsapp_link = f"https://wa.me/{clean_number}?text={encoded_message}"
    
    return whatsapp_link


def verify_meta_signature(payload, signature):
    """
    Verify that the webhook request came from Meta by validating the signature.
    
    Args:
        payload (bytes): Raw request body
        signature (str): X-Hub-Signature-256 header value
    
    Returns:
        bool: True if signature is valid, False otherwise
    """
    if not signature:
        return False
    
    # Get the app secret from settings
    app_secret = getattr(settings, 'META_APP_SECRET', '')
    
    if not app_secret:
        # If no app secret is configured, skip verification in development
        # In production, this should always be set
        return True
    
    try:
        # The signature format is "sha256=<hash>"
        if not signature.startswith('sha256='):
            return False
        
        signature_hash = signature.split('sha256=')[1]
        
        # Calculate expected signature
        expected_signature = hmac.new(
            app_secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures using constant-time comparison
        return hmac.compare_digest(signature_hash, expected_signature)
    
    except Exception:
        return False


def extract_message_from_webhook(webhook_data):
    """
    Extract sender phone number and message text from Meta webhook payload.
    
    Args:
        webhook_data (dict): Parsed webhook JSON payload
    
    Returns:
        tuple: (sender_phone, message_text) or (None, None) if extraction fails
    
    Expected webhook structure:
    {
        "entry": [{
            "changes": [{
                "value": {
                    "messages": [{
                        "from": "1234567890",
                        "text": {"body": "Verify: 123456"}
                    }]
                }
            }]
        }]
    }
    """
    try:
        entry = webhook_data.get('entry', [])
        if not entry:
            return None, None
        
        changes = entry[0].get('changes', [])
        if not changes:
            return None, None
        
        value = changes[0].get('value', {})
        messages = value.get('messages', [])
        
        if not messages:
            return None, None
        
        message = messages[0]
        sender_phone = message.get('from', '')
        message_text = message.get('text', {}).get('body', '')
        
        # Normalize phone number (remove any non-digits)
        if sender_phone:
            # Keep the + if it exists, otherwise Meta sends without it
            if not sender_phone.startswith('+'):
                sender_phone = '+' + sender_phone
        
        return sender_phone, message_text
    
    except (KeyError, IndexError, AttributeError):
        return None, None


def extract_code_from_message(message_text):
    """
    Extract verification code from the message text.
    
    Args:
        message_text (str): The message text received
    
    Returns:
        str or None: The extracted 6-digit code, or None if not found
    
    Examples:
        >>> extract_code_from_message("Verify: 123456")
        '123456'
        >>> extract_code_from_message("123456")
        '123456'
    """
    if not message_text:
        return None
    
    # Look for 6-digit number in the message
    import re
    match = re.search(r'\b(\d{6})\b', message_text)
    
    if match:
        return match.group(1)
    
    return None


def send_otp_via_whatsapp(phone_number, otp_code, access_token, phone_number_id):
    """
    Send OTP code to user's WhatsApp number using Meta Cloud API.
    
    Args:
        phone_number (str): Recipient's phone number (with country code)
        otp_code (str): The 6-digit OTP code to send
        access_token (str): WhatsApp Business API access token from Meta
        phone_number_id (str): Your WhatsApp Business phone number ID from Meta
    
    Returns:
        dict: Response from WhatsApp API or error dict
    
    Note:
        This is a PAID feature. Each message costs money based on Meta's pricing.
        Free tier: First 1,000 conversations per month.
    """
    import requests
    import logging
    
    logger = logging.getLogger(__name__)
    
    url = f"https://graph.facebook.com/v22.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Clean phone number but ensure it has country code
    # Remove spaces and dashes, but keep + if present
    clean_phone = phone_number.replace(' ', '').replace('-', '')
    
    # If it doesn't start with +, add it (assuming it has country code)
    if not clean_phone.startswith('+'):
        clean_phone = '+' + clean_phone
    
    # Now remove the + for the API call (Meta expects no +)
    api_phone = clean_phone.replace('+', '')
    
    # Message payload
    payload = {
        "messaging_product": "whatsapp",
        "to": api_phone,
        "type": "text",
        "text": {
            "body": f"Your PetCircle verification code is: {otp_code}\n\nThis code will expire in 15 minutes.\n\nDo not share this code with anyone."
        }
    }
    
    logger.info(f"Sending WhatsApp OTP to {api_phone} (original: {phone_number})")
    logger.debug(f"Using phone_number_id: {phone_number_id}")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        # Log the response for debugging
        logger.info(f"WhatsApp API Response Status: {response.status_code}")
        logger.debug(f"WhatsApp API Response Body: {response.text}")
        
        # Try to parse the error response
        if response.status_code != 200:
            try:
                error_data = response.json()
                error_message = error_data.get('error', {}).get('message', 'Unknown error')
                error_code = error_data.get('error', {}).get('code', 'Unknown code')
                error_type = error_data.get('error', {}).get('type', 'Unknown type')
                
                logger.error(f"WhatsApp API Error: {error_message} (Code: {error_code}, Type: {error_type})")
                
                return {
                    'success': False,
                    'error': f"{error_type}: {error_message} (Code: {error_code})",
                    'message': 'Failed to send WhatsApp message',
                    'details': {
                        'status_code': response.status_code,
                        'error_message': error_message,
                        'error_code': error_code,
                        'error_type': error_type,
                        'phone_number': api_phone
                    }
                }
            except ValueError:
                # Response is not JSON
                logger.error(f"WhatsApp API Non-JSON Error Response: {response.text}")
                return {
                    'success': False,
                    'error': response.text,
                    'message': 'Failed to send WhatsApp message',
                    'details': {
                        'status_code': response.status_code,
                        'response': response.text,
                        'phone_number': api_phone
                    }
                }
        
        response.raise_for_status()
        return {
            'success': True,
            'data': response.json()
        }
    except requests.exceptions.RequestException as e:
        logger.error(f"WhatsApp API Request Exception: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'message': 'Failed to send WhatsApp message',
            'details': {
                'exception_type': type(e).__name__,
                'phone_number': api_phone
            }
        }
