<template>
  <Kolaborasi />
</template>

<script setup lang="ts">
import Kolaborasi from "~/components/features/cms/kolaborasi/Kolaborasi.vue";

definePageMeta({
  layout: "cms",
  middleware: "auth",
  requiresAuth: true,
});
</script>
