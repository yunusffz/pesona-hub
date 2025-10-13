<template>
  <main class="min-h-screen flex flex-col gap-20">
    <HeroSection />
    <SolutionsSection />
    <StatisticSection />
    <section class="p-20 bg-[#FAFAFA] flex flex-col gap-[60px]">
      <ProductSection />
      <TourSection />
    </section>
  </main>
</template>

<script setup lang="ts">
  import HeroSection from "~/components/features/landing/hero-section/HeroSection.vue";
  import SolutionsSection from "~/components/features/landing/solution-section/SolutionSection.vue";
  import StatisticSection from "~/components/features/landing/statistic-section/StatisticSection.vue";
  import ProductSection from "~/components/features/landing/product-section/ProductSection.vue";
  import TourSection from "~/components/features/landing/tour-section/TourSection.vue";
</script>
