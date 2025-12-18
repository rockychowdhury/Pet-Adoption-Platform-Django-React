# Authentication Implementation Plan - Missing Features

## Introduction

This document outlines the implementation plan for completing the PetCircle authentication system based on the analysis of current gaps and the UI specification requirements.

## Glossary

- **Phone Verification**: SMS-based verification system for user phone numbers
- **Document Verification**: System for uploading and verifying identity and pet ownership documents
- **Admin Verification Workflow**: Backend system for admins to review and approve verification documents
- **Profile Management**: Comprehensive user profile editing and privacy settings
- **File Upload System**: Secure file upload infrastructure for documents and photos

## Requirements

### Requirement 1: Phone Verification System

**User Story:** As a user, I want to verify my phone number with an SMS code, so that I can complete my account verification and increase security.

#### Acceptance Criteria

1. WHEN a user provides their phone number THEN the system SHALL send a 6-digit SMS verification code
2. WHEN a user enters the SMS code THEN the system SHALL validate the code and mark the phone as verified
3. WHEN a user requests code resend THEN the system SHALL send a new code with rate limiting (max 3 per 15 minutes)
4. WHEN the SMS code expires (10 minutes) THEN the system SHALL require a new code to be sent
5. WHEN phone verification is complete THEN the system SHALL update the user's verification status and show success message

#### Technical Implementation

**Backend Components:**
```python
# Models
class PhoneVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)

# Views
class SendPhoneVerificationView(APIView)
class VerifyPhoneView(APIView)
class ResendPhoneVerificationView(APIView)

# Services
class SMSService:
    def send_verification_code(self, phone_number, code)
    def validate_phone_number(self, phone_number)
```

**Frontend Components:**
```jsx
// Pages
<PhoneVerificationPage />

// Components
<PhoneInput />          // International phone number input
<SMSCodeInput />        // 6-digit SMS code input

// Context Updates
const verifyPhone = async (code) => {
  const response = await api.post('/user/verify-phone/', { code });
  if (response.status === 200) {
    await getUser(); // Refresh user data
    return true;
  }
};

const sendPhoneVerification = async (phoneNumber) => {
  const response = await api.post('/user/send-phone-verification/', { 
    phone_number: phoneNumber 
  });
  return response.data;
};
```

### Requirement 2: Document Upload and Verification System

**User Story:** As a user, I want to upload verification documents (ID and pet ownership proof), so that I can get verified badges and increase trust in my profile.

#### Acceptance Criteria

1. WHEN a user uploads an identity document THEN the system SHALL validate file type (PDF, JPG, PNG), size (max 5MB), and store securely
2. WHEN a user uploads pet ownership documents THEN the system SHALL accept multiple document types (vet records, microchip, adoption papers)
3. WHEN documents are uploaded THEN the system SHALL create verification records with pending status
4. WHEN file upload fails THEN the system SHALL provide clear error messages and retry options
5. WHEN documents are submitted THEN the system SHALL notify admins for review and show upload status to user

#### Technical Implementation

**Backend Components:**
```python
# File handling
class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        file = request.FILES.get('document')
        document_type = request.data.get('type')
        
        # Validate file
        if not self.validate_file(file):
            return Response({'error': 'Invalid file'}, status=400)
        
        # Upload to storage and create record
        document = VerificationDocument.objects.create(
            user=request.user,
            document_type=document_type,
            document_url=self.upload_file(file),
            status='pending'
        )
        
        return Response({
            'id': document.id,
            'status': document.status,
            'document_url': document.document_url
        })

class DocumentListView(APIView):
    def get(self, request):
        documents = VerificationDocument.objects.filter(user=request.user)
        serializer = VerificationDocumentSerializer(documents, many=True)
        return Response(serializer.data)

# File validation
class FileValidator:
    ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
    MAX_SIZE = 5 * 1024 * 1024  # 5MB
    
    def validate_file_type(self, file):
        return file.content_type in self.ALLOWED_TYPES
    
    def validate_file_size(self, file):
        return file.size <= self.MAX_SIZE

# Storage configuration (AWS S3)
AWS_S3_CUSTOM_DOMAIN = 'your-bucket.s3.amazonaws.com'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

**Frontend Components:**
```jsx
// Components
<FileUpload 
  onUpload={handleUpload}
  acceptedTypes={['application/pdf', 'image/*']}
  maxSize={5 * 1024 * 1024}
/>

<DocumentPreview 
  file={selectedFile}
  onRemove={handleRemove}
/>

<UploadProgress 
  progress={uploadProgress}
  status={uploadStatus}
/>

// Hooks
const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const uploadFile = async (file, type) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', type);
      
      const response = await api.post('/user/upload-document/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(progress);
        }
      });
      
      return response.data;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  
  return { uploadFile, uploading, progress };
};

const useDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  
  const fetchDocuments = async () => {
    const response = await api.get('/user/documents/');
    setDocuments(response.data);
  };
  
  const deleteDocument = async (id) => {
    await api.delete(`/user/documents/${id}/`);
    await fetchDocuments();
  };
  
  return { documents, fetchDocuments, deleteDocument };
};
```

### Requirement 3: Admin Verification Workflow

**User Story:** As an admin, I want to review and approve/reject user verification documents, so that I can maintain platform trust and safety.

#### Acceptance Criteria

1. WHEN documents are submitted THEN the system SHALL add them to the admin review queue with user information
2. WHEN an admin reviews a document THEN the system SHALL provide document preview, user details, and action buttons
3. WHEN an admin approves a document THEN the system SHALL update verification status, grant badges, and notify the user
4. WHEN an admin rejects a document THEN the system SHALL require a rejection reason and notify the user with feedback
5. WHEN verification status changes THEN the system SHALL update user badges and permissions immediately

#### Technical Implementation

**Backend Components:**
```python
# Admin views
class VerificationQueueView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        documents = VerificationDocument.objects.filter(
            status='pending'
        ).select_related('user').order_by('-created_at')
        
        serializer = AdminVerificationDocumentSerializer(documents, many=True)
        return Response(serializer.data)

class DocumentReviewView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, document_id):
        document = get_object_or_404(VerificationDocument, id=document_id)
        serializer = AdminVerificationDocumentSerializer(document)
        return Response(serializer.data)

class ApproveDocumentView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, document_id):
        document = get_object_or_404(VerificationDocument, id=document_id)
        
        # Update document status
        document.status = 'approved'
        document.reviewed_by = request.user
        document.reviewed_at = timezone.now()
        document.save()
        
        # Update user verification status
        user = document.user
        if document.document_type == 'government_id':
            user.verified_identity = True
        elif document.document_type == 'pet_ownership':
            user.pet_owner_verified = True
        user.save()
        
        # Send notification
        self.notify_user_approved(user, document)
        
        return Response({'message': 'Document approved successfully'})

class RejectDocumentView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, document_id):
        document = get_object_or_404(VerificationDocument, id=document_id)
        rejection_reason = request.data.get('reason')
        
        if not rejection_reason:
            return Response(
                {'error': 'Rejection reason is required'}, 
                status=400
            )
        
        # Update document status
        document.status = 'rejected'
        document.admin_notes = rejection_reason
        document.reviewed_by = request.user
        document.reviewed_at = timezone.now()
        document.save()
        
        # Send notification
        self.notify_user_rejected(document.user, document, rejection_reason)
        
        return Response({'message': 'Document rejected'})

# Notification system
class VerificationNotificationService:
    def notify_user_approved(self, user, document):
        send_mail(
            subject='Document Approved - PetCircle',
            message=f'Your {document.get_document_type_display()} has been approved!',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
    
    def notify_user_rejected(self, user, document, reason):
        send_mail(
            subject='Document Review - PetCircle',
            message=f'Your {document.get_document_type_display()} needs attention: {reason}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
```

**Frontend Components:**
```jsx
// Admin Components
<AdminVerificationQueue 
  documents={pendingDocuments}
  onReview={handleReview}
/>

<DocumentReviewModal 
  document={selectedDocument}
  onApprove={handleApprove}
  onReject={handleReject}
  onClose={handleClose}
/>

<VerificationActions 
  document={document}
  onApprove={onApprove}
  onReject={onReject}
/>

// User Components
<VerificationStatus 
  user={user}
  documents={documents}
/>

<VerificationBadges 
  emailVerified={user.email_verified}
  phoneVerified={user.phone_verified}
  identityVerified={user.verified_identity}
  petOwnerVerified={user.pet_owner_verified}
/>

<DocumentUploadStatus 
  documents={documents}
  onResubmit={handleResubmit}
/>

// Admin hooks
const useAdminVerification = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin-panel/verification-queue/');
      setQueue(response.data);
    } finally {
      setLoading(false);
    }
  };
  
  const approveDocument = async (documentId) => {
    await api.post(`/admin-panel/approve-document/${documentId}/`);
    await fetchQueue(); // Refresh queue
  };
  
  const rejectDocument = async (documentId, reason) => {
    await api.post(`/admin-panel/reject-document/${documentId}/`, { reason });
    await fetchQueue(); // Refresh queue
  };
  
  return { queue, loading, fetchQueue, approveDocument, rejectDocument };
};
```

### Requirement 4: Comprehensive Profile Management

**User Story:** As a user, I want to manage my profile settings, privacy preferences, and account information, so that I can control my platform experience.

#### Acceptance Criteria

1. WHEN a user accesses profile settings THEN the system SHALL display all editable profile information in organized sections
2. WHEN a user updates profile information THEN the system SHALL validate changes and save with appropriate success feedback
3. WHEN a user uploads a profile photo THEN the system SHALL resize, optimize, and store the image with preview
4. WHEN a user changes privacy settings THEN the system SHALL update visibility preferences and apply them immediately
5. WHEN a user changes password THEN the system SHALL require current password and enforce strength requirements

#### Technical Implementation

**Backend Components:**
```python
# Enhanced profile views
class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=400)

class ProfilePhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        photo = request.FILES.get('photo')
        
        if not photo:
            return Response({'error': 'No photo provided'}, status=400)
        
        # Validate image
        if not self.validate_image(photo):
            return Response({'error': 'Invalid image file'}, status=400)
        
        # Process and upload
        processed_photo = self.process_image(photo)
        photo_url = self.upload_to_storage(processed_photo)
        
        # Update user
        request.user.photoURL = photo_url
        request.user.save()
        
        return Response({
            'message': 'Profile photo updated',
            'photo_url': photo_url
        })

class PrivacySettingsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        profile = request.user.profile
        return Response(profile.privacy_settings)
    
    def patch(self, request):
        profile = request.user.profile
        
        # Update privacy settings
        new_settings = request.data
        profile.privacy_settings.update(new_settings)
        profile.save()
        
        return Response({
            'message': 'Privacy settings updated',
            'settings': profile.privacy_settings
        })

class AccountDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        password = request.data.get('password')
        
        if not request.user.check_password(password):
            return Response({'error': 'Invalid password'}, status=400)
        
        # Soft delete or hard delete based on requirements
        request.user.is_active = False
        request.user.account_status = 'deleted'
        request.user.save()
        
        return Response({'message': 'Account deleted successfully'})

# Profile services
class ProfileService:
    def update_profile(self, user, data):
        # Handle profile updates with validation
        pass
    
    def upload_profile_photo(self, user, photo):
        # Handle photo upload and processing
        pass
    
    def update_privacy_settings(self, user, settings):
        # Handle privacy settings updates
        pass
```

**Frontend Components:**
```jsx
// Profile Pages
<ProfileSettingsPage />

// Form Components
<PersonalInformationForm 
  user={user}
  onUpdate={handleUpdate}
/>

<PrivacySettingsForm 
  settings={privacySettings}
  onUpdate={handlePrivacyUpdate}
/>

<SecuritySettingsForm 
  onPasswordChange={handlePasswordChange}
  onTwoFactorToggle={handleTwoFactorToggle}
/>

<AccountManagementForm 
  onDeactivate={handleDeactivate}
  onDelete={handleDelete}
/>

// Specialized Components
<ProfilePhotoUpload 
  currentPhoto={user.photoURL}
  onUpload={handlePhotoUpload}
/>

<PasswordChangeForm 
  onSubmit={handlePasswordChange}
/>

<PrivacyToggle 
  setting="profile_visibility"
  value={privacySettings.profile_visibility}
  onChange={handlePrivacyChange}
/>

<AccountDeletionModal 
  isOpen={showDeleteModal}
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
/>

// Profile management hooks
const useProfileManagement = () => {
  const [loading, setLoading] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({});
  
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await api.patch('/user/update-profile/', data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };
  
  const uploadProfilePhoto = async (photo) => {
    const formData = new FormData();
    formData.append('photo', photo);
    
    const response = await api.post('/user/upload-profile-photo/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  };
  
  const updatePrivacySettings = async (settings) => {
    const response = await api.patch('/user/privacy-settings/', settings);
    setPrivacySettings(response.data.settings);
    return response.data;
  };
  
  return {
    loading,
    privacySettings,
    updateProfile,
    uploadProfilePhoto,
    updatePrivacySettings
  };
};
```

### Requirement 5: Enhanced Security Features

**User Story:** As a user, I want enhanced security features like account lockout and session management, so that my account is protected from unauthorized access.

#### Acceptance Criteria

1. WHEN there are 5 failed login attempts within 15 minutes THEN the system SHALL temporarily lock the account for 30 minutes
2. WHEN a user logs in from a new device THEN the system SHALL optionally send a notification email
3. WHEN a user wants to see active sessions THEN the system SHALL display session information with device details and allow termination
4. WHEN suspicious activity is detected THEN the system SHALL alert the user and require additional verification
5. WHEN a user deletes their account THEN the system SHALL provide a confirmation process and data retention options

#### Technical Implementation

**Backend Components:**
```python
# Security models
class LoginAttempt(models.Model):
    email = models.EmailField()
    ip_address = models.GenericIPAddressField()
    success = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True)

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class SecurityEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50)
    description = models.TextField()
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)

# Security middleware
class AccountLockoutMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Check for account lockout before processing login
        if request.path == '/user/token/' and request.method == 'POST':
            email = request.data.get('email')
            if self.is_account_locked(email):
                return JsonResponse(
                    {'error': 'Account temporarily locked due to failed attempts'}, 
                    status=423
                )
        
        response = self.get_response(request)
        return response
    
    def is_account_locked(self, email):
        recent_attempts = LoginAttempt.objects.filter(
            email=email,
            success=False,
            timestamp__gte=timezone.now() - timedelta(minutes=15)
        ).count()
        
        return recent_attempts >= 5

# Security services
class SecurityNotificationService:
    def notify_new_device_login(self, user, device_info):
        send_mail(
            subject='New Device Login - PetCircle',
            message=f'New login detected from {device_info}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
    
    def notify_suspicious_activity(self, user, activity):
        send_mail(
            subject='Security Alert - PetCircle',
            message=f'Suspicious activity detected: {activity}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

class SuspiciousActivityDetector:
    def detect_unusual_login_pattern(self, user, ip_address):
        # Check for logins from new locations/devices
        pass
    
    def detect_rapid_requests(self, user, request_count):
        # Check for unusual API usage patterns
        pass
```

**Frontend Components:**
```jsx
// Security Components
<SessionManagement 
  sessions={activeSessions}
  onTerminate={handleTerminateSession}
/>

<SecurityAlerts 
  alerts={securityAlerts}
  onDismiss={handleDismissAlert}
/>

<LoginHistory 
  attempts={loginHistory}
  onRefresh={handleRefresh}
/>

<DeviceManagement 
  devices={trustedDevices}
  onRevoke={handleRevokeDevice}
/>

// Security hooks
const useSecurityMonitoring = () => {
  const [sessions, setSessions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  const fetchSessions = async () => {
    const response = await api.get('/user/sessions/');
    setSessions(response.data);
  };
  
  const terminateSession = async (sessionId) => {
    await api.delete(`/user/sessions/${sessionId}/`);
    await fetchSessions();
  };
  
  const fetchSecurityAlerts = async () => {
    const response = await api.get('/user/security-alerts/');
    setAlerts(response.data);
  };
  
  return {
    sessions,
    alerts,
    fetchSessions,
    terminateSession,
    fetchSecurityAlerts
  };
};
```

## Implementation Phases

### Phase 1: Phone Verification System (Week 1-2)
- Implement SMS service integration (Twilio)
- Create phone verification models and views
- Build phone verification UI components
- Add phone verification to registration flow

### Phase 2: File Upload System (Week 3-4)
- Setup file storage (AWS S3 or local)
- Implement file upload endpoints with validation
- Create file upload UI components
- Add document management interface

### Phase 3: Admin Verification Workflow (Week 5-6)
- Build admin verification queue system
- Create document review interface
- Implement approval/rejection workflow
- Add user notification system

### Phase 4: Profile Management (Week 7-8)
- Enhance profile update functionality
- Implement profile photo upload
- Create comprehensive settings pages
- Add privacy controls

### Phase 5: Enhanced Security (Week 9-10)
- Implement account lockout mechanism
- Add session management
- Create security monitoring
- Build security notification system

## Testing Requirements

### Backend Tests
```python
class PhoneVerificationTestCase(TestCase):
    def test_send_phone_verification(self):
        # Test SMS sending functionality
        pass
    
    def test_verify_phone_code(self):
        # Test code verification
        pass
    
    def test_phone_verification_rate_limiting(self):
        # Test rate limiting works correctly
        pass

class DocumentUploadTestCase(TestCase):
    def test_document_upload(self):
        # Test file upload functionality
        pass
    
    def test_file_validation(self):
        # Test file type and size validation
        pass
    
    def test_document_security(self):
        # Test access controls and permissions
        pass
```

### Frontend Tests
```jsx
describe('Phone Verification', () => {
  test('sends verification code', async () => {
    // Test phone verification flow
  });
  
  test('validates phone number format', () => {
    // Test phone number validation
  });
  
  test('handles verification errors', () => {
    // Test error handling
  });
});

describe('Document Upload', () => {
  test('uploads document successfully', async () => {
    // Test document upload
  });
  
  test('validates file types', () => {
    // Test file validation
  });
  
  test('shows upload progress', () => {
    // Test progress indicator
  });
});
```

## Performance Considerations

### Backend Optimizations
- Use Celery for background SMS sending
- Implement Redis caching for verification codes
- Optimize file upload with chunking for large files
- Use database indexing for verification queries
- Implement file compression and resizing

### Frontend Optimizations
- Lazy load verification components
- Implement file upload progress indicators
- Use optimistic UI updates for profile changes
- Cache verification status in context
- Implement image compression before upload

## Security Considerations

### Phone Verification Security
- Rate limit SMS sending (max 3 per 15 minutes)
- Use secure random code generation
- Implement code expiration (10 minutes)
- Log all verification attempts
- Validate phone number format and region

### File Upload Security
- Validate file types and sizes strictly
- Scan uploaded files for malware
- Use secure file storage with access controls
- Generate unique file names to prevent conflicts
- Implement file access logging

### Admin Security
- Require admin authentication for all verification actions
- Log all admin verification decisions with timestamps
- Implement admin action audit trail
- Use role-based permissions for admin functions
- Require detailed reasons for document rejections

## Deployment Checklist

### Environment Setup
- [ ] Configure Twilio SMS service with credentials
- [ ] Setup AWS S3 bucket for secure file storage
- [ ] Configure Redis for caching verification codes
- [ ] Setup Celery for background task processing
- [ ] Configure email notifications for verification events

### Security Configuration
- [ ] Enable HTTPS for all endpoints and file uploads
- [ ] Configure CORS properly for file uploads
- [ ] Setup comprehensive rate limiting
- [ ] Configure file upload size and type limits
- [ ] Enable security headers and CSP

### Monitoring Setup
- [ ] Setup error tracking (Sentry) for verification flows
- [ ] Configure logging for all verification events
- [ ] Setup performance monitoring for file uploads
- [ ] Configure backup procedures for uploaded documents
- [ ] Setup health checks for SMS and file services

This implementation plan provides a comprehensive roadmap for completing the PetCircle authentication system with all missing features, proper security measures, and scalable architecture.