/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chill: {
          // New "Pleasant" Dark Tones
          bg: '#212121',       // Soft Matte Black (Easier on eyes than #191A19)
          surface: '#292929',  // Neutral Dark Grey (For sidebars/sections)
          card: '#303030',     // Soft Card Surface (Elevated)
          highlight: '#424242', // Hover states / interactive elements
          
          // Accents (Kept same or adjusted slightly for new background)
          sage: '#D4E09B',
          rose: '#D4A5A5',
          blue: '#9CAFB7',
          sand: '#EAD2AC',
          terra: '#E5B299',
          lavender: '#C8B8DB',
        }
      },
      boxShadow: {
        'glow-sage': '0 0 15px -3px rgba(212, 224, 155, 0.2)',
      }
    },
  },
  plugins: [],
}