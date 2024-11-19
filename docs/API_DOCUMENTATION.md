# User Management API Documentation

## 1. **User Registration**
- **Endpoint:** `/user/register/`
- **Method:** `POST`
- **Permissions:** `AllowAny`
- **Required Data:**
  ```json
  {
    "email": "user@example.com",
    "password": "string",
    "first_name": "string",
    "last_name": "string"
  }
  ```
- **Description:** Registers a new user. You must provide the user's email, password, first name, and last name.

---

## 2. **User Login (Obtain Access & Refresh Tokens)**
- **Endpoint:** `/user/token/`
- **Method:** `POST`
- **Permissions:** `AllowAny`
- **Required Data:**
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
- **Description:** Logs in a user and returns the access and refresh tokens. These tokens are used for authentication in subsequent requests.

---

## 3. **Token Refresh**
- **Endpoint:** `/user/token/refresh/`
- **Method:** `POST`
- **Permissions:** `IsAuthenticated`
- **Required Data:**
  ```json
  {
    "refresh": "refresh_token"
  }
  ```
- **Description:** Refreshes the access token using the provided refresh token. Required for getting a new access token when the old one expires.

---

## 4. **Token Verification**
- **Endpoint:** `/user/token/verify/`
- **Method:** `POST`
- **Permissions:** `IsAuthenticated`
- **Required Data:**
  ```json
  {
    "token": "access_token"
  }
  ```
- **Description:** Verifies the validity of the provided access token.

---

## 5. **User Profile**
- **Endpoint:** `/user/`
- **Method:** `GET`
- **Permissions:** `IsAuthenticated`
- **Description:** Retrieves the profile information of the authenticated user. This will include the user's email, first name, last name, etc.

---

## 6. **Update User Profile**
- **Endpoint:** `/user/update-profile/`
- **Method:** `PATCH`
- **Permissions:** `IsAuthenticated`
- **Required Data:**
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "phone_number": "string",
    "profile_picture": "string (URL)",
    "bio": "string"
  }
  ```
- **Description:** Updates the profile information of the authenticated user. You can update any of the provided fields.

---

## 7. **Deactivate User**
- **Endpoint:** `/user/deactivate/`
- **Method:** `PATCH`
- **Permissions:** `IsAuthenticated`
- **Required Data:**
  ```json
  {
    "is_active": false
  }
  ```
- **Description:** Deactivates the user's account. After deactivation, the user will no longer be able to authenticate using their access token.

---

## 8. **Activate User**
- **Endpoint:** `/user/activate/`
- **Method:** `PATCH`
- **Permissions:** `IsAuthenticated`
- **Required Data:**
  ```json
  {
    "is_active": true
  }
  ```
- **Description:** Reactivates the user's account if it was deactivated. The user will be able to authenticate again with their access token.

---

## 9. **Change User Password**
- **Endpoint:** `/user/change-password/`
- **Method:** `PATCH`
- **Permissions:** `IsAuthenticated`
- **Required Data:**
  ```json
  {
    "old_password": "string",
    "new_password": "string"
  }
  ```
- **Description:** Changes the user's password. The old password must be provided for verification.

---

## 10. **User Logout**
- **Endpoint:** `/user/logout/`
- **Method:** `POST`
- **Permissions:** `IsAuthenticated`
- **Required Data:** None
- **Description:** Logs out the authenticated user by blacklisting the refresh token.

---

## Response Codes
- **200 OK:** Request was successful.
- **201 Created:** Resource was created successfully (e.g., user registration).
- **400 Bad Request:** Invalid or missing data in the request.
- **401 Unauthorized:** Authentication required or invalid credentials.
- **403 Forbidden:** User does not have permission to perform the action.
- **404 Not Found:** The requested resource could not be found.
- **405 Method Not Allowed:** The method is not allowed for the requested URL.
- **500 Internal Server Error:** Something went wrong on the server.

---
