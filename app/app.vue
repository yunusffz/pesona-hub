<template>
  <!-- This renders your selected layout -->
  <NuxtLayout>
    <!-- This renders your route (pages/index.vue, pages/about.vue, etc.) -->
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  // You can add global components, composables, etc. here
  useSeoMeta({
    title: "Pesona Hub Digi",
    titleTemplate: "%s | Pesona Hub Digi",
    description: "Pesona Hub Digi - Platform untuk Mitra Perhutanan Sosial",
    ogTitle: "Pesona Hub Digi",
    ogDescription: "Pesona Hub Digi - Platform untuk Mitra Perhutanan Sosial",
    ogImage: "/assets/images/logo.png",
    twitterCard: "summary_large_image",
  });

  useHead({
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
  });
</script>

<style>
  /* global css or font imports */
  body {
    font-family: "Instrument Sans", sans-serif;
  }
</style>
