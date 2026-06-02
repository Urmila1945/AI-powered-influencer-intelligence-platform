/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        primary: '#3b82f6', // Professional Blue
        secondary: '#8b5cf6', // Premium Violet
        accent: '#f59e0b', // Amber
        success: '#10b981', // Emerald
        danger: '#ef4444', // Red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
