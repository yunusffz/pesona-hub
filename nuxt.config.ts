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
  ],
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
          },
        },
      },
    },
  },
});
