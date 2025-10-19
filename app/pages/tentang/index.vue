<template>
  <main class="min-h-screen flex flex-col max-w-screen-2xl mx-auto">
    <NavbarWhite />

    <section class="mt-[100px] flex flex-col gap-20">
      <HeroSection />
      <StatisticSection />
      <UsSection />
      <OurJourneySection />
    </section>
    <Footer />
  </main>
</template>
<script setup lang="ts">
  import NavbarWhite from "~/components/layout/navbar/NavbarWhite.vue";
  import Footer from "~/components/layout/Footer/Footer.vue";
  import HeroSection from "~/components/features/about/hero-section/HeroSection.vue";
  import StatisticSection from "~/components/common/statistic-section/StatisticSection.vue";
  import UsSection from "~/components/features/about/us-section/UsSection.vue";
  import OurJourneySection from "~/components/features/about/our-journey-section/OurJourneySection.vue";
</script>
