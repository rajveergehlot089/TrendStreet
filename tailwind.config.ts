import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#4A1216",
          dark: "#3B0E12",
          light: "#5A171C",
          50: "#FAF3F3",
          100: "#F3E3E4",
          200: "#E3C2C4",
          300: "#CF9B9E",
          400: "#B36B70",
          500: "#8D3C42",
          600: "#6B1D24",
          700: "#55151A",
          800: "#4A1216",
          900: "#360C0F",
          950: "#2B080A",
        },
        crimson: {
          DEFAULT: "#6B1D24",
          hover: "#7E232B",
          active: "#55151A",
          light: "#8D3039",
        },
        espresso: {
          DEFAULT: "#2B080A",
          dark: "#1E0507",
          light: "#3E0F12",
        },
        ivory: {
          DEFAULT: "#F9F6F4",
          dark: "#F0EAE5",
          light: "#FFFFFF",
          muted: "#EFE8E2",
        },
        gold: {
          DEFAULT: "#C5A880",
          light: "#D8C09D",
          dark: "#A3865D",
          rich: "#D4AF37",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
