# Traditional OTP Flow - Setup Guide

## What Changed

I've updated the WhatsApp verification to use a **traditional OTP flow**:

### Old Flow (Reverse OTP - Free but Complex)
1. User clicks link → Opens WhatsApp
2. User sends message to business number  
3. Backend receives webhook
4. System verifies code

### New Flow (Traditional OTP - Paid but Simple)
1. User enters phone number
2. Backend sends OTP to user's WhatsApp
3. User receives code on their phone
4. User enters code on website
5. Backend verifies and marks as verified

---

## Getting WhatsApp API Credentials

### Step 1: Create Meta App

1. Go to https://developers.facebook.com/apps/
2. Click **"Create App"**
3. Choose **"Business"** → Click **"Next"**
4. Fill in details:
   - App Name: `PetCircle`
   - Contact Email: Your email
5. Click **"Create App"**

### Step 2: Add WhatsApp Product

1. In your app dashboard, find **"WhatsApp"** → Click **"Set up"**
2. Select or create a Meta Business Account
3. You'll see the **API Setup** page

### Step 3: Get Your Credentials

On the **WhatsApp → API Setup** page, you'll find:

#### 1. Temporary Access Token
- Look for **"Temporary access token"** section
- Click **"Copy"** button
- This is your `WHATSAPP_ACCESS_TOKEN`
- ⚠️ **Note**: Temporary tokens expire in 24 hours. For production, create a permanent token.

#### 2. Phone Number ID  
- Look for **"From"** dropdown
- Below it, you'll see **"Phone number ID"**
- Copy this ID (it's a number like `123456789012345`)
- This is your `WHATSAPP_PHONE_NUMBER_ID`

#### 3. Test Phone Number
- You'll see a test number like `+1 555 123 4567`
- You can send messages to verified numbers for free during testing

### Step 4: Verify Your Phone (For Testing)

1. On the API Setup page, find **"To"** section
2. Click **"Manage phone number list"**
3. Add your WhatsApp number (the one you'll test with)
4. WhatsApp will send you a code to verify

### Step 5: Get App Secret (Optional but Recommended)

1. In your Meta App, go to **Settings** → **Basic**
2. Find **"App Secret"**
3. Click **"Show"** button
4. Copy the value → This is your `META_APP_SECRET`

---

## Update Your `.env` File

Edit `/backend/.env` and add these values:

```bash
# WhatsApp Verification (Meta Cloud API)
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxx  # From Step 3.1
WHATSAPP_PHONE_NUMBER_ID=123456789012345  # From Step 3.2
WHATSAPP_VERIFY_TOKEN=test_verify_token_123  # Any secret string you create
META_APP_SECRET=abc123xyz  # From Step 5 (optional)
```

**Example:**
```bash
WHATSAPP_ACCESS_TOKEN=EAABsbCS1iHgBO4ZC9VQBNaZB...
WHATSAPP_PHONE_NUMBER_ID=348572541677889
WHATSAPP_VERIFY_TOKEN=my_webhook_secret_2026
META_APP_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## Important Notes

### Free Tier Limits
- **First 1,000 conversations/month**: FREE
- After that: ~$0.005 - $0.09 per conversation (varies by country)
- A "conversation" = 24-hour window of messages

### Temporary vs Permanent Tokens

**Temporary Token** (24 hours):
- Good for quick testing
- Expires in 24 hours
- Get from API Setup page

**Permanent Token** (Never expires):
1. Go to **Meta Business Suite** → **Settings** → **Business settings**
2. Navigate to **System Users**
3. Create a system user
4. Generate a permanent token with `whatsapp_business_messaging` permission

### Webhook Setup (Still Needed)

Even with traditional OTP, you need webhook for:
- Delivery status updates
- Message status tracking

Follow the webhook setup from the previous guide if needed.

---

## Testing the Flow

### 1. Restart Django Server
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### 2. Test on Frontend
1. Go to `/dashboard/profile/settings`
2. Click **"Security"** tab
3. Enter your phone number (must be verified in Meta dashboard)
4. Click **"SendVerification Code"**
5. Check your WhatsApp for the code
6. Enter the code and verify

### 3. Troubleshooting

**Error: "WhatsApp API not configured"**
- Make sure you added credentials to `.env`
- Restart Django server

**Error: "Failed to send verification code"**
- Check if your phone number is verified in Meta dashboard
- Verify access token is valid (not expired)
- Check Django logs for detailed  error messages

**Not receiving WhatsApp message:**
- Ensure phone number is verified in Meta dashboard (**To** section)
- Check phone number format (include country code with +)
- Verify access token hasn't expired

---

## API Endpoints

### Send OTP
```
POST /api/user/request-phone-verify/
Authorization: Bearer <token>

{
  "phone_number": "+8801234567890"  // optional if already saved
}
```

### Verify OTP
```
POST /api/user/verify-phone-code/
Authorization: Bearer <token>

{
  "code": "123456"
}
```

---

## Cost Estimation

### Testing Phase (Free)
- Use test numbers
- First 1,000 conversations free
- Perfect for development

### Production
Bangladesh rates (example):
- Business-initiated conversation: ~$0.04
- User-initiated conversation: Free for 24 hours

**Monthly estimate:**
- 100 verifications/month = ~$4.00
- 500 verifications/month = ~$20.00
- 1,000 verifications/month = ~$40.00

---

## Next Steps

1. ✅ Get credentials from Meta
2. ✅ Update `.env` file
3. ✅ Restart Django server
4. ✅ Test with your verified phone number
5. 🔄 Create permanent access token (for production)
6. 🔄 Set up proper error monitoring
7. 🔄 Add rate limiting to prevent abuse

---

## Support

If you encounter issues:
- Check Meta's [WhatsApp documentation](https://developers.facebook.com/docs/whatsapp)
- Review [Cloud API reference](https://developers.facebook.com/docs/whatsapp/cloud-api)
- Check your app's logs in Meta dashboard
