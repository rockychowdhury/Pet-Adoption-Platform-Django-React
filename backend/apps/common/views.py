import os
import uuid
from rest_framework import views, status, parsers, permissions
from rest_framework.response import Response
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .serializers import FileUploadSerializer

class FileUploadView(views.APIView):
    """
    Generic file upload endpoint.
    Accepts 'multipart/form-data' with a 'file' field.
    Returns: {"url": "..."}
    """
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    permission_classes = [permissions.IsAuthenticated] # Require auth for safety

    def post(self, request, format=None):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            uploaded_file = request.FILES['file']
            
            # Generate a unique filename to prevent overwrites and guessing
            ext = os.path.splitext(uploaded_file.name)[1]
            unique_filename = f"{uuid.uuid4()}{ext}"
            
            # Use Django's storage system (works with S3 if configured later, or local now)
            file_path = default_storage.save(f"uploads/{unique_filename}", ContentFile(uploaded_file.read()))
            
            # Generate full URL
            if settings.DEBUG:
                # Local dev
                file_url = request.build_absolute_uri(settings.MEDIA_URL + file_path)
            else:
                # Production (S3 or similar)
                file_url = default_storage.url(file_path)
                
            return Response({
                "url": file_url,
                "filename": unique_filename,
                "original_name": uploaded_file.name
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
