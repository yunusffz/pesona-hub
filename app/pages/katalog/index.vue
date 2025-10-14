<template>
  <main class="min-h-screen flex flex-col gap-20">
    <Navbar />
    <HeroSection />
    <Footer />
  </main>
</template>
<script setup lang="ts">
  import Navbar from "~/components/layout/navbar/Navbar.vue";
  import Footer from "~/components/layout/Footer/Footer.vue";
  import HeroSection from "~/components/features/catalog/hero-section/HeroSection.vue";
</script>
