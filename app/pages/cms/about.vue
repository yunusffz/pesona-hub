<template>
  <AboutUs />
</template>

<script setup lang="ts">
import AboutUs from "~/components/features/cms/about/AboutUs.vue";

definePageMeta({
  layout: "cms",
  middleware: "auth",
  requiresAuth: true,
});
</script>
