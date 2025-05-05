import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        amazon: {
          dark: "#1A1F2C",
          light: "hsl(var(--background))",
          hover: "#2A2F3C",
        },
        border: "#14452F", // British racing green
        input: "#18392B", // Dark green
        ring: "#0F5132", // Castleton dark green
        foreground: "#212529", // Define a foreground color (e.g., dark gray)
        primary: {
          DEFAULT: "#0A5C36", // Castleton green
          foreground: "#FFFFFF", // White text
        },
        secondary: "#14452F", // British racing green
        destructive: {
          DEFAULT: "#18392B", // Dark green
          foreground: "#FFFFFF", // White text
        },
        muted: {
          DEFAULT: "#1D2E28", // Gunmetal
          foreground: "#FFFFFF", // White text
        },
        accent: {
          DEFAULT: "#0F5132", // Castleton dark green
          foreground: "#FFFFFF", // White text
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: "#FFFFFF", // Define a valid color for the card background (e.g., white)
        fastfood: {
          red: "#FF0000",
          yellow: "#FFD700",
          white: "#FFFFFF",
          background: "#FFF8E1",
          hover: "#FF4500",
        },
        greenPalette: {
          castleton: "#0A5C36",
          castletonDark: "#0F5132",
          britishRacing: "#14452F",
          darkGreen: "#18392B",
          gunmetal: "#1D2E28",
        },
        secondaryForeground: "#FFFFFF", // Define the missing class
      },
      fontFamily: {
        fastfood: ["Comic Sans MS", "Arial", "sans-serif"],
        sans: ["Arial", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        page: "#0A5C36", // Castleton green for background
      },
      textColor: {
        primary: "#FFFFFF", // White for text
        secondary: "#18392B", // Dark green for secondary text
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;