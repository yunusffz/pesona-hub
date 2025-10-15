<template>
  <main class="min-h-screen flex flex-col">
    <NavbarWhite />

    <section class="mt-[100px]">
      <HeroSection />
      <FaqSection />
    </section>
    <Footer />
  </main>
</template>
<script setup lang="ts">
  import NavbarWhite from "~/components/layout/navbar/NavbarWhite.vue";
  import Footer from "~/components/layout/Footer/Footer.vue";
  import HeroSection from "~/components/features/faq/hero-section/HeroSection.vue";
  import FaqSection from "~/components/features/faq/faq-section/FaqSection.vue";
</script>
