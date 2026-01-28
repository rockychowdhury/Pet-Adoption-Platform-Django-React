---
description: Implementation plan for Free WhatsApp OTP Verification using Meta Cloud API (User-Initiated Flow)
---

# Implementation Plan: Free WhatsApp Verification

## Objective
Implement a phone verification system using WhatsApp that updates the user's `phone_verified` status.
**Constraint**: The service must be **free to use**.

## The "Free" Challenge & Solution
Standard "Business-Initiated" OTPs (where the server sends a code to the user) via the official WhatsApp Business API are **paid** (Authentication Category).
To ensure this feature is **100% free** for production, we will implement a **User-Initiated "Reverse OTP" Flow**.

**The Flow:**
1.  **User**: Enters/Confirms phone number in Frontend.
2.  **System**: Generates a unique verification code (OTP) and saves it to the user record.
3.  **Frontend**: Generates a "Click to Verify" link (`https://wa.me/<OUR_BIZ_NUMBER>?text=<OTP>`).
4.  **User**: Clicks link -> WhatsApp opens with pre-filled code -> User hits "Send".
5.  **WhatsApp**: Delivers the message to our Backend Webhook (Free "Service Conversation" tier, first 1000/month free, and user-initiated messages are generally low/no cost in test mode).
6.  **Backend**: Webhook receives message -> Identifies User by sender number -> Matches OTP -> Sets `phone_verified = True`.

## Step 1: Backend Model Updates
**File**: `backend/apps/users/models.py`
Add fields to `User` model to store the temporary code.
```python
phone_verification_code = models.CharField(max_length=6, blank=True, null=True)
phone_verification_sent_at = models.DateTimeField(blank=True, null=True)
```

## Step 2: Backend API Endpoints (`apps.users`)
**File**: `backend/apps/users/views.py` & `urls.py`

### 1. Initiate Verification (`POST /api/users/request-phone-verify/`)
*   **Input**: `phone_number`
*   **Logic**:
    *   Generate random 6-digit code.
    *   Save code and timestamp to `User`.
    *   Return the **WhatsApp Deep Link**: `https://wa.me/<YOUR_TEST_NUMBER>?text=Verify Code: <CODE>`

### 2. WhatsApp Webhook (`POST /api/webhooks/whatsapp/`)
*   **Input**: Payload from Meta Cloud API.
*   **Logic**:
    *   Verify Webhook Signature (Security).
    *   Extract `from` (phone number) and `body` (message text).
    *   Find User by `phone_number`.
    *   Check if `body` contains the active `phone_verification_code`.
    *   If Match: Set `phone_verified = True`, Clear code.
    *   (Optional) Send a "Success" reply via API (Free within 24hr window).

### 3. Verification Status Check (`GET /api/users/me/`)
*   Frontend already fetches user profile. Use this to poll for the `phone_verified` status change.

## Step 3: Frontend Implementation
**File**: `frontend/src/components/Verification/WhatsAppVerifier.jsx` (New)
*   UI Input for Phone Number.
*   "Verify via WhatsApp" Button.
*   On Click:
    *   Call `initiate-verify`.
    *   Open the returned `wa.me` link in new tab.
    *   Show "Waiting for confirmation..." spinner.
    *   Poll `useAuth` or Profile API every 3 seconds to check if `phone_verified` turns true.
    *   On success: Show Green Checkmark.

## Step 4: Configuration (Meta for Developers)
*   Create a Meta App (Type: Business).
*   Add **WhatsApp** product.
*   Get the **Test Phone Number**.
*   Configure **Webhook URL** to point to our public backend (Requires Tunneling like `ngrok` for local dev).

## Execution Steps
1.  Modify `User` Model & Migrate.
2.  Implement `Webhook` logic (most complex part).
3.  Implement `Initiate` logic.
4.  Create Frontend Component.
5.  Set up `ngrok` to test Webhook locally.
