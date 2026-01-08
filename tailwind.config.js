/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wnrs: {
          red: '#C31C23',
          offwhite: '#F5F5F5',
          black: '#0a0a0a',
          darkgrey: '#1a1a1a'
        }
      }
    }
  },
  plugins: []
}
