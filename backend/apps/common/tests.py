from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()

class FileUploadTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='test@example.com', password='password123')
        self.client.force_authenticate(user=self.user)
        
    def test_upload_file(self):
        # Create a dummy image file
        file_content = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
        uploaded_file = SimpleUploadedFile("test_image.gif", file_content, content_type="image/gif")
        
        response = self.client.post('/common/upload/', {'file': uploaded_file}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('url', response.data)
        self.assertIn('filename', response.data)
        self.assertTrue(response.data['url'].startswith('/media/uploads/'))
        
    def test_upload_unauthenticated(self):
        self.client.logout()
        uploaded_file = SimpleUploadedFile("test.txt", b"content", content_type="text/plain")
        response = self.client.post('/common/upload/', {'file': uploaded_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
