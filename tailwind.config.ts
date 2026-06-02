import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          1000: "#1c273e",
          950: "#22314e",
          900: "#2b3d60",
          850: "#344972",
          800: "#3d5584",
        },
        primary: {
          700: "#1c273e",
          600: "#22314e",
          500: "#2b3d60",
          400: "#344972",
          300: "#3d5584",
          50: "#FFFFFF",
        },
        cyan: {
          50: "#f0f5fa",
          100: "#d9e6f2",
          200: "#b3cce0",
          300: "#8cb3cf",
          400: "#4f81ac",
          500: "#3d6b93",
          600: "#305575",
          700: "#244057",
          800: "#182b3a",
          900: "#0c151d",
          950: "#060b0f",
        },
        success: {
          600: "#2b3d60",
          500: "#3d6b93",
          400: "#4f81ac",
        },
        // Keep white surfaces pure white across the site.
        slate: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        surface: {
          DEFAULT: "#F9FAFB",
          soft: "#F3F4F6",
        },
        border: {
          DEFAULT: "#E5E5E5",
          strong: "#CCCCCC",
        },
        ink: {
          DEFAULT: "#051433",
          muted: "#455A7B",
          lightMuted: "#768CAE",
        },
      },

      fontFamily: {
        sans: ['"Google Sans"', "Inter", "Arial", "sans-serif"],
      },
      borderRadius: {
        panel: "22px",
        offer: "28px",
      },
    },
  },
  plugins: [],
};

export default config;
