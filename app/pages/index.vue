<template>
  <main class="min-h-screen flex flex-col gap-20 max-w-[1536px] mx-auto">
    <Navbar />

    <HeroSection />
    <SolutionsSection />
    <StatisticSection />
    <section
      class="relative -mx-[calc((100vw-1536px)/2)] px-[calc((100vw-1536px)/2)]"
    >
      <div class="bg-[#FAFAFA] absolute inset-0"></div>
      <div class="relative p-20 flex flex-col gap-[60px]">
        <ProductSection />
        <TourSection />
      </div>
    </section>
    <Footer />
  </main>
</template>

<script setup lang="ts">
  import HeroSection from "~/components/features/landing/hero-section/HeroSection.vue";
  import SolutionsSection from "~/components/features/landing/solution-section/SolutionSection.vue";
  import StatisticSection from "~/components/common/statistic-section/StatisticSection.vue";
  import ProductSection from "~/components/features/landing/product-section/ProductSection.vue";
  import TourSection from "~/components/features/landing/tour-section/TourSection.vue";
  import Navbar from "~/components/layout/navbar/Navbar.vue";
  import Footer from "~/components/layout/Footer/Footer.vue";
</script>
