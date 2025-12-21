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
| username | CharField(150) | UNIQUE, NOT NULL | Unique username |
| first_name | CharField(150) | NOT NULL | User's first name |
| last_name | CharField(150) | NOT NULL | User's last name |
| password | CharField(128) | NOT NULL | Hashed password (Django handles) |
| role | CharField(20) | CHOICES, DEFAULT='pet_owner' | pet_owner, service_provider, admin, moderator |
| phone | CharField(20) | NULLABLE | Phone number |
| phone_verified | BooleanField | DEFAULT=False | Phone verification status |
| email_verified | BooleanField | DEFAULT=False | Email verification status |
| location_city | CharField(100) | NULLABLE | User's city |
| location_state | CharField(50) | NULLABLE | User's state/province |
| location_country | CharField(50) | DEFAULT='US' | User's country |
| latitude | DecimalField(9,6) | NULLABLE | Geo-coordinates for location |
| longitude | DecimalField(9,6) | NULLABLE | Geo-coordinates for location |
| account_status | CharField(20) | CHOICES, DEFAULT='active' | active, suspended, banned |
| is_active | BooleanField | DEFAULT=True | Django standard field |
| is_staff | BooleanField | DEFAULT=False | Django admin access |
| is_superuser | BooleanField | DEFAULT=False | Django superuser |
| date_joined | DateTimeField | AUTO_NOW_ADD | Account creation timestamp |
| last_login | DateTimeField | NULLABLE | Last login timestamp |
| created_at | DateTimeField | AUTO_NOW_ADD | Record creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Indexes:**
- email (unique)
- username (unique)
- location_city, location_state (composite for geo search)
- account_status
- role

---

### UserProfile (OneToOne with User)
**Purpose:** Extended user profile information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| user | OneToOneField | FK(User), CASCADE | Link to User model |
| bio | TextField | MAX_LENGTH=500, NULLABLE | User bio/description |
| profile_photo | ImageField | NULLABLE | Profile photo (stored in S3) |
| profile_photo_url | URLField | NULLABLE | CDN URL for profile photo |
| privacy_settings | JSONField | DEFAULT={} | Privacy preferences (JSON) |
| notification_preferences | JSONField | DEFAULT={} | Notification settings (JSON) |
| verification_badges | JSONField | DEFAULT={} | Verification status badges |
| activity_stats | JSONField | DEFAULT={} | Cached stats (posts, adoptions, etc.) |
| readiness_score | IntegerField | DEFAULT=0, 0-100 | Adopter readiness score |
| created_at | DateTimeField | AUTO_NOW_ADD | Record creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Privacy Settings JSON Structure:**
```json
{
  "profile_visibility": "public",  // public, friends, private
  "show_email": false,
  "show_phone": false,
  "show_location": true
}
```

**Verification Badges JSON Structure:**
```json
{
  "email_verified": true,
  "phone_verified": true,
  "identity_verified": false,
  "pet_owner_verified": false,
  "trusted_member": false,
  "background_checked": false
}
```

**Indexes:**
- user_id (unique)

---

### VerificationDocument
**Purpose:** Store uploaded verification documents

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| user | ForeignKey | FK(User), CASCADE | Document owner |
| document_type | CharField(50) | CHOICES | government_id, pet_ownership, business_license, insurance_cert |
| document_file | FileField | NOT NULL | Uploaded document (PDF/image) |
| document_url | URLField | NULLABLE | CDN URL |
| status | CharField(20) | CHOICES, DEFAULT='pending' | pending, approved, rejected |
| rejection_reason | TextField | NULLABLE | Admin notes if rejected |
| verified_by | ForeignKey | FK(User), NULLABLE | Admin who verified |
| submitted_at | DateTimeField | AUTO_NOW_ADD | Submission timestamp |
| reviewed_at | DateTimeField | NULLABLE | Review timestamp |

**Indexes:**
- user_id
- status

---

### AdopterProfile (OneToOne with User)
**Purpose:** Extended profile for pet adopters

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| user | OneToOneField | FK(User), CASCADE | Link to User model |
| housing_type | CharField(50) | CHOICES | house, apartment, condo, other |
| own_or_rent | CharField(10) | CHOICES | own, rent |
| landlord_approval | BooleanField | DEFAULT=False | If renting, landlord approved |
| landlord_document | FileField | NULLABLE | Proof of landlord approval |
| yard_type | CharField(50) | CHOICES, NULLABLE | fenced, unfenced, none |
| yard_size | CharField(50) | NULLABLE | Yard size description |
| num_adults | IntegerField | DEFAULT=1 | Number of adults in household |
| num_children | IntegerField | DEFAULT=0 | Number of children |
| children_ages | JSONField | DEFAULT=[] | Array of children's ages |
| current_pets | JSONField | DEFAULT=[] | Array of current pet details |
| pet_experience | JSONField | DEFAULT={} | Pet ownership experience |
| work_schedule | CharField(100) | NULLABLE | Work schedule description |
| hours_away_daily | IntegerField | NULLABLE | Hours away from home daily |
| activity_level | IntegerField | CHOICES, 1-5 | Household activity level |
| exercise_commitment | IntegerField | NULLABLE | Hours/day for pet exercise |
| travel_frequency | CharField(50) | CHOICES | rarely, monthly, weekly |
| references | JSONField | DEFAULT=[] | Array of reference contacts |
| veterinarian_reference | JSONField | NULLABLE | Vet reference details |
| why_adopt | TextField | NOT NULL | Essay on why adopting |
| readiness_score | IntegerField | DEFAULT=0 | Auto-calculated score (0-100) |
| created_at | DateTimeField | AUTO_NOW_ADD | Record creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Current Pets JSON Structure:**
```json
[
  {
    "species": "dog",
    "breed": "Labrador",
    "age": 5,
    "spayed_neutered": true,
    "vaccinated": true
  }
]
```

**References JSON Structure:**
```json
[
  {
    "type": "personal",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "relationship": "Friend"
  }
]
```

**Indexes:**
- user_id (unique)

---

## 2. PETS APP

### PetProfile
**Purpose:** Pet profiles created by users

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| owner | ForeignKey | FK(User), CASCADE | Pet owner |
| name | CharField(100) | NOT NULL | Pet's name |
| species | CharField(50) | CHOICES | dog, cat, rabbit, bird, other |
| breed | CharField(100) | NULLABLE | Breed (or mixed) |
| age | IntegerField | NULLABLE | Age in years |
| birth_date | DateField | NULLABLE | Exact birth date if known |
| gender | CharField(10) | CHOICES | male, female, unknown |
| weight | DecimalField(5,2) | NULLABLE | Weight in pounds |
| size_category | CharField(20) | CHOICES | xs, small, medium, large, xl |
| photos | JSONField | DEFAULT=[] | Array of photo URLs |
| description | TextField | MAX_LENGTH=500 | Pet description |
| personality_traits | JSONField | DEFAULT=[] | Array of traits |
| gotcha_day | DateField | NULLABLE | Adoption anniversary |
| health_status | TextField | NULLABLE | Health notes |
| is_spayed_neutered | BooleanField | DEFAULT=False | Spay/neuter status |
| is_microchipped | BooleanField | DEFAULT=False | Microchip status |
| microchip_number | CharField(50) | NULLABLE | Microchip ID |
| is_active | BooleanField | DEFAULT=True | Active profile (not deceased) |
| is_for_rehoming | BooleanField | DEFAULT=False | Linked to rehoming listing |
| created_at | DateTimeField | AUTO_NOW_ADD | Record creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Photos JSON Structure:**
```json
[
  {
    "url": "https://cdn.example.com/pet123_1.jpg",
    "caption": "Playing in the park",
    "order": 1
  }
]
```

**Indexes:**
- owner_id
- species
- is_active
- created_at

---

## 3. COMMUNITY APP

### Post
**Purpose:** Social feed posts

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| author | ForeignKey | FK(User), CASCADE | Post creator |
| content | TextField | MAX_LENGTH=5000 | Post text content |
| post_type | CharField(20) | CHOICES, DEFAULT='standard' | standard, question, story, poll, event, lost_pet, success_story |
| media_urls | JSONField | DEFAULT=[] | Array of media URLs |
| location | CharField(200) | NULLABLE | Location text |
| latitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| longitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| privacy_level | CharField(20) | CHOICES, DEFAULT='public' | public, friends, group_only, private |
| tagged_pets | ManyToManyField | PetProfile | Pets tagged in post |
| tagged_users | ManyToManyField | User | Users tagged in post |
| group | ForeignKey | FK(Group), NULLABLE, SET_NULL | If posted in group |
| is_pinned | BooleanField | DEFAULT=False | Pinned post (group/profile) |
| is_deleted | BooleanField | DEFAULT=False | Soft delete flag |
| view_count | IntegerField | DEFAULT=0 | View counter |
| share_count | IntegerField | DEFAULT=0 | Share counter |
| created_at | DateTimeField | AUTO_NOW_ADD | Post timestamp |
| updated_at | DateTimeField | AUTO_NOW | Last edit timestamp |
| expires_at | DateTimeField | NULLABLE | For story posts (24hr) |

**Indexes:**
- author_id
- post_type
- created_at (DESC for feed)
- group_id
- privacy_level

---

### Comment
**Purpose:** Comments on posts

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| post | ForeignKey | FK(Post), CASCADE | Parent post |
| author | ForeignKey | FK(User), CASCADE | Comment author |
| content | TextField | MAX_LENGTH=2000 | Comment text |
| parent_comment | ForeignKey | FK(Comment), NULLABLE, CASCADE | For nested replies (3 levels max) |
| media_url | URLField | NULLABLE | Optional image/GIF |
| is_deleted | BooleanField | DEFAULT=False | Soft delete flag |
| created_at | DateTimeField | AUTO_NOW_ADD | Comment timestamp |
| updated_at | DateTimeField | AUTO_NOW | Last edit timestamp |

**Indexes:**
- post_id
- author_id
- parent_comment_id
- created_at

---

### Reaction
**Purpose:** Reactions to posts and comments

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| user | ForeignKey | FK(User), CASCADE | User who reacted |
| content_type | ForeignKey | ContentType | Generic relation |
| object_id | PositiveIntegerField | | Generic relation ID |
| reaction_type | CharField(20) | CHOICES | like, love, care, wow, sad, funny |
| created_at | DateTimeField | AUTO_NOW_ADD | Reaction timestamp |

**Meta:**
- unique_together: (user, content_type, object_id)
- Generic Foreign Key for Post or Comment

**Indexes:**
- user_id
- content_type + object_id
- reaction_type

---

### Group
**Purpose:** Community groups

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| name | CharField(200) | UNIQUE, NOT NULL | Group name |
| description | TextField | MAX_LENGTH=1000 | Group description |
| group_type | CharField(20) | CHOICES, DEFAULT='public' | public, private, official |
| category | CharField(50) | CHOICES, NULLABLE | Species, location, interest |
| cover_photo | ImageField | NULLABLE | Group cover image |
| cover_photo_url | URLField | NULLABLE | CDN URL |
| admin | ForeignKey | FK(User), SET_NULL, NULLABLE | Group creator/admin |
| moderators | ManyToManyField | User (related_name='moderated_groups') | Group moderators |
| members | ManyToManyField | User (through='GroupMembership') | Group members |
| location_city | CharField(100) | NULLABLE | Location-based groups |
| location_state | CharField(50) | NULLABLE | Location-based groups |
| rules | TextField | NULLABLE | Group rules/guidelines |
| is_verified | BooleanField | DEFAULT=False | Official/verified group |
| member_count | IntegerField | DEFAULT=0 | Cached member count |
| post_count | IntegerField | DEFAULT=0 | Cached post count |
| is_active | BooleanField | DEFAULT=True | Active status |
| created_at | DateTimeField | AUTO_NOW_ADD | Group creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Indexes:**
- name (unique)
- group_type
- category
- location_city, location_state
- is_active

---

### GroupMembership (Through Table)
**Purpose:** Group membership with roles

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| group | ForeignKey | FK(Group), CASCADE | Group reference |
| user | ForeignKey | FK(User), CASCADE | Member reference |
| role | CharField(20) | CHOICES, DEFAULT='member' | admin, moderator, member |
| status | CharField(20) | CHOICES, DEFAULT='active' | active, pending, banned |
| joined_at | DateTimeField | AUTO_NOW_ADD | Membership start |
| updated_at | DateTimeField | AUTO_NOW | Last update |

**Meta:**
- unique_together: (group, user)

**Indexes:**
- group_id
- user_id
- status

---

### Event
**Purpose:** Community events (meetups, playdates)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| organizer | ForeignKey | FK(User), CASCADE | Event creator |
| group | ForeignKey | FK(Group), NULLABLE, SET_NULL | If group event |
| title | CharField(200) | NOT NULL | Event title |
| description | TextField | MAX_LENGTH=2000 | Event details |
| event_type | CharField(50) | CHOICES | playdate, meetup, charity, training, other |
| location_name | CharField(200) | NULLABLE | Venue name |
| location_address | CharField(300) | NULLABLE | Full address |
| latitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| longitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| start_time | DateTimeField | NOT NULL | Event start |
| end_time | DateTimeField | NOT NULL | Event end |
| max_attendees | IntegerField | NULLABLE | Capacity limit |
| cover_photo | ImageField | NULLABLE | Event image |
| cover_photo_url | URLField | NULLABLE | CDN URL |
| attendees | ManyToManyField | User (through='EventRSVP') | Event attendees |
| rsvp_count | IntegerField | DEFAULT=0 | Cached RSVP count |
| is_cancelled | BooleanField | DEFAULT=False | Cancellation status |
| created_at | DateTimeField | AUTO_NOW_ADD | Event creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Indexes:**
- organizer_id
- group_id
- start_time
- event_type
- is_cancelled

---

### EventRSVP (Through Table)
**Purpose:** Event RSVP status

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| event | ForeignKey | FK(Event), CASCADE | Event reference |
| user | ForeignKey | FK(User), CASCADE | User reference |
| status | CharField(20) | CHOICES, DEFAULT='going' | going, maybe, not_going |
| num_guests | IntegerField | DEFAULT=0 | Additional guests |
| rsvp_at | DateTimeField | AUTO_NOW_ADD | RSVP timestamp |
| updated_at | DateTimeField | AUTO_NOW | Last update |

**Meta:**
- unique_together: (event, user)

**Indexes:**
- event_id
- user_id
- status

---

### Poll
**Purpose:** Poll posts with options

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| post | OneToOneField | FK(Post), CASCADE | Link to post |
| question | CharField(300) | NOT NULL | Poll question |
| duration_days | IntegerField | DEFAULT=7 | Poll duration |
| expires_at | DateTimeField | NOT NULL | Poll end time |
| is_closed | BooleanField | DEFAULT=False | Poll closed |
| total_votes | IntegerField | DEFAULT=0 | Cached vote count |
| created_at | DateTimeField | AUTO_NOW_ADD | Poll creation |

**Indexes:**
- post_id (unique)
- expires_at

---

### PollOption
**Purpose:** Individual poll choices

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| poll | ForeignKey | FK(Poll), CASCADE | Parent poll |
| option_text | CharField(200) | NOT NULL | Option text |
| vote_count | IntegerField | DEFAULT=0 | Cached vote count |
| order | IntegerField | DEFAULT=0 | Display order |

**Indexes:**
- poll_id
- order

---

### PollVote
**Purpose:** User votes on polls

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| poll | ForeignKey | FK(Poll), CASCADE | Poll reference |
| option | ForeignKey | FK(PollOption), CASCADE | Selected option |
| user | ForeignKey | FK(User), CASCADE | Voter |
| voted_at | DateTimeField | AUTO_NOW_ADD | Vote timestamp |

**Meta:**
- unique_together: (poll, user)

**Indexes:**
- poll_id
- user_id
- option_id

---

## 4. SERVICES APP

### ServiceProvider
**Purpose:** Service provider businesses

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| user | OneToOneField | FK(User), CASCADE | Owner account |
| business_name | CharField(200) | NOT NULL | Business name |
| business_type | CharField(50) | CHOICES | foster_care, veterinary, trainer, groomer |
| description | TextField | MAX_LENGTH=2000 | Business description |
| address_line1 | CharField(200) | NOT NULL | Street address |
| address_line2 | CharField(200) | NULLABLE | Apt/Suite |
| city | CharField(100) | NOT NULL | City |
| state | CharField(50) | NOT NULL | State/Province |
| zip_code | CharField(20) | NOT NULL | Postal code |
| country | CharField(50) | DEFAULT='US' | Country |
| latitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| longitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| phone | CharField(20) | NOT NULL | Business phone |
| email | EmailField | NOT NULL | Business email |
| website | URLField | NULLABLE | Business website |
| license_number | CharField(100) | NULLABLE | License/registration |
| insurance_info | TextField | NULLABLE | Insurance details |
| insurance_certificate | FileField | NULLABLE | Proof of insurance |
| verification_status | CharField(20) | CHOICES, DEFAULT='pending' | pending, verified, suspended, rejected |
| verification_notes | TextField | NULLABLE | Admin notes |
| verified_by | ForeignKey | FK(User), NULLABLE, SET_NULL | Admin who verified |
| verified_at | DateTimeField | NULLABLE | Verification timestamp |
| is_featured | BooleanField | DEFAULT=False | Featured listing |
| subscription_tier | CharField(20) | CHOICES, DEFAULT='free' | free, basic, premium |
| subscription_expires | DateField | NULLABLE | Subscription end date |
| average_rating | DecimalField(3,2) | DEFAULT=0 | Cached rating (0-5) |
| review_count | IntegerField | DEFAULT=0 | Cached review count |
| is_active | BooleanField | DEFAULT=True | Active listing |
| created_at | DateTimeField | AUTO_NOW_ADD | Registration date |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Indexes:**
- user_id (unique)
- business_type
- city, state, zip_code (composite for geo search)
- verification_status
- is_active
- average_rating

---

### FosterService (extends ServiceProvider)
**Purpose:** Foster care specific details

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| provider | OneToOneField | FK(ServiceProvider), CASCADE | Parent provider |
| species_accepted | JSONField | DEFAULT=[] | Array of species accepted |
| max_capacity | IntegerField | DEFAULT=1 | Maximum pets at once |
| current_availability | CharField(20) | CHOICES, DEFAULT='available' | available, limited, full |
| available_spots | IntegerField | DEFAULT=0 | Current open spots |
| care_type | JSONField | DEFAULT=[] | Types of care offered |
| environment_type | CharField(50) | CHOICES | home_based, facility |
| has_fenced_yard | BooleanField | DEFAULT=False | Fenced yard availability |
| yard_size_sqft | IntegerField | NULLABLE | Yard size |
| has_other_pets | BooleanField | DEFAULT=False | Other pets in home |
| other_pets_details | TextField | NULLABLE | Details on other pets |
| has_children | BooleanField | DEFAULT=False | Children in household |
| children_ages | JSONField | DEFAULT=[] | Ages of children |
| is_smoking_home | BooleanField | DEFAULT=False | Smoking environment |
| has_climate_control | BooleanField | DEFAULT=True | A/C and heating |
| care_standards | JSONField | DEFAULT={} | Care routine details |
| daily_rate | DecimalField(6,2) | NULLABLE | Cost per day |
| weekly_rate | DecimalField(7,2) | NULLABLE | Cost per week |
| monthly_rate | DecimalField(8,2) | NULLABLE | Cost per month |
| additional_fees | JSONField | DEFAULT={} | Extra fees (meds, special needs) |
| deposit_required | DecimalField(7,2) | DEFAULT=0 | Security deposit |
| cancellation_policy | TextField | NULLABLE | Cancellation terms |
| photos | JSONField | DEFAULT=[] | Array of photo URLs |
| video_tour_url | URLField | NULLABLE | Virtual tour video |
| created_at | DateTimeField | AUTO_NOW_ADD | Record creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Species Accepted JSON:**
```json
["dog", "cat", "rabbit", "bird"]
```

**Care Standards JSON:**
```json
{
  "daily_exercise_hours": 2,
  "feeding_schedule": "twice daily",
  "medication_admin": true,
  "special_diet": true,
  "grooming_included": false,
  "daily_updates": true
}
```

**Indexes:**
- provider_id (unique)
- current_availability

---

### VeterinaryClinic (extends ServiceProvider)
**Purpose:** Veterinary clinic specific details

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| provider | OneToOneField | FK(ServiceProvider), CASCADE | Parent provider |
| clinic_type | CharField(50) | CHOICES | general, emergency, specialty, mobile |
| specializations | JSONField | DEFAULT=[] | Array of specialties |
| services_offered | JSONField | DEFAULT=[] | Array of services |
| species_treated | JSONField | DEFAULT=[] | Species accepted |
| hours_of_operation | JSONField | DEFAULT={} | Operating hours by day |
| is_24_hour | BooleanField | DEFAULT=False | 24/7 emergency |
| accepts_walk_ins | BooleanField | DEFAULT=False | Walk-in availability |
| online_booking | BooleanField | DEFAULT=False | Booking system available |
| pricing_info | TextField | NULLABLE | Pricing transparency |
| payment_plans | BooleanField | DEFAULT=False | Payment plans offered |
| pet_insurance_accepted | JSONField | DEFAULT=[] | Accepted insurers |
| has_separate_cat_area | BooleanField | DEFAULT=False | Cat-only waiting area |
| has_parking | BooleanField | DEFAULT=True | Parking available |
| is_wheelchair_accessible | BooleanField | DEFAULT=False | ADA compliant |
| has_onsite_pharmacy | BooleanField | DEFAULT=False | Pharmacy on-site |
| has_onsite_lab | BooleanField | DEFAULT=False | Lab on-site |
| has_boarding | BooleanField | DEFAULT=False | Boarding services |
| has_grooming | BooleanField | DEFAULT=False | Grooming services |
| technology_equipment | JSONField | DEFAULT=[] | Equipment available |
| certifications | JSONField | DEFAULT=[] | AAHA, Fear Free, etc. |
| photos | JSONField | DEFAULT=[] | Array of photo URLs |
| created_at | DateTimeField | AUTO_NOW_ADD | Record creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Hours of Operation JSON:**
```json
{
  "monday": {"open": "08:00", "close": "18:00"},
  "tuesday": {"open": "08:00", "close": "18:00"},
  "wednesday": {"open": "08:00", "close": "18:00"},
  "thursday": {"open": "08:00", "close": "18:00"},
  "friday": {"open": "08:00", "close": "18:00"},
  "saturday": {"open": "09:00", "close": "14:00"},
  "sunday": {"closed": true}
}
```

**Indexes:**
- provider_id (unique)
- clinic_type
- is_24_hour

---

### ServiceReview
**Purpose:** Reviews for service providers

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| provider | ForeignKey | FK(ServiceProvider), CASCADE | Reviewed provider |
| reviewer | ForeignKey | FK(User), CASCADE | Review author |
| service_type | CharField(50) | CHOICES | foster, vet, trainer, groomer |
| rating_overall | IntegerField | 1-5 | Overall rating |
| rating_communication | IntegerField | NULLABLE, 1-5 | Communication rating |
| rating_cleanliness | IntegerField | NULLABLE, 1-5 | Cleanliness rating |
| rating_quality | IntegerField | NULLABLE, 1-5 | Quality of care |
| rating_value | IntegerField | NULLABLE, 1-5 | Value for money |
| review_text | TextField | MIN_LENGTH=200 | Written review |
| photos | JSONField | DEFAULT=[] | Array of photo URLs |
| verified_client | BooleanField | DEFAULT=False | Verified booking |
| provider_response | TextField | NULLABLE | Provider reply |
| provider_responded_at | DateTimeField | NULLABLE | Response timestamp |
| is_featured | BooleanField | DEFAULT=False | Featured review |
| helpful_count | IntegerField | DEFAULT=0 | Upvote count |
| created_at | DateTimeField | AUTO_NOW_ADD | Review timestamp |
| updated_at | DateTimeField | AUTO_NOW | Last edit timestamp |

**Meta:**
- unique_together: (provider, reviewer) - one review per user per provider

**Indexes:**
- provider_id
- reviewer_id
- rating_overall
- verified_client
- created_at

---

### ServiceBooking (for foster care)
**Purpose:** Booking/reservation system

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| provider | ForeignKey | FK(FosterService), CASCADE | Foster provider |
| client | ForeignKey | FK(User), CASCADE | Pet owner booking |
| pet | ForeignKey | FK(PetProfile), CASCADE | Pet being fostered |
| booking_type | CharField(50) | CHOICES | short_term, medium_term, long_term, respite |
| start_date | DateField | NOT NULL | Foster start date |
| end_date | DateField | NOT NULL | Foster end date |
| total_days | IntegerField | CALCULATED | Duration |
| daily_rate | DecimalField(6,2) | NOT NULL | Rate per day |
| total_cost | DecimalField(8,2) | CALCULATED | Total booking cost |
| deposit_paid | DecimalField(7,2) | DEFAULT=0 | Deposit amount |
| special_requirements | TextField | NULLABLE | Special needs notes |
| status | CharField(20) | CHOICES, DEFAULT='pending' | pending, confirmed, in_progress, completed, cancelled |
| payment_status | CharField(20) | CHOICES, DEFAULT='pending' | pending, partial, paid, refunded |
| cancellation_reason | TextField | NULLABLE | If cancelled |
| created_at | DateTimeField | AUTO_NOW_ADD | Booking creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Indexes:**
- provider_id
- client_id
- pet_id
- status
- start_date, end_date

---

## 5. REHOMING APP

### RehomingIntervention
**Purpose:** Pre-rehoming questionnaire responses

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| user | ForeignKey | FK(User), CASCADE | Pet owner |
| reason_category | CharField(100) | CHOICES | moving, allergies, financial, behavioral, etc. |
| reason_text | TextField | MIN_LENGTH=500 | Detailed explanation |
| urgency_level | CharField(20) | CHOICES | immediate, one_month, three_months, flexible |
| resources_viewed | JSONField | DEFAULT=[] | Resources shown to user |
| resources_acknowledged | BooleanField | DEFAULT=False | User confirmed viewing |
| cooling_period_started | DateTimeField | NULLABLE | 48hr waiting period |
| cooling_period_completed | BooleanField | DEFAULT=False | Waiting period done |
| proceeded_to_listing | BooleanField | DEFAULT=False | Created listing |
| acknowledged_at | DateTimeField | NULLABLE | Acknowledgment timestamp |
| created_at | DateTimeField | AUTO_NOW_ADD | Intervention start |

**Indexes:**
- user_id
- created_at

---

### RehomingListing
**Purpose:** Pets available for adoption

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| pet_owner | ForeignKey | FK(User), CASCADE | Pet owner |
| intervention | ForeignKey | FK(RehomingIntervention), NULLABLE | Link to intervention |
| pet_profile | ForeignKey | FK(PetProfile), NULLABLE, SET_NULL | Existing pet profile |
| pet_name | CharField(100) | NOT NULL | Pet's name |
| species | CharField(50) | CHOICES | dog, cat, rabbit, bird, other |
| breed | CharField(100) | NULLABLE | Breed |
| age | IntegerField | NULLABLE | Age in years |
| gender | CharField(10) | CHOICES | male, female, unknown |
| weight | DecimalField(5,2) | NULLABLE | Weight in pounds |
| size_category | CharField(20) | CHOICES | xs, small, medium, large, xl |
| color_markings | TextField | NULLABLE | Physical description |
| medical_history | JSONField | DEFAULT={} | Medical details |
| behavioral_profile | JSONField | DEFAULT={} | Behavior questionnaire |
| aggression_disclosed | BooleanField | DEFAULT=False | Aggression reported |
| aggression_details | TextField | NULLABLE | Incident details |
| rehoming_reason | CharField(100) | | Reason category |
| rehoming_story | TextField | MIN_LENGTH=1000 | Full story |
| ideal_home | TextField | NULLABLE | Home requirements |
| adoption_fee | DecimalField(5,2) | DEFAULT=0, MAX=300 | Adoption fee |
| fee_explanation | TextField | NULLABLE | Fee breakdown |
| included_items | JSONField | DEFAULT=[] | Items included |
| photos | JSONField | DEFAULT=[] | Photo URLs (5-15) |
| video_url | URLField | NULLABLE | Video URL |
| urgency_level | CharField(20) | CHOICES | immediate, one_month, three_months, flexible |
| ideal_adoption_date | DateField | NULLABLE | Target date |
| location_city | CharField(100) | NOT NULL | City |
| location_state | CharField(50) | NOT NULL | State |
| location_zip | CharField(20) | NOT NULL | Zip code |
| latitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| longitude | DecimalField(9,6) | NULLABLE | Geo-coordinates |
| service_area_miles | IntegerField | DEFAULT=50 | Search radius |
| privacy_level | CharField(20) | CHOICES, DEFAULT='public' | public, verified_only, private |
| custom_questions | JSONField | DEFAULT=[] | Questions for applicants |
| status | CharField(20) | CHOICES, DEFAULT='draft' | draft, pending_review, active, on_hold, adopted, expired, rejected |
| rejection_reason | TextField | NULLABLE | Admin rejection reason |
| view_count | IntegerField | DEFAULT=0 | View counter |
| application_count | IntegerField | DEFAULT=0 | Cached app count |
| published_at | DateTimeField | NULLABLE | Go-live timestamp |
| expires_at | DateTimeField | NULLABLE | Listing expiration |
| created_at | DateTimeField | AUTO_NOW_ADD | Listing creation |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Medical History JSON:**
```json
{
  "spayed_neutered": true,
  "microchipped": true,
  "microchip_number": "123456789",
  "vaccinations_current": true,
  "vaccination_records": ["url1.pdf", "url2.pdf"],
  "current_medications": ["Heartgard", "Nexgard"],
  "medical_conditions": ["allergies", "arthritis"],
  "last_vet_visit": "2024-12-01",
  "veterinarian": {
    "name": "Dr. Smith",
    "clinic": "Happy Pets Clinic",
    "phone": "555-1234"
  }
}
```

**Behavioral Profile JSON:**
```json
{
  "energy_level": 4,
  "affection_level": 5,
  "good_with_children": true,
  "children_age_range": "5+",
  "good_with_dogs": true,
  "good_with_cats": false,
  "house_trained": true,
  "crate_trained": true,
  "separation_anxiety": false,
  "aggression_human": false,
  "aggression_animal": false,
  "exercise_needs": "high",
  "ideal_home_type": "house_with_yard_required"
}
```

**Indexes:**
- pet_owner_id
- species
- location_city, location_state, location_zip (composite)
- status
- published_at (DESC)
- adoption_fee

---

### AdoptionApplication
**Purpose:** Adoption applications submitted

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| listing | ForeignKey | FK(RehomingListing), CASCADE | Applied listing |
| applicant | ForeignKey | FK(User), CASCADE | Applicant user |
| adopter_profile | ForeignKey | FK(AdopterProfile), CASCADE | Adopter details |
| application_message | TextField | MIN_LENGTH=500 | Personalized message |
| custom_answers | JSONField | DEFAULT={} | Answers to custom questions |
| match_score | IntegerField | DEFAULT=0, 0-100 | Algorithm match score |
| status | CharField(30) | CHOICES, DEFAULT='pending_review' | Application workflow status |
| rejection_reason | TextField | NULLABLE | Why rejected |
| pet_owner_notes | TextField | NULLABLE | Private notes |
| meet_greet_scheduled | DateTimeField | NULLABLE | Meeting date/time |
| meet_greet_location | CharField(300) | NULLABLE | Meeting place |
| meet_greet_feedback | JSONField | NULLABLE | Post-meeting feedback |
| home_check_required | BooleanField | DEFAULT=False | Home check needed |
| home_check_completed | BooleanField | DEFAULT=False | Home check done |
| home_check_passed | BooleanField | NULLABLE | Home check result |
| home_check_notes | TextField | NULLABLE | Home check details |
| home_check_photos | JSONField | DEFAULT=[] | Photo URLs |
| trial_period | BooleanField | DEFAULT=False | Trial agreed |
| trial_start_date | DateField | NULLABLE | Trial start |
| trial_end_date | DateField | NULLABLE | Trial end |
| trial_feedback | JSONField | NULLABLE | Trial check-ins |
| adoption_fee_amount | DecimalField(5,2) | DEFAULT=0 | Fee amount |
| adoption_contract_signed | BooleanField | DEFAULT=False | Contract status |
| microchip_transferred | BooleanField | DEFAULT=False | Chip updated |
| finalized_at | DateTimeField | NULLABLE | Adoption finalized |
| return_requested | BooleanField | DEFAULT=False | Return within 30 days |
| return_reason | TextField | NULLABLE | Return explanation |
| created_at | DateTimeField | AUTO_NOW_ADD | Application submitted |
| updated_at | DateTimeField | AUTO_NOW | Last update timestamp |

**Status Choices:**
- pending_review
- info_requested
- rejected
- approved_meet_greet
- meet_greet_success
- home_check_pending
- home_check_passed
- trial_period
- ready_for_adoption
- adopted
- adoption_completed
- return_requested
- returned

**Indexes:**
- listing_id
- applicant_id
- status
- created_at

---

### AdoptionContract
**Purpose:** Legal adoption agreements

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| application | OneToOneField | FK(AdoptionApplication), CASCADE | Related application |
| contract_template | CharField(50) | | Template version used |
| contract_text | TextField | NOT NULL | Full contract text |
| terms_and_conditions | JSONField | DEFAULT={} | Contract terms |
| pet_owner_name | CharField(200) | NOT NULL | Owner signature name |
| pet_owner_signature | TextField | NULLABLE | Digital signature |
| pet_owner_signed_at | DateTimeField | NULLABLE | Signature timestamp |
| pet_owner_ip | GenericIPAddressField | NULLABLE | IP address |
| adopter_name | CharField(200) | NOT NULL | Adopter signature name |
| adopter_signature | TextField | NULLABLE | Digital signature |
| adopter_signed_at | DateTimeField | NULLABLE | Signature timestamp |
| adopter_ip | GenericIPAddressField | NULLABLE | IP address |
| is_fully_signed | BooleanField | DEFAULT=False | Both parties signed |
| document_pdf_url | URLField | NULLABLE | Generated PDF URL |
| created_at | DateTimeField | AUTO_NOW_ADD | Contract created |
| updated_at | DateTimeField | AUTO_NOW | Last update |

**Indexes:**
- application_id (unique)
- is_fully_signed

---

### AdoptionPayment
**Purpose:** Payment processing and escrow

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| application | OneToOneField | FK(AdoptionApplication), CASCADE | Related application |
| adoption_fee | DecimalField(7,2) | NOT NULL | Total adoption fee |
| platform_fee | DecimalField(7,2) | CALCULATED | 10% commission |
| payout_amount | DecimalField(7,2) | CALCULATED | Amount to pet owner |
| payment_method | CharField(50) | CHOICES | credit_card, debit_card, paypal |
| stripe_payment_id | CharField(100) | NULLABLE | Stripe payment ID |
| stripe_payout_id | CharField(100) | NULLABLE | Stripe payout ID |
| payment_status | CharField(20) | CHOICES, DEFAULT='pending' | pending, processing, held, released, refunded, failed |
| held_until | DateTimeField | NULLABLE | Escrow hold date |
| released_at | DateTimeField | NULLABLE | Payout timestamp |
| refund_amount | DecimalField(7,2) | DEFAULT=0 | Refund if applicable |
| refund_reason | TextField | NULLABLE | Refund explanation |
| transaction_notes | TextField | NULLABLE | Admin notes |
| created_at | DateTimeField | AUTO_NOW_ADD | Payment initiated |
| updated_at | DateTimeField | AUTO_NOW | Last update |

**Indexes:**
- application_id (unique)
- payment_status
- stripe_payment_id

---

### PostAdoptionCheckIn
**Purpose:** Follow-up surveys post-adoption

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| application | ForeignKey | FK(AdoptionApplication), CASCADE | Related adoption |
| check_in_day | IntegerField | CHOICES | 3, 7, 14, 30 |
| survey_questions | JSONField | DEFAULT=[] | Questions asked |
| responses | JSONField | NULLABLE | User responses |
| issues_reported | BooleanField | DEFAULT=False | Problems flagged |
| issue_details | TextField | NULLABLE | Problem description |
| support_requested | BooleanField | DEFAULT=False | Help needed |
| vet_visit_completed | BooleanField | NULLABLE | Vet checkup done |
| vet_receipt_url | URLField | NULLABLE | Proof of visit |
| photos_shared | JSONField | DEFAULT=[] | Update photos |
| completed_at | DateTimeField | NULLABLE | Survey submission |
| created_at | DateTimeField | AUTO_NOW_ADD | Check-in sent |

**Indexes:**
- application_id
- check_in_day
- completed_at

---

### AdoptionReview
**Purpose:** Reviews post-adoption (both parties)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| application | ForeignKey | FK(AdoptionApplication), CASCADE | Related adoption |
| reviewer | ForeignKey | FK(User), CASCADE | Review author |
| reviewee | ForeignKey | FK(User), CASCADE | Review recipient |
| reviewer_role | CharField(20) | CHOICES | pet_owner, adopter |
| rating_overall | IntegerField | 1-5, NOT NULL | Overall rating |
| rating_responsiveness | IntegerField | NULLABLE, 1-5 | Communication rating |
| rating_preparation | IntegerField | NULLABLE, 1-5 | Readiness rating |
| rating_honesty | IntegerField | NULLABLE, 1-5 | Accuracy rating |
| rating_follow_through | IntegerField | NULLABLE, 1-5 | Commitment rating |
| review_text | TextField | MIN_LENGTH=200 | Written review |
| would_recommend | BooleanField | NOT NULL | Recommendation |
| tags | JSONField | DEFAULT=[] | Helpful tags |
| is_featured | BooleanField | DEFAULT=False | Featured review |
| helpful_count | IntegerField | DEFAULT=0 | Upvote count |
| created_at | DateTimeField | AUTO_NOW_ADD | Review timestamp |
| updated_at | DateTimeField | AUTO_NOW | Last edit |

**Meta:**
- unique_together: (application, reviewer)

**Indexes:**
- application_id
- reviewer_id
- reviewee_id
- rating_overall
- created_at

---

## 6. MESSAGING APP

### Conversation
**Purpose:** Chat conversations between users

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| participants | ManyToManyField | User | Conversation members (2 for DM, up to 50 for group) |
| conversation_type | CharField(20) | CHOICES, DEFAULT='direct' | direct, group |
| title | CharField(200) | NULLABLE | Group chat name |
| group_photo | ImageField | NULLABLE | Group chat photo |
| group_photo_url | URLField | NULLABLE | CDN URL |
| admin | ForeignKey | FK(User), NULLABLE, SET_NULL | Group admin (if group) |
| is_archived | BooleanField | DEFAULT=False | Archived status |
| last_message_at | DateTimeField | NULLABLE | Latest message time |
| last_message_preview | CharField(300) | NULLABLE | Cached preview |
| created_at | DateTimeField | AUTO_NOW_ADD | Conversation start |
| updated_at | DateTimeField | AUTO_NOW | Last activity |

**Meta:**
- For direct messages: unique together on sorted participant IDs

**Indexes:**
- participants (M2M)
- last_message_at (DESC)
- is_archived

---

### Message
**Purpose:** Individual messages in conversations

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| conversation | ForeignKey | FK(Conversation), CASCADE | Parent conversation |
| sender | ForeignKey | FK(User), CASCADE | Message sender |
| content | TextField | MAX_LENGTH=5000 | Message text |
| message_type | CharField(20) | CHOICES, DEFAULT='text' | text, image, voice, system |
| media_url | URLField | NULLABLE | Attached media |
| media_thumbnail | URLField | NULLABLE | Thumbnail for images |
| voice_duration | IntegerField | NULLABLE | Voice message seconds |
| reply_to | ForeignKey | FK(Message), NULLABLE, SET_NULL | Quoted message |
| is_deleted | BooleanField | DEFAULT=False | Soft delete |
| deleted_at | DateTimeField | NULLABLE | Deletion timestamp |
| is_edited | BooleanField | DEFAULT=False | Edit indicator |
| edited_at | DateTimeField | NULLABLE | Last edit time |
| created_at | DateTimeField | AUTO_NOW_ADD | Message timestamp |

**Indexes:**
- conversation_id
- sender_id
- created_at (DESC)

---

### MessageReceipt
**Purpose:** Read receipts for messages

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| message | ForeignKey | FK(Message), CASCADE | Message reference |
| user | ForeignKey | FK(User), CASCADE | User who read |
| is_read | BooleanField | DEFAULT=False | Read status |
| read_at | DateTimeField | NULLABLE | Read timestamp |

**Meta:**
- unique_together: (message, user)

**Indexes:**
- message_id
- user_id
- is_read

---

## 7. NOTIFICATIONS APP

### Notification
**Purpose:** In-app and push notifications

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| recipient | ForeignKey | FK(User), CASCADE | Notification recipient |
| notification_type | CharField(50) | CHOICES | Notification category |
| title | CharField(200) | NOT NULL | Notification title |
| message | TextField | NOT NULL | Notification content |
| action_url | CharField(500) | NULLABLE | Link to related content |
| related_object_type | ForeignKey | ContentType, NULLABLE | Generic relation |
| related_object_id | PositiveIntegerField | NULLABLE | Generic relation ID |
| priority | CharField(20) | CHOICES, DEFAULT='normal' | low, normal, high, urgent |
| channel | CharField(20) | CHOICES, DEFAULT='in_app' | in_app, email, sms, push |
| is_read | BooleanField | DEFAULT=False | Read status |
| read_at | DateTimeField | NULLABLE | Read timestamp |
| is_dismissed | BooleanField | DEFAULT=False | Dismissed status |
| created_at | DateTimeField | AUTO_NOW_ADD | Notification timestamp |

**Notification Type Choices:**
- post_reaction
- post_comment
- comment_reply
- message_received
- application_submitted
- application_update
- adoption_finalized
- review_received
- group_invitation
- event_reminder
- lost_pet_alert
- system_announcement

**Indexes:**
- recipient_id
- is_read
- created_at (DESC)
- notification_type

---

## 8. ADMIN & MODERATION APP

### UserReport
**Purpose:** User-submitted reports for moderation

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| reporter | ForeignKey | FK(User), CASCADE | User filing report |
| reported_user | ForeignKey | FK(User), NULLABLE, SET_NULL | Reported user |
| reported_content_type | ForeignKey | ContentType, NULLABLE | Generic relation |
| reported_content_id | PositiveIntegerField | NULLABLE | Generic relation ID |
| report_type | CharField(50) | CHOICES | Violation category |
| description | TextField | MIN_LENGTH=100 | Report details |
| severity | CharField(20) | CHOICES, DEFAULT='medium' | low, medium, high, critical |
| evidence_urls | JSONField | DEFAULT=[] | Screenshot URLs |
| status | CharField(20) | CHOICES, DEFAULT='pending' | pending, under_review, action_taken, dismissed |
| assigned_to | ForeignKey | FK(User), NULLABLE, SET_NULL | Moderator assigned |
| admin_notes | TextField | NULLABLE | Internal notes |
| action_taken | CharField(100) | NULLABLE | Resolution action |
| resolved_at | DateTimeField | NULLABLE | Resolution timestamp |
| created_at | DateTimeField | AUTO_NOW_ADD | Report timestamp |
| updated_at | DateTimeField | AUTO_NOW | Last update |

**Report Type Choices:**
- spam
- harassment
- inappropriate_content
- animal_welfare_concern
- misrepresentation
- scam_fraud
- stolen_pet
- fake_profile
- other

**Indexes:**
- reporter_id
- reported_user_id
- status
- severity
- created_at

---

### ModerationAction
**Purpose:** Log of moderation actions taken

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| moderator | ForeignKey | FK(User), CASCADE | Moderator who acted |
| target_user | ForeignKey | FK(User), CASCADE | User being moderated |
| action_type | CharField(50) | CHOICES | Action taken |
| reason | TextField | NOT NULL | Reason for action |
| duration_days | IntegerField | NULLABLE | For suspensions |
| related_report | ForeignKey | FK(UserReport), NULLABLE, SET_NULL | If from report |
| notes | TextField | NULLABLE | Internal notes |
| expires_at | DateTimeField | NULLABLE | Action expiry |
| is_active | BooleanField | DEFAULT=True | Active status |
| created_at | DateTimeField | AUTO_NOW_ADD | Action timestamp |

**Action Type Choices:**
- warning_issued
- content_removed
- temporary_suspension
- permanent_ban
- restriction_applied
- verification_revoked
- account_reinstated

**Indexes:**
- moderator_id
- target_user_id
- action_type
- is_active
- created_at

---

## 9. ANALYTICS APP

### PlatformAnalytics
**Purpose:** Daily aggregated platform metrics

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BigAutoField | PK | Auto-generated primary key |
| date | DateField | UNIQUE, NOT NULL | Analytics date |
| total_users | IntegerField | DEFAULT=0 | Total registered users |
| new_users | IntegerField | DEFAULT=0 | New registrations |
| active_users | IntegerField | DEFAULT=0 | DAU (daily active) |
| total_posts | IntegerField | DEFAULT=0 | Posts created |
| total_comments | IntegerField | DEFAULT=0 | Comments posted |
| total_messages | IntegerField | DEFAULT=0 | Messages sent |
| total_listings_active | IntegerField | DEFAULT=0 | Active rehoming listings |
| new_listings | IntegerField | DEFAULT=0 | New listings created |
| total_applications | IntegerField | DEFAULT=0 | Applications submitted |
| adoptions_finalized | IntegerField | DEFAULT=0 | Adoptions completed |
| service_bookings | IntegerField | DEFAULT=0 | Foster bookings |
| revenue_total | DecimalField(10,2) | DEFAULT=0 | Daily revenue |
| created_at | DateTimeField | AUTO_NOW_ADD | Record timestamp |

**Indexes:**
- date (unique, DESC)

---

## 10. RELATIONSHIPS SUMMARY

### Key Foreign Key Relationships:

**Users → Everything:**
- User has one UserProfile (1:1)
- User has one AdopterProfile (1:1, optional)
- User has one ServiceProvider (1:1, optional)
- User has many PetProfiles (1:N)
- User creates many Posts (1:N)
- User creates many Comments (1:N)
- User joins many Groups (M:N through GroupMembership)
- User attends many Events (M:N through EventRSVP)
- User creates many RehomingListings (1:N)
- User submits many AdoptionApplications (1:N)
- User participates in many Conversations (M:N)
- User sends many Messages (1:N)
- User receives many Notifications (1:N)

**Rehoming Workflow:**
- RehomingListing ← AdoptionApplication (1:N)
- AdoptionApplication → AdoptionContract (1:1)
- AdoptionApplication → AdoptionPayment (1:1)
- AdoptionApplication ← PostAdoptionCheckIn (1:N)
- AdoptionApplication ← AdoptionReview (1:N, two reviews per adoption)

**Services:**
- ServiceProvider → FosterService (1:1)
- ServiceProvider → VeterinaryClinic (1:1)
- ServiceProvider ← ServiceReview (1:N)
- FosterService ← ServiceBooking (1:N)

**Community:**
- Post ← Comment (1:N)
- Post/Comment ← Reaction (1:N via Generic FK)
- Post → Poll (1:1, optional)
- Poll ← PollOption (1:N)
- PollOption ← PollVote (1:N)
- Group ← Post (1:N)
- Group ← Event (1:N)

---

## 11. DATABASE OPTIMIZATION

### Essential Indexes (Beyond those listed):
```sql
-- Composite indexes for common queries
CREATE INDEX idx_listing_location_status ON rehoming_listing(location_city, location_state, status);
CREATE INDEX idx_application_listing_status ON adoption_application(listing_id, status);
CREATE INDEX idx_message_conversation_created ON message(conversation_id, created_at DESC);
CREATE INDEX idx_post_author_created ON post(author_id, created_at DESC);
CREATE INDEX idx_notification_recipient_read ON notification(recipient_id, is_read, created_at DESC);

-- Full-text search indexes (PostgreSQL)
CREATE INDEX idx_post_content_fulltext ON post USING gin(to_tsvector('english', content));
CREATE INDEX idx_listing_story_fulltext ON rehoming_listing USING gin(to_tsvector('english', rehoming_story));
```

### Caching Strategy:
- User profile data (Redis, 1 hour TTL)
- Service provider listings (Redis, 15 min TTL)
- Feed posts (Redis, 5 min TTL)
- Notification counts (Redis, real-time)

### Partitioning Recommendations:
- Messages: Partition by created_at (monthly)
- Notifications: Partition by created_at (monthly)
- PlatformAnalytics: Partition by date (yearly)

---

## 12. DATA MIGRATION NOTES

### Initial Setup Commands:
```bash
# Create Django project structure
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load initial data
python manage.py loaddata initial_categories.json
python manage.py loaddata initial_service_types.json
```

### Seed Data Script:
```python
# management/commands/seed_data.py
# Generate test data for development:
# - 100 users (mix of roles)
# - 50 pet profiles
# - 25 rehoming listings
# - 100 posts
# - 20 service providers
```

---

**This schema supports all MVP features and scales for future growth. Total estimated tables: ~40 models.**