<template>
  <section class="flex flex-col gap-20">
    <HeroSection />
    <SolutionsSection />
    <StatisticSection />
    <section
      class="relative 2xl:-mx-[calc((100vw-1536px)/2)] 2xl:px-[calc((100vw-1536px)/2)]"
    >
      <div class="bg-[#FAFAFA] absolute inset-0"></div>
      <div class="relative p-20 flex flex-col gap-[60px]">
        <ProductSection />
        <TourSection />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
  import HeroSection from "~/components/features/landing/hero-section/HeroSection.vue";
  import SolutionsSection from "~/components/features/landing/solution-section/SolutionSection.vue";
  import StatisticSection from "~/components/common/statistic-section/StatisticSection.vue";
  import ProductSection from "~/components/features/landing/product-section/ProductSection.vue";
  import TourSection from "~/components/features/landing/tour-section/TourSection.vue";
</script>
