/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A2463',
          50: '#E8EDF8',
          100: '#C5D1EE',
          200: '#8EA5DD',
          300: '#5779CC',
          400: '#2F54B8',
          500: '#0A2463',
          600: '#081D50',
          700: '#06163D',
          800: '#04102A',
          900: '#020917',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50: '#F9F3E3',
          100: '#F0E2B8',
          200: '#E3CC86',
          300: '#D6B554',
          400: '#C9A84C',
          500: '#B08A2E',
          600: '#8A6C24',
          700: '#644E1A',
          800: '#3E3010',
          900: '#181206',
        },
        surface: '#F5F7FA',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
