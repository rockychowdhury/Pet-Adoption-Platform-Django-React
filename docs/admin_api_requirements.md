# Admin Dashboard API Requirements

Based on backend models analysis, here are the required admin management APIs:

## 1. User Management

### Users (`apps.users`)
- `GET /api/admin/users/` - List all users with filters (role, status, verified)
- `GET /api/admin/users/{id}/` - Get user details
- `PATCH /api/admin/users/{id}/` - Update user (role, status, verification)
- `DELETE /api/admin/users/{id}/` - Delete/deactivate user
- `POST /api/admin/users/{id}/suspend/` - Suspend user account
- `POST /api/admin/users/{id}/ban/` - Ban user account
- `POST /api/admin/users/{id}/reinstate/` - Reinstate user account

### Role Requests (`apps.users.RoleRequest`)
- `GET /api/admin/role-requests/` - List pending role requests
- `GET /api/admin/role-requests/{id}/` - Get role request details
- `POST /api/admin/role-requests/{id}/approve/` - Approve role request
- `POST /api/admin/role-requests/{id}/reject/` - Reject role request

---

## 2. Content Moderation

### Reports (`apps.admin_panel.UserReport`)
- `GET /api/admin/reports/` - List all reports (filterable by status, severity, type)
- `GET /api/admin/reports/{id}/` - Get report details
- `PATCH /api/admin/reports/{id}/` - Update report status/assignment
- `POST /api/admin/reports/{id}/take-action/` - Take moderation action
- `POST /api/admin/reports/{id}/dismiss/` - Dismiss report

### Moderation Actions (`apps.admin_panel.ModerationAction`)
- `GET /api/admin/moderation-actions/` - List all moderation actions (audit log)
- `GET /api/admin/moderation-actions/{id}/` - Get action details
- `POST /api/admin/moderation-actions/` - Create moderation action

---

## 3. Pet & Rehoming Management

### Pet Listings (`apps.pets.PetProfile`)
- `GET /api/admin/pets/` - List all pets (filterable by status, species)
- `GET /api/admin/pets/{id}/` - Get pet details
- `PATCH /api/admin/pets/{id}/` - Update pet status
- `DELETE /api/admin/pets/{id}/` - Remove pet listing
- `POST /api/admin/pets/{id}/flag/` - Flag for review

### Rehoming Listings (`apps.rehoming.RehomingListing`)
- `GET /api/admin/rehoming/listings/` - List all rehoming listings
- `GET /api/admin/rehoming/listings/{id}/` - Get listing details
- `PATCH /api/admin/rehoming/listings/{id}/` - Update listing status
- `POST /api/admin/rehoming/listings/{id}/approve/` - Approve listing
- `POST /api/admin/rehoming/listings/{id}/reject/` - Reject listing

### Adoption Applications (`apps.rehoming.AdoptionInquiry`)
- `GET /api/admin/adoption/applications/` - List all applications
- `GET /api/admin/adoption/applications/{id}/` - Get application details

---

## 4. Service Provider Management

### Service Providers (`apps.services.ServiceProvider`)
- `GET /api/admin/service-providers/` - List all providers (filterable by verification status)
- `GET /api/admin/service-providers/{id}/` - Get provider details
- `PATCH /api/admin/service-providers/{id}/` - Update provider
- `POST /api/admin/service-providers/{id}/verify/` - Verify provider
- `POST /api/admin/service-providers/{id}/suspend/` - Suspend provider
- `DELETE /api/admin/service-providers/{id}/` - Remove provider

### Service Bookings (`apps.services.ServiceBooking`)
- `GET /api/admin/service-bookings/` - List all bookings
- `GET /api/admin/service-bookings/{id}/` - Get booking details

---

## 5. Community Management

### Groups (`apps.community.Group`)
- `GET /api/admin/community/groups/` - List all groups
- `GET /api/admin/community/groups/{id}/` - Get group details
- `PATCH /api/admin/community/groups/{id}/` - Update group
- `DELETE /api/admin/community/groups/{id}/` - Delete group

### Posts (`apps.community.Post`)
- `GET /api/admin/community/posts/` - List all posts (filterable by flagged)
- `GET /api/admin/community/posts/{id}/` - Get post details
- `DELETE /api/admin/community/posts/{id}/` - Remove post
- `POST /api/admin/community/posts/{id}/flag/` - Flag post

### Events (`apps.community.Event`)
- `GET /api/admin/community/events/` - List all events
- `GET /api/admin/community/events/{id}/` - Get event details
- `PATCH /api/admin/community/events/{id}/` - Update event
- `DELETE /api/admin/community/events/{id}/` - Delete event

---

## 6. Analytics & Reporting

### Platform Analytics (`apps.analytics.PlatformAnalytics`)
- `GET /api/admin/analytics/overview/` - Platform overview stats
- `GET /api/admin/analytics/users/` - User growth metrics
- `GET /api/admin/analytics/adoptions/` - Adoption success metrics
- `GET /api/admin/analytics/services/` - Service provider metrics
- `GET /api/admin/analytics/engagement/` - Community engagement metrics

---

## 7. System Management

### Notifications
- `GET /api/admin/notifications/` - List system notifications
- `POST /api/admin/notifications/broadcast/` - Send broadcast notification

### Reviews (`apps.reviews`)
- `GET /api/admin/reviews/` - List all reviews (filterable by flagged)
- `GET /api/admin/reviews/{id}/` - Get review details
- `DELETE /api/admin/reviews/{id}/` - Remove review

---

## Priority Implementation Order

### Phase 1 (Critical)
1. User management (list, details, role changes)
2. Role request approval/rejection
3. Reports management (list, details, take action)
4. Service provider verification

### Phase 2 (Important)
1. Pet/Rehoming listing moderation
2. Moderation actions audit log
3. Analytics overview

### Phase 3 (Nice to Have)
1. Community content moderation
2. Detailed analytics
3. Broadcast notifications
