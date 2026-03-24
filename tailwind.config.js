// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Creato Display", // font body brand
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "Rockdale FREE", // font heading brand
          "Playfair Display",
          "serif",
        ],
      },

      colors: {
        brand: {
          gold: "#D4AF37",
          dark: "#0F172A", // BIARKAN. Jika ingin selaras total, ganti ke "#272925".
          soft: "#F7F3E8",
          ivory: "#FFFBF3",
          cream: "#F8F6ED",
          gold: "#D1A799",
          olive: "#50553C",
          wine: "#683730",
          coal: "#272925",
        },
      },

      boxShadow: {
        luxe: "0 12px 24px rgba(16,24,40,.08), 0 6px 16px rgba(212,175,55,.12)",
      },
    },
  },
  plugins: [],
};
