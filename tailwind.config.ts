import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2f8",
          100: "#d7e0ee",
          200: "#b0c1dd",
          300: "#88a2cb",
          400: "#5476a8",
          500: "#365683",
          600: "#274169",
          700: "#1c3054",
          800: "#132140",
          900: "#0b1730",
          950: "#060e1d",
        },
        amber: {
          50: "#fffaeb",
          100: "#fef0c7",
          200: "#fedf8a",
          300: "#fdc94d",
          400: "#fbb324",
          500: "#f59a0c",
          600: "#d97706",
          700: "#b45a09",
          800: "#92460e",
          900: "#78390f",
        },
        teal: {
          50: "#eefbf9",
          100: "#d3f4ee",
          200: "#a9e8dd",
          300: "#75d4c6",
          400: "#43b8a9",
          500: "#2a9c8f",
          600: "#207d74",
          700: "#1e645e",
          800: "#1d504c",
          900: "#1b4340",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(11, 23, 48, 0.12)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "check-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out both",
        "check-pop": "check-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
