// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/global.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "nuxt-swiper",
    "shadcn-nuxt",
  ],
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
    ],
  },
  icon: {
    serverBundle: {
      collections: ["uil", "mdi"], // <!--- this
    },
  },
  tailwindcss: {
    exposeConfig: true,
    config: {
      theme: {
        extend: {
          colors: {
            "rich-black": "#0D0D0E",
            "forest-green": "#035925",
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
    },
  },
});
