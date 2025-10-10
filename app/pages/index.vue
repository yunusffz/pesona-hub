<template>
  <main class="min-h-screen flex flex-col gap-20">
    <HeroSection />
    <SolutionsSection />
    <StatisticSection />
    <section class="p-20 bg-[#FAFAFA] flex flex-col gap-[60px]">
      <CatalogSection />
    </section>
  </main>
</template>

<script setup lang="ts">
  import HeroSection from "~/components/features/landing/hero-section/HeroSection.vue";
  import SolutionsSection from "~/components/features/landing/solution-section/SolutionSection.vue";
  import StatisticSection from "~/components/features/landing/statistic-section/StatisticSection.vue";
  import CatalogSection from "~/components/features/landing/catalog-section/CatalogSection.vue";
</script>
