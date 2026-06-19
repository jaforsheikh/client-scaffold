import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#B91C1C",
          dark: "#7F1D1D",
          tint: "#FEE2E2",
        },
        teal: {
          DEFAULT: "#0F766E",
          dark: "#115E59",
          tint: "#CCFBF1",
        },
        ink: {
          DEFAULT: "#18181B",
          soft: "#3F3F46",
          muted: "#71717A",
          faint: "#A1A1AA",
        },
        surface: {
          page: "#FFF7F3",
          card: "#FFFFFF",
          soft: "#FAFAFA",
          border: "#F1E7E4",
        },
        state: {
          success: "#15803D",
          successTint: "#DCFCE7",
          warning: "#D97706",
          warningTint: "#FEF3C7",
          danger: "#DC2626",
        },
      },
      boxShadow: {
        soft: "0 18px 45px -30px rgba(127, 29, 29, 0.35)",
        card: "0 16px 35px -28px rgba(24, 24, 27, 0.45)",
        glow: "0 20px 55px -35px rgba(185, 28, 28, 0.55)",
      },
      borderRadius: {
        card: "22px",
        button: "14px",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        scaffold: {
          primary: "#B91C1C",
          "primary-focus": "#7F1D1D",
          "primary-content": "#FFFFFF",
          secondary: "#0F766E",
          accent: "#D97706",
          neutral: "#18181B",
          "base-100": "#FFF7F3",
          "base-200": "#FFFFFF",
          "base-300": "#F1E7E4",
          "base-content": "#18181B",
          info: "#2563EB",
          success: "#15803D",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
    ],
  },
};