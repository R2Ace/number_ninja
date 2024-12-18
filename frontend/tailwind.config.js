// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ninja-dark': '#0F172A',
        'ninja-blue': '#4A90E2',
        'ninja-gray': '#64748B'
      },
      fontFamily: {
        'sans': ['Roboto', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}
