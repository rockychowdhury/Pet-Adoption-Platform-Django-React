---
description: Homepage UI Design Signature for consistency across the PetCircle project.
---

# Home Page UI Design Signature

Follow these guidelines to ensure visual consistency between the Homepage and all other pages in the project.

## 1. Typography
- **Headings (Brand/Section)**: Use `font-logo` (`Concert One`). 
  - Example: `className="font-logo font-black tracking-tight text-text-primary"`
- **Body & Sub-headings**: Use `font-jakarta` (`Plus Jakarta Sans`).
  - Example: `className="font-jakarta text-text-secondary font-medium"`
- **Action Items (Buttons/Badges)**: Use uppercase with increased letter spacing.
  - Example: `className="font-black uppercase tracking-[0.2em] text-[10px]"`

## 2. Colors & Surfaces
- **Primary Background**: `bg-bg-primary`
- **Secondary Surfaces (Cards)**: `bg-bg-surface` or `bg-bg-secondary/40` with `backdrop-blur-xl`.
- **Primary Brand Color**: `text-brand-primary` (#5B8A72).
- **Secondary Brand Color**: `text-brand-secondary` (#C98B6B).
- **Borders**: Use variable-based borders: `border-border/50` or `border-white/10` (for glass effects).

## 3. Shapes & Layout
- **Large Container Cards**: `rounded-[48px]`.
- **Standard Cards**: `rounded-3xl` or `rounded-[32px]`.
- **Buttons**: `rounded-full` for primary actions, `rounded-xl` for secondary/utilitarian ones.
- **Section Spacing**: High vertical padding (`py-24` or `py-32`) to allow content to "breathe".

## 4. Animations (Framer Motion)
- **Entrance**: Staggered fades and slight Y-axis slides.
  ```javascript
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  ```
- **Hover States**: Use smooth transitions for scale and shadow.
  - Example: `hover:scale-[1.02] hover:shadow-2xl transition-all duration-500`
- **Interactive Layers**: Use rotated decorative elements (stars, circles) with slow infinite rotations.

## 5. Dark Mode Compatibility
- **Image Overlays**: Light images should have a `dark:bg-black/40` overlay or a dark mix-blend.
- **Badge Backgrounds**: Use `bg-bg-surface/90` instead of white for floating elements.
- **Text Contrast**: Use `dark:text-text-secondary/90` to ensure readability.
- **Icon Filtering**: Use `dark:invert` for dark icons on light textures that need to flip.
