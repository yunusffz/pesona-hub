<template>
  <section class="flex flex-col gap-20">
    <HeroSection />
    <StatisticSection />
    <UsSection />
    <OurJourneySection />
    <CTASection />
  </section>
</template>
<script setup lang="ts">
  import HeroSection from "~/components/features/about/hero-section/HeroSection.vue";
  import StatisticSection from "~/components/common/statistic-section/StatisticSection.vue";
  import UsSection from "~/components/features/about/us-section/UsSection.vue";
  import OurJourneySection from "~/components/features/about/our-journey-section/OurJourneySection.vue";
  import CTASection from "~/components/features/about/cta-section/CTASection.vue";
</script>
