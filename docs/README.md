### User Model Documentation

#### Overview
The project includes a custom user model that supports role-based functionality, making it flexible for managing different types of users like **Admin**, **Pet Owner**, **Adopter**, and **Guest**. This model is implemented using Django's `AbstractBaseUser` for customization and scalability.

---

#### Key Features
1. **Custom Fields**
   - **Email (Primary Identifier):** Unique and required for every user.
   - **First Name and Last Name:** Optional for basic user details.
   - **Phone Number:** Optional contact information.
   - **Profile Picture:** URL for storing the user's profile image.
   - **Bio:** Short user description or additional details.
   - **Role:** Defines the user type, such as:
     - `Admin`
     - `Pet Owner`
     - `Adopter`
     - `Guest`

2. **Role-Based Permissions**
   - Each role is designed for specific access levels in the platform.
   - Admins have full access to all resources.
   - Pet Owners and Adopters have restricted permissions based on their role.

3. **User Status**
   - **is_active:** Indicates if the user account is active.
   - **is_staff:** Grants staff-level permissions.
   - **is_superuser:** Allows full administrative access.

4. **Custom User Manager**
   - `create_user`: For creating regular users.
   - `create_superuser`: For creating admin users with elevated permissions.

---

#### Configuration
To use the custom user model, ensure the following setting is added in your **settings.py** file:
```
AUTH_USER_MODEL = 'apps.users.User'
```

---

#### Testing
The custom user model is thoroughly tested with the following cases:
- Creating a user with valid data.
- Handling errors for missing email or invalid roles.
- Ensuring email uniqueness.
- Validating string representation of users.
- Creating superusers with appropriate permissions.

To run the tests:
```
python manage.py test apps.users
```

---

#### Notes
- The custom user model is extensible and ready for future enhancements, such as role-based API permissions and advanced user features.
- Role-based functionality ensures a clean separation of responsibilities across the platform.

---

Feel free to reach out if you encounter any issues or have suggestions for improvements!