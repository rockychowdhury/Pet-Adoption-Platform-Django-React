# PetCircle API Reference

**Base URL**: `http://localhost:8000/api/`

## Authentication & User Management
**Prefix**: `/api/user/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `token/` | Login (Returns Access/Refresh tokens + HTTPOnly Cookies) | No |
| POST | `token/refresh/` | Refresh Access Token (Uses `refresh_token` cookie) | No |
| POST | `token/verify/` | Verify Token validity | No |
| POST | `register/` | Register new user account | No |
| POST | `verify-email/` | Verify email with code | No |
| POST | `resend-email-verification/` | Resend verification code | No |
| POST | `logout/` | Logout (Blacklists token & clears cookies) | No |
| POST | `request-password-reset/` | Request password reset email | No |
| PATCH | `password-reset-confirm/` | Confirm password reset with token | No |
| GET | `user_profile/` | Get current logged-in user details | Yes |
| PATCH | `update-profile/` | Update user profile fields | Yes |
| PATCH | `change-password/` | Change password (authenticated) | Yes |
| GET | `public-profile/{id}/` | Get public profile of another user | No |
| GET, POST | `verification-documents/` | Upload/List verification docs (ID, Property, etc.) | Yes |
| GET, POST | `role-requests/` | Request role upgrade (e.g. to Service Provider) | Yes |

## Pets (User's Pet Profiles)
**Prefix**: `/api/pets/`
*Note: These are profiles owned by the user, used for Rehoming Listings.*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `profiles/` | List all pets owned by current user | Yes |
| POST | `profiles/` | Create a new pet profile | Yes |
| GET | `profiles/{id}/` | Get pet details | Yes* |
| PUT/PATCH | `profiles/{id}/` | Update pet profile | Yes (Owner) |
| DELETE | `profiles/{id}/` | Delete pet profile | Yes (Owner) |

## Rehoming Listings
**Prefix**: `/api/rehoming/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `listings/` | List all active listings (Public). Use `?owner=me` for own listings. | No / Yes |
| POST | `listings/` | Create a new rehoming listing | Yes |
| GET | `listings/{id}/` | Get listing details | No |
| PUT/PATCH | `listings/{id}/` | Update listing | Yes (Owner) |
| DELETE | `listings/{id}/` | Delete listing | Yes (Owner) |

**Filters (`GET /listings/`):**
- `species`: dog, cat, rabbit, bird, other
- `age_range`: baby, young, adult, senior
- `gender`: male, female
- `size`: xs, small, medium, large, xl
- `urgency_level`: immediate, 1_month, etc.
- `search`: text search (name, breed, location)
- `owner`: `me` (Requires Auth)

## Services (Vets, Fosters, Trainers)
**Prefix**: `/api/services/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `providers/` | List service providers | No |
| POST | `providers/` | Register as a service provider (Create profile) | Yes |
| GET | `providers/{id}/` | Get provider details | No |
| PATCH | `providers/{id}/` | Update provider profile | Yes (Owner) |
| POST | `providers/{id}/review/`| Submit a review for a provider | Yes |

**Filters (`GET /providers/`):**
- `provider_type`: vet, foster, trainer
- `location_city`: City name
- `services`: Service keyword
- `species`: Species accepted

## Community (Groups, Posts, Events)
**Prefix**: `/api/community/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET, POST | `groups/` | List/Create Groups | Yes* |
| GET, PUT | `groups/{id}/` | Group details | Yes* |
| GET, POST | `posts/` | List/Create Posts | Yes* |
| GET, DEL | `posts/{id}/` | Post details | Yes* |
| POST | `posts/{id}/comment/` | Add comment to post | Yes |
| GET, POST | `events/` | List/Create Events | Yes* |

## Messaging
**Prefix**: `/api/messaging/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `conversations/` | List recent conversations (w/ last message) | Yes |
| POST | `conversations/` | Start/Find conversation. Body: `{"participants": [userId]}` | Yes |
| GET | `conversations/{id}/` | Get messages in a conversation | Yes |

## Notifications
**Prefix**: `/api/notifications/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/` | List notifications (recent) | Yes |
| POST | `mark_all_read/` | Mark all as read | Yes |
| POST | `{id}/mark_read/` | Mark specific notification as read | Yes |
| POST | `{id}/dismiss/` | Dismiss notification | Yes |

## Analytics (Admin)
**Prefix**: `/api/analytics/`
*Access strictly limited to Admin users.*
