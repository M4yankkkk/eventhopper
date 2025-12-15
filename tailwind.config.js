/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tech: '#06b6d4',
        cultural: '#ec4899',
        sports: '#10b981',
        workshop: '#f97316',
      }
    },
  },
  plugins: [],
}
