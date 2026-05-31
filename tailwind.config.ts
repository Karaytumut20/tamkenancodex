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
          1000: "#030D21",
          950: "#051433",
          900: "#081C44",
          850: "#0C2556",
          800: "#102E68",
        },
        primary: {
          700: "#004BCA",
          600: "#0055FF",
          500: "#0066FF",
          400: "#3B82F6",
          300: "#60A5FA",
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
        surface: {
          DEFAULT: "#F4F8FD",
          soft: "#E6EFFB",
        },
        border: {
          DEFAULT: "#D0E0F5",
          strong: "#A8C5EC",
        },
        ink: {
          DEFAULT: "#051433",
          muted: "#455A7B",
          lightMuted: "#768CAE",
        },
      },
      boxShadow: {
        card: "0 0 40px -10px rgba(0, 80, 255, 0.1)",
        glow: "0 0 60px 0px rgba(0, 100, 255, 0.4)",
        glass: "inset 0 1px 1px rgba(255,255,255,0.1)",
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
