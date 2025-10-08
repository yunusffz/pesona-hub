// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
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
          colors: { "rich-black": "#0D0D0E", "forest-green": "#035925" },
        },
      },
    },
  },
});
