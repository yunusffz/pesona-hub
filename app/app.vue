<template>
  <!-- This renders your selected layout -->
  <NuxtLayout>
    <!-- This renders your route (pages/index.vue, pages/about.vue, etc.) -->
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  // You can add global components, composables, etc. here
</script>

<style>
  /* global css or font imports */
  body {
    font-family: "Instrument Sans", sans-serif;
  }
</style>
