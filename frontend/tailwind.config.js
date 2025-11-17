/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",  // Tell Tailwind to scan these files for classes
    "./src/**/*.{js,jsx,ts,tsx}",  // Tell Tailwind to scan these files for classes
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for our trading app
        'trading-green': '#10b981',  // For profit/buy signals
        'trading-red': '#ef4444',    // For loss/sell signals
        'dark-bg': '#1a1a1a',       // Dark theme background
      }
    },
  },
  plugins: [],
}