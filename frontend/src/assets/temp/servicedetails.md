# Service Provider Details - UI Documentation

## Overview
Dynamic service provider details page that adapts layout based on service type (Foster, Veterinary, Trainer, Groomer, Pet Sitter).

---

## Common Header Section (All Service Types)

### Hero Section
- **Primary Photo**: Full-width hero image (provider's primary media)
- **Photo Gallery Indicator**: Small thumbnails overlay (bottom-right) showing additional photos
- **Back Button**: Top-left corner

### Provider Info Bar
```
[Business Name]                    [Verification Badge]
[Category Icon] [Category Name]
[Star Rating] ([Review Count] reviews)  •  [Starting Price]
```

### Quick Actions Row
- **Book Now** button (primary CTA)
- **Contact** button
- **Share** icon
- **Save/Favorite** icon

---

## Tab Navigation
```
Overview | Services & Pricing | Reviews | About
```

---

## Tab 1: Overview

### Location & Contact Card
- Full address with map pin icon
- Phone number (clickable)
- Business email (clickable)
- Website link (if available)
- **View on Map** button

### Business Hours
- Day-by-day schedule in table format
- Highlight current day
- Show "Open Now" or "Closed" status badge

### Key Information Grid
Display 2-3 columns of service-specific highlights:

**Foster Services:**
- Capacity: X/Y animals
- Species Accepted (icon badges)
- Environment type (indoor/outdoor space)
- Daily Rate: $XX

**Veterinary Clinics:**
- Clinic Type badge
- Emergency Services (Yes/No with icon)
- Species Treated (icon badges)
- Currently: Open/Closed

**Trainer Services:**
- Training Method badge
- Years Experience: X years
- Specializations (tag list)
- Session Rate: $XX/hour

**Groomer Services:**
- Salon Type (Salon/Mobile)
- Species Accepted (icon badges)
- Amenities (icon list)
- Starting at: $XX

**Pet Sitter Services:**
- Service Types (icons: walking, house sitting, drop-in)
- Service Radius: X km
- Years Experience: X years
- Insured badge (if applicable)

### Featured Reviews (2 most recent)
- Reviewer name + date
- Star rating
- Review excerpt (2-3 lines)
- **See All Reviews** link

---

## Tab 2: Services & Pricing

### Foster Services
**Pricing Table:**
- Daily Rate: $XX
- Weekly Rate: $XX (X% discount)
- Monthly Rate: $XX

**Environment Details** (expandable sections):
- Indoor Space
- Outdoor/Yard Information
- Other Animals Present
- Safety Features

**Care Standards:**
- Feeding Schedule
- Exercise Routine
- Medical Care Protocol
- Socialization Approach

**Video Tour** (if available):
- Embedded video player

---

### Veterinary Clinics

**Services Offered** (card grid):
Each service card shows:
- Service name
- Brief description
- Price (if available)

**Specializations** (tag list)

**Pricing Information:**
- Text block with pricing details
- Link to request detailed quote

**Amenities** (icon grid):
- On-site Pharmacy
- Digital X-Ray
- Surgery Suite
- etc.

---

### Trainer Services

**Training Philosophy Card:**
- Primary Method badge
- Philosophy text (expandable)
- Years Experience
- Certifications (badge list)

**Service Options Table:**
| Service Type | Rate | Available |
|--------------|------|-----------|
| Private Session | $XX/hour | ✓ |
| Group Classes | $XX/class | ✓/✗ |
| Board & Train | Contact | ✓/✗ |
| Virtual Training | $XX/session | ✓/✗ |

**Package Options** (if available):
Cards showing:
- Package name
- Number of sessions
- Total price
- Description

**Specializations:**
- Behavioral Issues
- Obedience Training
- Agility
- etc. (tag list)

**Client Availability:**
- Status badge: "Accepting New Clients" or "Waitlist"
- Current capacity: X/Y clients

**Demo Video** (if available)

---

### Groomer Services

**Service Menu** (card/list format):
Each service shows:
- Service name
- Description
- Price
- Estimated duration

**Species & Size Accepted:**
- Icon badges for species
- Note about size restrictions (if any)

**Salon Type:**
- Badge: Salon Based / Mobile / Both
- Service radius (if mobile)

**Amenities** (icon list):
- Hypoallergenic Products
- Cat-Friendly Facility
- Heated Dryers
- etc.

---

### Pet Sitter Services

**Services Offered Grid:**

**Dog Walking:**
- Rate: $XX per walk
- Duration options
- Available times

**House Sitting:**
- Daily rate: $XX
- Overnight included
- Home care details

**Drop-In Visits:**
- Rate: $XX per visit
- Visit duration
- Services included

**Additional Information:**
- Service radius: X km map indicator
- Transportation available: Yes/No
- Insured: Yes/No badge
- Species accepted (icons)

---

## Tab 3: Reviews

### Review Summary Bar
```
[Overall Rating: X.X ★★★★☆] [Total Reviews]

Rating Breakdown (horizontal bars):
Communication:  ★★★★☆ X.X
Cleanliness:    ★★★★★ X.X
Quality of Care: ★★★★☆ X.X
Value for Money: ★★★★☆ X.X
```

### Filters
- Sort by: Most Recent / Highest Rated / Lowest Rated
- Filter by: All Ratings / 5 Stars / 4 Stars / etc.

### Review List
Each review card:
- Reviewer name + verified badge (if applicable)
- Date
- Overall star rating
- Detailed ratings (collapsible)
- Review text
- Photo (if attached)
- Service used badge

### Load More Button

---

## Tab 4: About

### Business Description
- Full text description (500+ words)
- Formatted with paragraphs

### License & Insurance (if applicable)
- License number
- Insurance details
- Verification status badge

### Location Details
- Full address
- Embedded map
- Directions link

### Contact Information
- All contact methods listed
- Contact form (optional)

---

## Mobile Responsive Notes

### Breakpoints
- **Mobile**: Single column layout
- **Tablet**: 2-column grid where applicable
- **Desktop**: Full multi-column layout

### Mobile-Specific Changes
- Sticky "Book Now" button at bottom
- Collapsible sections for long content
- Swipeable photo gallery
- Tabs convert to accordion menu
- Map shows as static image with "Open in Maps" link

---

## Interactive Elements

### Modals/Overlays
- **Photo Gallery**: Full-screen slideshow
- **Booking Form**: Overlay with date/time selection
- **Contact Form**: Quick message to provider
- **Map View**: Expanded map with directions

### Loading States
- Skeleton screens for initial load
- Shimmer effect for images
- Disabled state for unavailable services

### Error States
- Provider not found: 404 page
- Service unavailable: Clear message with alternatives
- Failed to load: Retry button

---

## API Data Requirements

Ensure API returns:
- Provider base info (name, category, address, contact)
- Service-specific details (based on category)
- Media array (ordered by is_primary)
- Business hours array
- Reviews with aggregated ratings
- Verification status
- Current availability/capacity

---

## Notes for Developers

1. **Conditional Rendering**: Show/hide sections based on service category
2. **Dynamic Pricing**: Handle various pricing structures per service type
3. **Species Icons**: Use consistent icon set for species badges
4. **Rating Display**: Reusable star rating component
5. **Image Optimization**: Lazy load gallery images
6. **Accessibility**: Proper ARIA labels, keyboard navigation
7. **SEO**: Structured data for local business markup