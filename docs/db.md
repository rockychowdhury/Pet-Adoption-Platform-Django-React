# PetCircle Database Schema
## Django + PostgreSQL Implementation

---

## 1. USERS APP

### User (extends Django AbstractUser)
**Purpose:** Core user authentication and profile data

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| email | EmailField | UNIQUE, NOT NULL | User email (login identifier) |
| username | CharField(50) | UNIQUE, NULLABLE | User display name |
| first_name | CharField(50) | NOT NULL | User's first name |
| last_name | CharField(50) | NOT NULL | User's last name |
| password | CharField(128) | NOT NULL | Hashed password |
| role | CharField(20) | CHOICES, DEFAULT='user' | admin, moderator, service_provider, user |
| phone_number | CharField(15) | NULLABLE | Phone number |
| photoURL | URLField | NULLABLE | Profile photo URL |
| bio | TextField | MAX_LENGTH=500 | User bio |
| location_city | CharField(100) | NULLABLE | User's city |
| location_state | CharField(100) | NULLABLE | User's state |
| location_country | CharField(100) | DEFAULT='USA' | User's country |
| zip_code | CharField(10) | NULLABLE | Postal code |
| latitude | DecimalField | NULLABLE | Geo-coordinates |
| longitude | DecimalField | NULLABLE | Geo-coordinates |
| privacy_settings | JSONField | DEFAULT={} | Privacy preferences |
| email_verified | BooleanField | DEFAULT=False | Verification status |
| phone_verified | BooleanField | DEFAULT=False | Verification status |
| verified_identity | BooleanField | DEFAULT=False | Identity checked |
| pet_owner_verified | BooleanField | DEFAULT=False | Owner verified |
| is_active | BooleanField | DEFAULT=False | Account activation status |
| date_joined | DateTimeField | AUTO_NOW_ADD | Creation timestamp |

**Indexes:**
- email (unique)
- username (unique)

---

### UserTrustReview
**Purpose:** Peer-to-peer reviews for trust building

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| reviewer | ForeignKey | FK(User), CASCADE | Author of review |
| reviewee | ForeignKey | FK(User), CASCADE | Subject of review |
| rating | IntegerField | 1-5 | Trust rating |
| comment | TextField | | Review content |
| created_at | DateTimeField | AUTO_NOW_ADD | Timestamp |

**Meta:**
- unique_together: (reviewer, reviewee)

---

### RoleRequest
**Purpose:** Requests for role changes (e.g. to Service Provider)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| user | ForeignKey | FK(User), CASCADE | Requesting user |
| requested_role | CharField(20) | CHOICES | admin, service_provider, etc. |
| reason | TextField | | Justification |
| status | CharField(20) | DEFAULT='pending' | pending, approved, rejected |
| admin_notes | TextField | NULLABLE | Admin feedback |
| created_at | DateTimeField | AUTO_NOW_ADD | Timestamp |

---

## 2. PETS APP

### PetProfile
**Purpose:** Canonical source of pet truth. Independent of listings.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| owner | ForeignKey | FK(User), CASCADE | Pet owner |
| name | CharField(100) | NOT NULL | Pet's name |
| species | CharField(20) | CHOICES | dog, cat, rabbit, bird, other |
| breed | CharField(100) | BLANK | Breed or mix |
| birth_date | DateField | NULLABLE | DOB |
| gender | CharField(10) | CHOICES, DEFAULT='unknown' | male, female, unknown |
| weight_kg | DecimalField | NULLABLE | Weight in KG |
| size_category | CharField(10) | CHOICES, NULLABLE | small, medium, large |
| spayed_neutered | BooleanField | DEFAULT=False | Medical status |
| microchipped | BooleanField | DEFAULT=False | Medical status |
| status | CharField(20) | DEFAULT='active' | active, rehomed, deceased |
| description | TextField | MAX_LENGTH=1000 | General description |
| created_at | DateTimeField | AUTO_NOW_ADD | Timestamp |

### PetMedia
**Purpose:** Photos and media for a pet

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Primary Key |
| pet | ForeignKey | FK(PetProfile), CASCADE | Related pet |
| url | URLField | NOT NULL | Media URL |
| delete_url | URLField | NULLABLE | Deletion URL (optional) |
| is_primary | BooleanField | DEFAULT=False | Main display photo |
| uploaded_at | DateTimeField | AUTO_NOW_ADD | Timestamp |

### PersonalityTrait
**Purpose:** Master list of available traits

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Primary Key |
| name | CharField(50) | UNIQUE | Trait name (Friendly, Calm, etc) |

### PetPersonality
**Purpose:** Many-to-Many link between Pets and Traits

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Primary Key |
| pet | ForeignKey | FK(PetProfile), CASCADE | Related Pet |
| trait | ForeignKey | FK(PersonalityTrait), CASCADE | Related Trait |

**Meta:**
- unique_together: (pet, trait)

---

## 3. REHOMING APP

### RehomingIntervention
**Purpose:** Pre-rehoming workflow to discourage surrender

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Primary Key |
| user | ForeignKey | FK(User), CASCADE | User attempting rehoming |
| reason_category | CharField(50) | CHOICES | moving, allergies, financial, etc |
| reason_details | TextField | BLANK | Specifics |
| urgency | CharField(20) | DEFAULT='flexible' | immediate, soon, flexible |
| status | CharField(20) | DEFAULT='started' | started, cooling, acknowledged, abandoned, proceeded |
| cooling_until | DateTimeField | NULLABLE | End of cooling off |
| acknowledged_at | DateTimeField | NULLABLE | Acknowledgement timestamp |
| created_at | DateTimeField | AUTO_NOW_ADD | Timestamp |

### RehomingListing
**Purpose:** The listing context for a Rehoming event (One-To-One with PetProfile)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Primary Key |
| pet | OneToOneField | FK(PetProfile), CASCADE | The pet being rehomed |
| owner | ForeignKey | FK(User), CASCADE | Listing owner |
| reason | TextField | | Stated reason for rehoming |
| urgency | CharField(20) | CHOICES | immediate, soon, flexible |
| ideal_home_notes | TextField | BLANK | Requirements for new home |
| location_city | CharField(100) | | City snapshot |
| location_state | CharField(50) | | State snapshot |
| location_zip | CharField(20) | BLANK | Zip snapshot |
| latitude | DecimalField | NULLABLE | Geo snapshot |
| longitude | DecimalField | NULLABLE | Geo snapshot |
| privacy_level | CharField(20) | DEFAULT='public' | public, verified |
| status | CharField(20) | DEFAULT='draft' | draft, active, paused, closed |
| view_count | IntegerField | DEFAULT=0 | Analytics |
| created_at | DateTimeField | AUTO_NOW_ADD | Timestamp |
| published_at | DateTimeField | NULLABLE | Go-Live time |

### RehomingRequest (formerly AdoptionApplication)
**Purpose:** Initial contact/application for a listed pet

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Primary Key |
| listing | ForeignKey | FK(RehomingListing), CASCADE | Target listing |
| requester | ForeignKey | FK(User), CASCADE | User applying |
| message | TextField | | Intro message |
| status | CharField(20) | DEFAULT='pending' | pending, accepted, declined, withdrawn |
| created_at | DateTimeField | AUTO_NOW_ADD | Timestamp |

**Meta:**
- unique_together: (listing, requester)

---