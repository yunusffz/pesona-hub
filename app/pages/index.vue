<template>
  <main class="min-h-screen flex flex-col gap-20">
    <HeroSection />
    <OurSolutionsSection />
  </main>
</template>

<script setup lang="ts">
  import HeroSection from "~/components/features/landing/hero-section/HeroSection.vue";
  import OurSolutionsSection from "~/components/features/landing/our-solutions-section/OurSolutionsSection.vue";
</script>
