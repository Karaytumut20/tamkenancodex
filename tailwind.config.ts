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
          1000: "#031a46",
          950: "#042154",
          900: "#062a66",
          850: "#083278",
          800: "#0a3a8a",
        },
        primary: {
          700: "#004BCA",
          600: "#0055FF",
          500: "#0066FF",
          400: "#3B82F6",
          300: "#60A5FA",
          50: "#FFFFFF",
        },
        cyan: {
          500: "#00C2FF",
          400: "#00D0FF",
        },
        success: {
          600: "#00A350",
          500: "#00C460",
          400: "#10D876",
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
