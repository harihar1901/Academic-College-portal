/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#2d3a2e",
          green: "#3d5a3e",
          light: "#f5f3ef",
          cream: "#faf8f5",
          accent: "#4c6e4e",
          sand: "#e8e5dc",
          muted: "#6e7b6f"
        }
      },
      fontFamily: {
        'serif': ['"Source Serif 4"', 'Georgia', 'serif'],
        'sans': ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        'source-serif': ['"Source Serif 4"', 'Georgia', 'serif'],
        'inter': ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        'display': ['"Source Serif 4"', 'Georgia', 'serif'],
        'playfair': ['"Source Serif 4"', 'Georgia', 'serif'],
        'helvetica-neue': ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        'jakarta': ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        'oswald': ['"Oswald"', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
        'roboto-slab': ['"Roboto Slab"', 'serif'],
        'raleway': ['"Raleway"', 'sans-serif']
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-down': 'fade-down 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
