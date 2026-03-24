// tailwind.config.ts
import { resolve } from "path";
import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    resolve(__dirname, "./components/**/*.{vue,js,ts}"),
    resolve(__dirname, "./layouts/**/*.vue"),
    resolve(__dirname, "./pages/**/*.vue"),
    resolve(__dirname, "./app.vue"),
  ],
  theme: {
    extend: {
      colors: {
        text: {
          secondary: "#9EA2AD",
        },
        "rich-black": "#0D0D0E",
        "forest-green": "#035925",
        charcoal: "#1E1E1E",
        primary: {
          DEFAULT: "#035925",
          light: "#047a32",
          dark: "#024a1c",
        },
        secondary: {
          DEFAULT: "#0D0D0E",
          light: "#1a1a1b",
          dark: "#000000",
        },
        green: {
          400: "#2A9B4C",
        },
        "sage-light": "#E7EFEA",
        neutral: {
          100: "#F5F5F5",
          200: "#E8E8E8",
          300: "#D2D2D2",
          400: "#A3A3A3",
          500: "#A4A4A4",
          700: "#777777",
          800: "#606060",
          900: "#4A4A4A",
          1000: "#333333",
        },
      },
    },
  },
  plugins: [],
};
