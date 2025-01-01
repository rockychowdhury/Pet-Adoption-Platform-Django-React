/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marble: '#F2F8FC',
        action: '#896442',
        newBg: '#f3f6f8',
        primary: '#FCEED2',
        secondary: '#FFE2B8',
        dark: '#1C1C1E',
        natural: '#333333',
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
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}