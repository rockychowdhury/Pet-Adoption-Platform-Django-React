from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.rehoming.models import RehomingRequest
from apps.pets.models import PetProfile
from rest_framework.test import APIClient
from rest_framework import status
import datetime

User = get_user_model()

class RehomingRequestTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com', 
            password='password123',
            first_name='Test',
            last_name='User',
            location_city='Test City',
            location_state='Test State',
            phone_number='1234567890'
        )
        self.pet = PetProfile.objects.create(
            owner=self.user,
            name='Buddy',
            species='dog',
            breed='Golden Retriever',
            birth_date=datetime.date.today(),
            gender='male'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_rehoming_request_immediate_confirmation(self):
        """
        Test that creating a rehoming request immediately validates it as 'confirmed'
        skipping the cooling period.
        """
        url = '/api/rehoming/requests/'
        data = {
            'pet': self.pet.id,
            'reason': 'Moving away',
            'urgency': 'flexible', # Even flexible should be confirmed now
            'location_city': 'New City',
            'location_state': 'New State',
            'privacy_level': 'public',
            'terms_accepted': True
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'confirmed')
        self.assertIsNone(response.data['cooling_period_end'])
        
        # Verify DB
        req = RehomingRequest.objects.get(id=response.data['id'])
        self.assertEqual(req.status, 'confirmed')

    def test_duplicate_request_prevention(self):
        """Test that duplicate active requests are blocked."""
        RehomingRequest.objects.create(
            owner=self.user,
            pet=self.pet,
            status='confirmed',
            reason='First request'
        )
        
        url = '/api/rehoming/requests/'
        data = {
            'pet': self.pet.id,
            'reason': 'Second request',
            'urgency': 'immediate',
            'terms_accepted': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
