# Authentication System Design Document

## Architecture Overview

The PetCircle authentication system follows a modern, secure architecture using JWT tokens stored in httpOnly cookies, with a multi-step verification process and comprehensive user management.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │    │   (Django)      │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ AuthContext     │◄──►│ JWT Auth        │    │ Email Service   │
│ Protected Routes│    │ Cookie Manager  │    │ SMS Service     │
│ Form Validation │    │ Rate Limiting   │    │ File Storage    │
│ State Management│    │ User Management │    │ Image Processing│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Current Implementation Status

### ✅ Implemented Features

#### Backend Components

**1. Authentication System**
```python
class CookieJWTAuthentication(JWTAuthentication):
    """Custom JWT authentication using httpOnly cookies"""
    
class CustomTokenObtainPairView(TokenObtainPairView):
    """Login endpoint with cookie-based token storage"""
    
class CustomTokenRefreshView(APIView):
    """Token refresh using httpOnly cookies"""
```

**2. User Management System**
```python
class User(AbstractBaseUser, PermissionsMixin):
    """Extended user model with verification fields"""
    # ✅ Comprehensive user model with all required fields
    # ✅ Role-based system (admin, pet_owner, adopter, service_provider)
    # ✅ Verification fields for email, phone, identity, pet ownership
    # ✅ Account status management
    
class UserProfile(models.Model):
    """User profile with privacy settings"""
    # ✅ Privacy settings JSON field
    # ✅ Verification badges system
    
class VerificationDocument(models.Model):
    """Document verification system"""
    # ✅ Model exists but limited functionality
```

**3. Email Verification System**
```python
class VerifyEmailView(APIView):
    """Email verification with 6-digit codes"""
    # ✅ Code generation and validation
    # ✅ Email sending functionality
    # ✅ Expiration handling (15 minutes)
    
class ResendEmailVerificationView(APIView):
    """Resend email verification codes"""
    # ✅ Rate limiting (3 per 15 minutes)
    # ✅ Proper throttling implementation
```

#### Frontend Components

**1. Authentication Context**
```jsx
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  verifyEmail: () => {},
  // ❌ Missing: verifyPhone, uploadDocument
});
```

**2. Authentication Pages**
```jsx
// ✅ Implemented
<LoginPage />           // Complete with form validation
<RegisterPage />        // Complete with password strength
<VerifyEmailPage />     // Complete with code input
<ForgotPasswordPage />  // Complete password reset flow
<ResetPasswordPage />   // Complete reset confirmation

// ❌ Missing
<VerifyPhonePage />
<ProfileSettingsPage />
<DocumentUploadPage />
```

**3. UI Components**
```jsx
// ✅ Implemented
<DarkInput />                    // Form input component
<DarkButton />                   // Button component
<CodeInput />                    // 6-digit code input
<FeatureCarousel />              // Auth page carousel

// ❌ Missing
<PhoneInput />
<FileUpload />
<DocumentPreview />
<VerificationBadge />
```

### ❌ Missing Features

#### 1. Phone Verification System

**Backend Missing:**
```python
# Need to implement:
class PhoneVerification(models.Model):
    user = ForeignKey(User, on_delete=CASCADE)
    phone_number = CharField(max_length=20)
    code = CharField(max_length=6)
    created_at = DateTimeField(auto_now_add=True)
    expires_at = DateTimeField()
    is_used = BooleanField(default=False)

class SendPhoneVerificationView(APIView):
    """Send SMS verification code"""
    
class VerifyPhoneView(APIView):
    """Verify SMS code"""
    
class ResendPhoneVerificationView(APIView):
    """Resend SMS code"""

# SMS service integration (Twilio/AWS SNS)
class SMSService:
    def send_verification_code(self, phone_number, code)
```

**Frontend Missing:**
```jsx
// Need to implement:
<PhoneVerificationPage />
<PhoneInput /> component with international formatting
// Phone verification in AuthContext
const verifyPhone = async (code) => {
  // Implementation needed
};
```

#### 2. File Upload System

**Backend Missing:**
```python
# Need to implement:
class DocumentUploadView(APIView):
    """Handle document uploads for verification"""
    
class ProfilePhotoUploadView(APIView):
    """Handle profile photo uploads"""
    
# File storage configuration (AWS S3/local)
# Image processing and validation
class FileValidator:
    def validate_file_type(self, file)
    def validate_file_size(self, file)
    def process_image(self, file)
```

**Frontend Missing:**
```jsx
// Need to implement:
<FileUpload /> component with drag-and-drop
<DocumentUpload /> component for verification docs
<ProfilePhotoUpload /> component
// File preview and validation
const uploadDocument = async (file, type) => {
  // Implementation needed
};
```

#### 3. Admin Verification Workflow

**Backend Missing:**
```python
# Need to implement:
class AdminVerificationQueueView(APIView):
    """List pending verification documents"""
    
class DocumentReviewView(APIView):
    """Admin document review interface"""
    
class ApproveDocumentView(APIView):
    """Approve verification document"""
    
class RejectDocumentView(APIView):
    """Reject verification document with reason"""
    
# Notification system for verification status
class VerificationNotificationService:
    def notify_user_approved(self, user)
    def notify_user_rejected(self, user, reason)
```

**Frontend Missing:**
```jsx
// Need to implement:
<AdminVerificationQueue />
<DocumentReviewModal />
<VerificationActions />
<AdminDashboard />

// User-facing components
<VerificationStatus />
<VerificationBadges />
<DocumentUploadStatus />
```

#### 4. Enhanced Profile Management

**Backend Partially Implemented:**
```python
# ✅ Basic profile update exists
class UserProfileUpdateView(APIView):
    # ✅ Basic user field updates
    # ❌ Missing comprehensive privacy settings
    # ❌ No profile photo upload handling
    # ❌ Limited verification document management
```

**Frontend Missing:**
```jsx
// Need to implement:
<ProfileSettingsPage />
<PersonalInformationForm />
<PrivacySettingsForm />
<SecuritySettingsForm />
<AccountManagementForm />
```

## Data Models Analysis

### Current User Model
```python
class User(AbstractBaseUser, PermissionsMixin):
    # ✅ Well-designed with all required fields
    email = EmailField(unique=True)
    phone_number = CharField(max_length=15, blank=True, null=True)
    
    # ✅ Verification fields exist
    email_verified = BooleanField(default=False)
    phone_verified = BooleanField(default=False)
    verified_identity = BooleanField(default=False)
    pet_owner_verified = BooleanField(default=False)
    
    # ✅ Verification code fields exist
    verification_code = CharField(max_length=6, blank=True, null=True)
    verification_code_expires_at = DateTimeField(blank=True, null=True)
    phone_verification_code = CharField(max_length=6, blank=True, null=True)
    phone_verification_code_expires_at = DateTimeField(blank=True, null=True)
    
    # ✅ Role and status management
    role = CharField(max_length=20, choices=UserRole.choices)
    account_status = CharField(max_length=20, choices=AccountStatus.choices)
```

### Missing Models
```python
# Need to implement:
class PhoneVerification(models.Model):
    """Separate phone verification tracking"""
    
class LoginAttempt(models.Model):
    """Track failed login attempts for security"""
    
class UserSession(models.Model):
    """Track user sessions for security"""
```

## API Endpoints Analysis

### ✅ Implemented Endpoints
```
POST /user/register/                    # ✅ Complete
POST /user/token/                       # ✅ Complete (login)
POST /user/token/refresh/               # ✅ Complete
POST /user/logout/                      # ✅ Complete
POST /user/verify-email/                # ✅ Complete
POST /user/resend-email-verification/   # ✅ Complete
POST /user/request-password-reset/      # ✅ Complete
POST /user/password-reset-confirm/      # ✅ Complete
GET  /user/                            # ✅ Complete (profile)
PATCH /user/update-profile/            # ✅ Partial
```

### ❌ Missing Endpoints
```
POST /user/send-phone-verification/     # ❌ Missing
POST /user/verify-phone/                # ❌ Missing
POST /user/resend-phone-verification/   # ❌ Missing
POST /user/upload-document/             # ❌ Missing
POST /user/upload-profile-photo/        # ❌ Missing
GET  /user/verification-status/         # ❌ Missing
DELETE /user/                          # ❌ Missing (account deletion)

# Admin endpoints
GET  /admin-panel/verification-queue/   # ❌ Missing
POST /admin-panel/approve-document/     # ❌ Missing
POST /admin-panel/reject-document/      # ❌ Missing
```

## Security Implementation Analysis

### ✅ Current Security Features

**JWT Token Security**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),  # ✅ Short-lived
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),     # ✅ Reasonable
    'ROTATE_REFRESH_TOKENS': False,                  # ⚠️ Should be True
    'BLACKLIST_AFTER_ROTATION': False,               # ⚠️ Should be True
    'ALGORITHM': 'HS256',                           # ✅ Secure
}
```

**Rate Limiting**
```python
'DEFAULT_THROTTLE_RATES': {
    'anon': '100/hour',                    # ✅ Reasonable
    'user': '1000/hour',                   # ✅ Reasonable
    'registration': '5/hour',              # ✅ Good
    'login': '10/hour',                    # ✅ Good
    'password_reset': '3/hour',            # ✅ Good
    'resend_verification': '3/15min',      # ✅ Good
}
```

**Cookie Security**
```python
# ✅ Proper httpOnly cookie implementation
response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,        # ✅ Prevents XSS
    samesite="None",      # ✅ For cross-origin
    secure=True,          # ✅ HTTPS only
    max_age=15*60,        # ✅ Short expiration
)
```

### ❌ Missing Security Features

**Account Security**
- No account lockout after failed attempts
- No suspicious activity detection
- No device tracking
- No two-factor authentication support
- No session management

**File Upload Security**
- No file type validation
- No malware scanning
- No file size limits
- No secure file storage configuration

## Frontend State Management Analysis

### ✅ Current AuthContext Implementation
```jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Well-implemented methods
  const login = async (credentials) => { /* ✅ Complete */ };
  const register = async (data) => { /* ✅ Complete */ };
  const verifyEmail = async (email, code) => { /* ✅ Complete */ };
  const logout = async () => { /* ✅ Complete */ };
  
  // ❌ Missing methods
  const verifyPhone = async (code) => { /* ❌ Missing */ };
  const uploadDocument = async (file, type) => { /* ❌ Missing */ };
  const updateProfile = async (data) => { /* ❌ Partial */ };
};
```

### ❌ Missing Frontend Features

**Route Protection**
```jsx
// ✅ Basic protection exists
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  // ❌ Missing: role-based protection
  // ❌ Missing: verification status checks
};
```

**Form Validation**
```jsx
// ✅ Good password strength validation
// ✅ Real-time form validation
// ❌ Missing: phone number validation
// ❌ Missing: file upload validation
```

## Performance Considerations

### ✅ Current Optimizations
- Proper loading states in frontend
- Efficient JWT token refresh
- Rate limiting to prevent abuse
- Lazy loading of auth components

### ❌ Missing Optimizations
- No Redis caching for verification codes
- No Celery for background tasks (email/SMS)
- No file compression and optimization
- No database indexing optimization

## Deployment Configuration

### ✅ Current Configuration
```python
# ✅ Environment-based settings
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=True, cast=bool)

# ✅ Email configuration
EMAIL_BACKEND = config('EMAIL_BACKEND')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')

# ✅ CORS configuration
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

### ❌ Missing Configuration
```python
# ❌ Missing: SMS service configuration
TWILIO_ACCOUNT_SID = config('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = config('TWILIO_AUTH_TOKEN')

# ❌ Missing: File storage configuration
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')

# ❌ Missing: Redis configuration for caching
REDIS_URL = config('REDIS_URL')
```

## Testing Strategy

### ❌ Missing Tests
```python
# Backend tests needed:
class PhoneVerificationTestCase(TestCase):
    def test_send_phone_verification(self)
    def test_verify_phone_code(self)
    def test_phone_verification_rate_limiting(self)

class DocumentUploadTestCase(TestCase):
    def test_document_upload(self)
    def test_file_validation(self)
    def test_document_security(self)

class AdminVerificationTestCase(TestCase):
    def test_admin_queue(self)
    def test_document_approval(self)
    def test_document_rejection(self)
```

```jsx
// Frontend tests needed:
describe('Phone Verification', () => {
  test('sends verification code', async () => {});
  test('validates phone number format', () => {});
  test('handles verification errors', () => {});
});

describe('Document Upload', () => {
  test('uploads document successfully', async () => {});
  test('validates file types', () => {});
  test('shows upload progress', () => {});
});
```

## Implementation Priority

### High Priority (Critical Gaps)
1. **Phone Verification System** - Core security feature
2. **File Upload Infrastructure** - Required for verification
3. **Admin Verification Workflow** - Platform trust system

### Medium Priority (Important Features)
4. **Enhanced Profile Management** - User experience
5. **Security Improvements** - Account protection
6. **Performance Optimizations** - Scalability

### Low Priority (Nice to Have)
7. **Advanced Authentication** - 2FA, social auth
8. **Analytics and Monitoring** - Usage tracking
9. **Advanced Security** - Device management

## Conclusion

The current authentication system provides a solid foundation with:
- ✅ Secure JWT implementation with httpOnly cookies
- ✅ Comprehensive user model design
- ✅ Email verification system
- ✅ Rate limiting and basic security
- ✅ Modern React frontend with good UX

However, significant gaps remain:
- ❌ No phone verification (25% of verification system missing)
- ❌ No file upload system (document verification impossible)
- ❌ No admin verification workflow (trust system incomplete)
- ❌ Limited profile management (user experience gaps)

**Estimated Completion:** 70% implemented, 30% remaining
**Critical Path:** Phone verification → File uploads → Admin workflow

This design document provides the complete technical architecture for both current implementation and missing components needed to complete the PetCircle authentication system.