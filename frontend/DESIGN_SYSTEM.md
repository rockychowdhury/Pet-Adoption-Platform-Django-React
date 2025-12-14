# PetCircle Design System

## Overview
This document outlines the unified design system for PetCircle, ensuring consistency across all pages and components.

## Design Principles

1. **Consistency** - Single theme system used throughout the entire application
2. **Accessibility** - WCAG 2.1 AA compliant color contrasts and focus states
3. **Responsiveness** - Mobile-first approach with breakpoints for all screen sizes
4. **User Experience** - Smooth transitions, clear feedback, and intuitive interactions

## Color System

### Semantic Color Variables
All colors are defined as CSS variables in `index.css` and work seamlessly in both light and dark modes.

#### Background Colors
- `--color-bg-primary` - Main background color
- `--color-bg-secondary` - Secondary background (cards, panels)
- `--color-bg-surface` - Surface elements (modals, elevated cards)
- `--color-bg-overlay` - Overlay for modals and dialogs

#### Text Colors
- `--color-text-primary` - Primary text (headings, important content)
- `--color-text-secondary` - Secondary text (descriptions, labels)
- `--color-text-tertiary` - Tertiary text (placeholders, hints)
- `--color-text-inverted` - Text for dark backgrounds
- `--color-text-muted` - Muted text (disabled states)

#### Brand Colors
- `--color-brand-primary` - Primary brand color (buttons, links)
- `--color-brand-secondary` - Secondary brand color (accents, highlights)
- `--color-brand-accent` - Accent color (special highlights)

#### Border Colors
- `--color-border` - Default border
- `--color-border-light` - Light border
- `--color-border-focus` - Focus state border
- `--color-border-error` - Error state border

#### Status Colors
- `--color-status-success` - Success messages and states
- `--color-status-error` - Error messages and states
- `--color-status-warning` - Warning messages and states
- `--color-status-info` - Info messages and states

## Light Mode Colors

### Backgrounds
- Primary: `#FFF8E7` (Warm cream)
- Secondary: `#FDE4C3` (Soft peach)
- Surface: `#FFFFFF` (Pure white)

### Text
- Primary: `#1F2937` (Charcoal gray)
- Secondary: `#57534E` (Warm stone)
- Tertiary: `#9CA3AF` (Muted gray)

### Brand
- Primary: `#2D2D2D` (Charcoal - buttons, links)
- Secondary: `#A68A6D` (Warm brown/gold)
- Accent: `#D4B896` (Light gold)

## Dark Mode Colors

### Backgrounds
- Primary: `#0F172A` (Deep slate)
- Secondary: `#1E293B` (Slate 800)
- Surface: `#1E293B` (Slate 800)

### Text
- Primary: `#F8FAFC` (Slate 50 - bright white)
- Secondary: `#94A3B8` (Slate 400)
- Tertiary: `#64748B` (Slate 500)

### Brand
- Primary: `#FDBA74` (Warm orange)
- Secondary: `#818CF8` (Indigo)
- Accent: `#A78BFA` (Purple)

## Component Classes

### Buttons
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-ghost` - Ghost/transparent button
- `.btn-outline` - Outlined button
- `.auth-button` - Authentication button (uses primary styling)

### Inputs
- `.input-field` - Standard input field
- `.input-error` - Input with error state
- `.input-success` - Input with success state
- `.auth-input` - Authentication input (uses standard styling)

### Cards
- `.card` - Standard card component
- `.card-hover` - Card with hover effects

### Alerts
- `.alert-success` - Success message
- `.alert-error` - Error message
- `.alert-warning` - Warning message
- `.alert-info` - Info message

### Layout
- `.auth-container` - Full-screen auth container
- `.auth-card` - Auth card component
- `.divider` - Divider with text
- `.divider-text` - Text in divider

## Typography

### Font Families
- Primary: `Inter` - Main body text
- Secondary: `Poppins` - Headings and emphasis
- Logo: `Concert One` - Logo and branding
- Roboto: `Roboto` - Alternative body text

### Font Sizes
- Use Tailwind's default scale: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

### Font Weights
- Regular: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)

## Spacing

Use Tailwind's spacing scale:
- `p-4`, `p-6`, `p-8` for padding
- `m-4`, `m-6`, `m-8` for margin
- `gap-2`, `gap-4`, `gap-6` for flex/grid gaps

## Border Radius

- Small: `rounded-lg` (8px)
- Medium: `rounded-xl` (12px)
- Large: `rounded-2xl` (16px)
- Extra Large: `rounded-3xl` (24px)

## Shadows

- Soft: `shadow-soft` - Subtle shadow for cards
- Custom Light: `shadow-custom-light` - Light mode shadows
- Custom Dark: `shadow-custom-dark` - Dark mode shadows

## Transitions

All interactive elements use smooth transitions:
- Duration: `duration-200` (200ms) for most interactions
- Duration: `duration-300` (300ms) for color changes
- Easing: Default Tailwind easing

## Animations

- `.animate-fade-in-up` - Fade in with upward motion
- `.animate-fade-in` - Simple fade in
- `.animate-slide-in` - Slide in from left

## Usage Guidelines

### Do's ✅
- Always use semantic color variables (`bg-primary`, `text-primary`, etc.)
- Use component classes (`.btn-primary`, `.input-field`) for consistency
- Maintain consistent spacing using Tailwind's scale
- Use transitions for all interactive elements
- Test in both light and dark modes

### Don'ts ❌
- Don't use hardcoded hex colors (e.g., `#2D2D2D`)
- Don't use the old `auth-*` color classes
- Don't create custom colors outside the design system
- Don't skip transitions on interactive elements
- Don't use inline styles for colors

## Migration Notes

### From Old Auth Theme
If you find components using the old `auth-*` classes, replace them:

- `auth-text-primary` → `text-text-primary`
- `auth-text-secondary` → `text-text-secondary`
- `auth-gold` → `text-brand-secondary` or `bg-brand-secondary`
- `auth-panel` → `bg-bg-primary`
- `auth-container` → `bg-bg-surface`
- `auth-input` → `bg-bg-secondary` (use `.input-field` class)
- `auth-border` → `border-border`

### From Hardcoded Colors
Replace hardcoded colors with semantic variables:

- `#2D2D2D` → `bg-brand-primary` or `text-brand-primary`
- `#A68A6D` → `bg-brand-secondary` or `text-brand-secondary`
- `#373F4F` → `bg-bg-primary`
- `#FFFFFF` → `bg-bg-surface` or `text-text-inverted`

## Accessibility

- All color combinations meet WCAG 2.1 AA contrast requirements
- Focus states are clearly visible with ring utilities
- Interactive elements have proper hover and active states
- Form inputs have proper labels and error states

## Responsive Breakpoints

- `xs`: 480px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1440px

## Examples

### Button
```jsx
<button className="btn-primary">
  Click Me
</button>
```

### Input
```jsx
<input 
  type="text" 
  className="input-field" 
  placeholder="Enter text"
/>
```

### Card
```jsx
<div className="card">
  <h2 className="text-text-primary">Card Title</h2>
  <p className="text-text-secondary">Card content</p>
</div>
```

### Alert
```jsx
<div className="alert-error">
  Error message here
</div>
```

---

**Last Updated:** After design system unification
**Status:** Active - All components should follow this system

