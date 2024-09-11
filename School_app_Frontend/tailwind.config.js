/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBackground: '#283046', // Custom background color
        customText: '#FFFFFF',       // Custom text color
        placeholder: '#A0AEC0',      // Placeholder text color
      },
      container: {
        center: true,
        padding: '2rem',             // Center the container with padding
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
    },
  },
  variants: {
    extend: {
      display: ['responsive'],
      visibility: ['responsive'],
      flexWrap: ['responsive'],
    },
  },
  plugins: [],
};
