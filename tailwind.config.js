/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ffe6ef',
          100: '#fbd0e0',
          200: '#f7bcd0',
          300: '#ee8fb0',
          400: '#e46290',
          500: '#c02559',
          600: '#a41f4c',
          700: '#87193f',
          800: '#6b1332',
          900: '#4f0d25',
        },
      },
      fontFamily: {
        display: ['Amaranth', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
