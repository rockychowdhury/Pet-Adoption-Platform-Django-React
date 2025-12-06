/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic System
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          surface: 'var(--color-bg-surface)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          inverted: 'var(--color-text-inverted)',
        },
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
        },
        border: 'var(--color-border)',

        // Legacy/Direct mappings (keeping some for safety but mapping to new system)
        action: 'var(--color-brand-primary)',
        secondary: 'var(--color-brand-secondary)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        logo: ['Concert One', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
        },
        screens: {
          sm: '100%',
          md: '100%',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },

      },
      boxShadow: {
        'custom-light': '0 4px 6px rgba(0, 0, 0, 0.1)', // Light shadow
        'custom-dark': '0 4px 6px rgba(0, 0, 0, 0.4)', // Dark shadow
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.1)', // Soft shadow for cards
      },
      spacing: {
        128: '32rem', // Custom large spacing
        144: '36rem', // Extra-large spacing
      },
      borderRadius: {
        '4xl': '2rem', // Extra rounded corners
      },
      screens: {
        xs: '480px', // Added custom breakpoint for extra small screens
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}