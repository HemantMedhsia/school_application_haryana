/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBackground: "#283046", // Custom background color
        customText: "#FFFFFF", // Custom text color
        placeholder: "#A0AEC0", // Placeholder text color
        gold: {
          500: '#d4af37',
          600: '#b7950b',
          700: '#a17c00',
        },
      },
      container: {
        center: true,
        padding: "2rem", // Center the container with padding
      },
      transitionProperty: {
        width: "width",
        spacing: "margin, padding",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
    },
  },
  variants: {
    extend: {
      display: ["responsive"],
      visibility: ["responsive"],
      flexWrap: ["responsive"],
    },
  },
  plugins: [],
};
