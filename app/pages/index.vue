<template>
  <main class="min-h-screen flex flex-col gap-20">
    <HeroSection />
    <SolutionsSection />
    <StatisticSection />
    <CatalogSection />
  </main>
</template>

<script setup lang="ts">
  import HeroSection from "~/components/features/landing/hero-section/HeroSection.vue";
  import SolutionsSection from "~/components/features/landing/solution-section/SolutionSection.vue";
  import StatisticSection from "~/components/features/landing/statistic-section/StatisticSection.vue";
  import CatalogSection from "~/components/features/landing/catalog-section/CatalogSection.vue";
</script>
