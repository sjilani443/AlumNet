/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f6f3',
          100: '#f0ece5',
          200: '#e0cebd',
          300: '#d4bca5',
          400: '#c8aa8d',
          500: '#4c492d',
          600: '#443f28',
          700: '#3c3623',
          800: '#342d1e',
          900: '#2c2419',
        },
        accent: {
          yellow: '#ffc101',
          red: '#d94a38',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};