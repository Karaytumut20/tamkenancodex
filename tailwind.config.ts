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
          1000: "#020817",
          950: "#031126",
          900: "#061A35",
          850: "#082246",
          800: "#0A2B5C",
        },
        primary: {
          700: "#005BEA",
          600: "#006BFF",
          500: "#1683FF",
          400: "#3BA0FF",
          300: "#70BDFF",
        },
        cyan: {
          500: "#18BFFF",
          400: "#4CD9FF",
        },
        success: {
          600: "#00B85A",
          500: "#00D46A",
          400: "#26F58A",
        },
        surface: {
          DEFAULT: "#F7FAFF",
          soft: "#F1F6FC",
        },
        border: {
          DEFAULT: "#DCE7F5",
          strong: "#BFD0E7",
        },
        ink: {
          DEFAULT: "#06142E",
          muted: "#5D6B82",
          lightMuted: "#B8C7DD",
        },
      },
      boxShadow: {
        card: "0 14px 40px rgba(6, 20, 46, 0.08)",
        glow: "0 0 0 1px rgba(22, 131, 255, 0.28), 0 16px 44px rgba(0, 107, 255, 0.24)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
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
