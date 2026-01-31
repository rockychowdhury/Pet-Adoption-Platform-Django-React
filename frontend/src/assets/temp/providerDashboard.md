# Service Provider Dashboard - UI Documentation

## Overview
Dashboard for service providers to manage their profile, bookings, reviews, and business operations.

---

## Layout Structure

### Top Navigation Bar
```
[Logo] [Dashboard] [Messages] [Help]           [Notifications 🔔] [Profile Avatar ▼]
```

### Sidebar Navigation (Desktop) / Bottom Nav (Mobile)
- **Dashboard** (home icon)
- **Bookings** (calendar icon)
- **My Profile** (store icon)
- **Reviews** (star icon)
- **Analytics** (chart icon)
- **Settings** (gear icon)

---

## Page 1: Dashboard Overview

### Welcome Header
```
Welcome back, [Business Name]!
[Current Date/Time]
```

### Status Cards Row (4 cards)

**Card 1: Verification Status**
- Badge: Pending / Verified / Suspended
- Status message
- Action button (if pending): "Complete Verification"

**Card 2: Active Bookings**
- Large number: XX
- Subtitle: "Active bookings"
- Link: "View all"

**Card 3: Pending Reviews**
- Large number: XX
- Subtitle: "Awaiting response"
- Link: "See reviews"

**Card 4: This Month's Revenue**
- Amount: $X,XXX
- Percentage change vs last month
- Small trend graph

### Quick Actions Panel
Button grid (2x2 or 2x3):
- **New Booking** (manual entry)
- **Update Availability**
- **Edit Profile**
- **View Calendar**
- **Upload Photos**
- **Download Reports**

### Recent Activity Section

**Upcoming Bookings** (table or card list):
| Client | Pet | Service | Date/Time | Status | Actions |
|--------|-----|---------|-----------|--------|---------|
| [Name] | [Pet Name] | [Service] | [DateTime] | [Badge] | [View][Contact] |

Show 5 most recent, "View All Bookings" link

**Recent Reviews** (card list):
- Reviewer name
- Star rating
- Review excerpt (1-2 lines)
- Date received
- "Respond" button (if no response yet)

Show 3 most recent, "View All Reviews" link

### Service-Specific Widgets

**Foster Providers:**
- **Capacity Monitor**
  - Progress bar: X/Y animals
  - Current availability status
  - "Update Capacity" button

**Veterinary Clinics:**
- **Today's Schedule**
  - List of appointments
  - Current status: Open/Closed
  - Next appointment countdown

**Trainers:**
- **Client Capacity**
  - Progress bar: X/Y clients
  - Accepting new clients toggle
  - "Manage Clients" link

**Groomers:**
- **Today's Appointments**
  - Appointment list with times
  - Service type indicators
  - Quick check-in buttons

**Pet Sitters:**
- **Active Jobs**
  - Current walks/sits in progress
  - Upcoming in next 24 hours
  - Service radius map widget

---

## Page 2: Bookings Management

### Page Header
```
Bookings Management
[Date Range Picker]  [Filter ▼]  [Export]
```

### Filters Bar
- Status: All / Pending / Confirmed / In Progress / Completed / Cancelled
- Date Range: Custom picker
- Service Type: Dropdown (if applicable)
- Search: Client name or booking ID

### Bookings View Toggle
- **Calendar View** button
- **List View** button (default)

### List View Layout

**Booking Cards/Rows:**
```
[Booking ID] • [Status Badge]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client: [Name]                    Pet: [Pet Name] ([Species])
Service: [Service Type]           Duration: [X hours/days]
Start: [Date Time]                End: [Date Time]
Price: $XXX                       Paid: $XX / Status: [Badge]
Special Requirements: [Text if any]

[View Details] [Contact Client] [Cancel] [Mark Complete]
```

**Empty State:**
- Illustration
- "No bookings found"
- Suggested action: "Adjust filters" or "Promote your services"

### Calendar View Layout
- Month/Week/Day view toggle
- Color-coded by status
- Click appointment to see details modal
- Drag to reschedule (optional)

### Booking Detail Modal
- All booking information
- Client contact info
- Pet profile summary
- Payment status and history
- Status update dropdown
- Add notes field
- Action buttons: Save / Cancel / Complete / Refund

---

## Page 3: My Profile

### Tab Navigation
```
Basic Info | Service Details | Media | Hours | Pricing
```

### Tab 1: Basic Info

**Business Information Form:**
- Business Name (text input)
- Category (display only or dropdown)
- Description (rich text editor, 500+ words required)
- Website (URL input)

**Contact Information:**
- Phone (formatted input)
- Email (email input)

**Address:**
- Address Line 1 (required)
- Address Line 2 (optional)
- City, State, Zip (grouped inputs)
- Map preview (show pin on map)

**Verification:**
- License Number (text input)
- Insurance Information (text area)
- Upload verification documents (file upload)
- Current status badge (display only)

**Action Buttons:**
- Save Changes (primary)
- Cancel

---

### Tab 2: Service Details

**Content varies by service type:**

#### Foster Services Form:
- Capacity (number input)
- Current Count (number input)
- Species Accepted (multi-select checkboxes with icons)
- Daily Rate ($)
- Weekly Discount (%, slider)
- Monthly Rate ($)

**Environment Details** (collapsible sections):
- Indoor Space (text area)
- Outdoor/Yard (text area)
- Other Animals (text area)
- Safety Features (text area)

**Care Standards:**
- Feeding Schedule (text area)
- Exercise Routine (text area)
- Medical Care (text area)
- Socialization (text area)

- Video URL (URL input)

#### Veterinary Clinic Form:
- Clinic Type (radio buttons)
- Services Offered (multi-select from ServiceOptions)
- Species Treated (multi-select checkboxes)
- Emergency Services (toggle)
- Pricing Information (text area)

**Amenities** (checkbox grid):
- On-site Pharmacy
- Digital X-Ray
- Surgery Suite
- Boarding Available
- (etc.)

#### Trainer Services Form:
- Primary Training Method (dropdown)
- Training Philosophy (text area)
- Years Experience (number input)
- Species Trained (multi-select checkboxes)

**Service Offerings** (toggles):
- Private Sessions (+ rate input)
- Group Classes (+ rate input)
- Board & Train
- Virtual Training

**Specializations:**
- Multi-select from available specializations
- Add custom specialization option

**Certifications** (repeatable fields):
- Certification Name
- Issuing Organization
- Year Obtained
- [+ Add Another]

**Package Options** (repeatable):
- Package Name
- Number of Sessions
- Price
- Description
- [+ Add Package]

**Client Capacity:**
- Max Clients (number)
- Current Count (number)
- Accepting New Clients (toggle)

- Video URL

#### Groomer Services Form:
- Salon Type (radio buttons)
- Base Price ($ input)
- Species Accepted (multi-select)

**Service Menu** (repeatable):
- Service Name
- Description
- Price
- Duration (minutes)
- [+ Add Service]

**Amenities** (checkbox list):
- Custom amenities with text inputs

#### Pet Sitter Services Form:

**Service Types & Rates:**
- Dog Walking (toggle + $ input)
- House Sitting (toggle + $ input)
- Drop-In Visits (toggle + $ input)

**Details:**
- Species Accepted (multi-select)
- Years Experience (number)
- Insured (checkbox)
- Has Transportation (checkbox)
- Service Radius (number, km)

---

### Tab 3: Media

**Photo Gallery Manager:**

**Primary Photo Section:**
- Large preview of current primary photo
- "Set as Primary" button (for selected)
- Delete button

**Photo Grid:**
- Thumbnail grid of all photos
- Drag to reorder
- Click to select/edit
- Delete icon on hover

**Upload Section:**
- Drag & drop area
- "Choose Files" button
- Upload progress indicators
- Supported formats note

**Per Photo Controls:**
- Alt Text input
- Set as Primary radio
- Delete button

---

### Tab 4: Business Hours

**Hours Editor (table format):**

| Day | Status | Open Time | Close Time | Actions |
|-----|--------|-----------|------------|---------|
| Monday | Open ✓ | 09:00 AM | 05:00 PM | [Edit] |
| Tuesday | Open ✓ | 09:00 AM | 05:00 PM | [Edit] |
| Wednesday | Closed ✗ | - | - | [Edit] |
| ... | | | | |

**Quick Actions:**
- "Apply to All Days" button
- "Copy from Previous Week" button

**Edit Modal:**
- Day name (display only)
- Closed toggle
- Open time picker
- Close time picker
- Save / Cancel

---

### Tab 5: Pricing (varies by service)

**Pricing Management Interface:**

Display pricing fields relevant to service type with clear labels and help text.

**Common Elements:**
- Service/Item Name
- Base Price
- Description
- Active/Inactive toggle

**Package Pricing (if applicable):**
- Package builder
- Bulk discount calculator
- Seasonal pricing options

---

## Page 4: Reviews

### Reviews Summary Header
```
Your Rating: [X.X ★★★★☆]     Total Reviews: XX
```

**Rating Breakdown** (progress bars):
- Overall: ★★★★☆ X.X
- Communication: ★★★★☆ X.X
- Cleanliness: ★★★★★ X.X
- Quality of Care: ★★★★☆ X.X
- Value for Money: ★★★★☆ X.X

### Filters
- Show: All / Responded / Need Response
- Rating: All / 5 Star / 4 Star / etc.
- Sort by: Newest / Oldest / Highest / Lowest

### Reviews List

**Review Card:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Reviewer Name] • [Verified Badge] • [Date]
★★★★☆ X.X Overall

[Review Text - expandable if long]

[Photo if attached - thumbnail, click to expand]

Detailed Ratings:
Communication: ★★★★☆  Cleanliness: ★★★★★
Quality: ★★★★☆      Value: ★★★★☆

Service Used: [Service Badge]

[Your Response] (if exists, shown below)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Respond] [Report] [Flag for Admin]
```

**Response Modal:**
- Review display (read-only)
- Response text area
- Character count
- Submit / Cancel buttons
- Note: "Responses are public and cannot be edited"

---

## Page 5: Analytics

### Date Range Selector
- Preset options: Last 7 days / Last 30 days / Last 3 months / Custom
- Date picker

### Key Metrics Cards (4 across)
- **Total Bookings** (number + % change)
- **Revenue** ($ amount + % change)
- **New Clients** (number + % change)
- **Average Rating** (star rating + % change)

### Charts Section

**Bookings Over Time:**
- Line/Bar chart showing booking volume
- Toggle: Daily / Weekly / Monthly

**Revenue Breakdown:**
- Pie chart by service type
- Table with service breakdown

**Client Analytics:**
- New vs Returning clients (donut chart)
- Top clients list

**Rating Trends:**
- Line chart showing rating over time
- Category breakdown

### Performance Insights Panel
- Text summaries of key findings
- Recommendations for improvement
- Comparison to previous period

**Export Options:**
- Download as PDF
- Download as CSV
- Email report

---

## Page 6: Settings

### Tab Navigation
```
Account | Notifications | Privacy | Billing
```

### Tab 1: Account Settings

**Profile Information:**
- Email (display only or change with verification)
- Password (Change Password button → modal)
- Phone number

**Account Status:**
- Application Status badge
- Verification Status badge
- Account created date
- Last login

**Danger Zone:**
- Deactivate Account (temporarily)
- Delete Account (permanently)
- Requires confirmation modal

---

### Tab 2: Notifications

**Email Notifications** (toggles):
- New booking requests
- Booking confirmations
- Booking cancellations
- New reviews
- Payment received
- Weekly summary report

**Push Notifications** (if mobile app):
- Same options as email
- Test notification button

**Notification Frequency:**
- Instant
- Daily digest
- Weekly digest

---

### Tab 3: Privacy Settings

**Profile Visibility:**
- Public profile (toggle)
- Show contact info publicly (toggle)
- Show exact address (toggle - if off, show general area)

**Data Sharing:**
- Share analytics with Anthropic (toggle)
- Allow marketing communications (toggle)

**Connected Accounts:**
- Google Calendar sync (if applicable)
- Payment processor status

---

### Tab 4: Billing

**Current Plan:**
- Plan name
- Monthly fee (if applicable)
- Next billing date
- Upgrade/Downgrade buttons

**Payment Information:**
- Default payment method (masked)
- Add/Edit payment method
- Billing address

**Transaction History:**
Table showing:
- Date
- Description
- Amount
- Status
- Download invoice

---

## Mobile Responsive Behavior

### Navigation
- Sidebar becomes bottom navigation bar
- Top nav collapses to hamburger menu

### Dashboard
- Status cards stack vertically
- Quick actions in 2x2 grid
- Tables convert to card list view

### Forms
- Single column layout
- Sticky save/cancel buttons
- Section accordions for long forms

### Charts
- Responsive/scrollable charts
- Simplified mobile-friendly visualizations

---

## Common Components

### Empty States
- Relevant illustration
- Clear message
- Suggested action button

### Loading States
- Skeleton screens for content
- Spinner for actions
- Progress bars for uploads

### Error Handling
- Inline validation messages (red text below fields)
- Toast notifications for actions (success/error)
- Modal for critical errors

### Confirmation Modals
- Clear action description
- Warning if destructive
- Confirm / Cancel buttons

---

## Accessibility Requirements

- Keyboard navigation for all actions
- ARIA labels for icons and buttons
- Focus indicators visible
- Form validation messages announced
- Color is not sole indicator of status

---

## API Integration Notes

**Dashboard Page:**
- GET /api/provider/dashboard-stats
- GET /api/provider/upcoming-bookings
- GET /api/provider/recent-reviews

**Bookings:**
- GET /api/provider/bookings?status=X&date_range=X
- PATCH /api/provider/bookings/{id}/status
- POST /api/provider/bookings (manual creation)

**Profile:**
- GET /api/provider/profile
- PATCH /api/provider/profile
- POST /api/provider/media
- DELETE /api/provider/media/{id}

**Reviews:**
- GET /api/provider/reviews
- POST /api/provider/reviews/{id}/response

**Analytics:**
- GET /api/provider/analytics?start_date=X&end_date=X

---

## Notes for Developers

1. **Real-time Updates:** Consider WebSocket for booking notifications
2. **Auto-save:** Implement auto-save for long forms (profile editing)
3. **Image Optimization:** Compress uploads, generate thumbnails
4. **Validation:** Client-side + server-side validation on all forms
5. **Permissions:** Hide/disable features based on verification status
6. **Performance:** Lazy load charts and heavy components
7. **Caching:** Cache dashboard stats with reasonable TTL