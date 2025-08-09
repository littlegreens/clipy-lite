/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Colors
        primary: {
          50: '#e8f4fd',
          100: '#d1e9fb',
          200: '#a3d2f7',
          300: '#74bcf3',
          400: '#46a5ef',
          500: '#1976d2', // Primary
          600: '#1565c0',
          700: '#0d47a1',
          800: '#0a3d91',
          900: '#073282',
        },
        surface: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fafafa',
          300: '#f5f5f5',
          400: '#eeeeee',
          500: '#e0e0e0',
          600: '#bdbdbd',
          700: '#757575',
          800: '#424242',
          900: '#212121',
        }
      },
      fontFamily: {
        'sans': ['Roboto', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '480px', // Max width per mobile-first anche su desktop
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}