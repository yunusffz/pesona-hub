// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "node:path";

export default defineNuxtConfig({
  srcDir: "app",
  alias: {
    "@": resolve(__dirname, "app"),
    "~": resolve(__dirname, "app"),
  },
  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        skipLibCheck: true,
      },
      exclude: [
        "node_modules",
        ".nuxt",
        ".output",
        "dist",
        "coverage",
        ".git",
        ".github",
        ".cursor",
        ".claude",
        "docker",
        "docs",
        "**/node_modules/**",
        "**/.nuxt/**",
        "**/.output/**",
        "**/dist/**",
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/global.css"],
  runtimeConfig: {
    public: {
      pesonaApiUrl:
        process.env.NUXT_PUBLIC_PESONA_API_URL || "http://localhost:5500",
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "nuxt-swiper",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],
  image: {
    provider: "ipx",
    ipx: {
      modifiers: {
        quality: 90,
      },
      maxAge: 86400, // Cache images for 24 hours
    },
    sharp: {
      useWasm: true,
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  fonts: {
    families: [
      {
        name: "Instrument Sans",
        provider: "google",
        weights: [400, 500, 600, 700],
        styles: ["normal"],
      },
      {
        name: "Inter",
        provider: "google",
        weights: [400, 500, 600, 700],
        styles: ["normal"],
      },
    ],
  },
  icon: {
    serverBundle: {
      collections: ["uil", "mdi"], // <!--- this
    },
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            inter: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            instrument: [
              "Instrument Sans",
              "system-ui",
              "-apple-system",
              "sans-serif",
            ],
          },
          colors: {
            background: "hsl(var(--color-background))",
            muted: "hsl(var(--color-muted))",
            popover: "hsl(var(--color-popover))",
            "muted-foreground": "hsl(var(--color-muted-foreground))",
            text: {
              secondary: "hsl(var(--color-text-secondary))",
            },
            "rich-black": "hsl(var(--color-rich-black))",
            "forest-green": "hsl(var(--color-forest-green))",
            primary: {
              DEFAULT: "hsl(var(--color-primary))",
              light: "hsl(var(--color-primary-light))",
              dark: "hsl(var(--color-primary-dark))",
              hover: "hsl(var(--color-primary-hover))",
            },
            secondary: {
              DEFAULT: "hsl(var(--color-secondary))",
              light: "hsl(var(--color-secondary-light))",
              dark: "hsl(var(--color-secondary-dark))",
            },
            green: {
              400: "hsl(var(--color-green-400))",
            },
            foreground: "hsl(var(--foreground))",
            neutral: {
              100: "hsl(var(--color-neutral-100))",
              200: "hsl(var(--color-neutral-200))",
              300: "hsl(var(--color-neutral-300))",
              400: "hsl(var(--color-neutral-400))",
              500: "hsl(var(--color-neutral-500))",
              700: "hsl(var(--color-neutral-700))",
              800: "hsl(var(--color-neutral-800))",
              900: "hsl(var(--color-neutral-900))",
              1000: "hsl(var(--color-neutral-1000))",
            },
          },
        },
      },
    },
  },
});
