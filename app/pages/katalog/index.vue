<template>
  <main class="min-h-screen flex flex-col max-w-[1536px] mx-auto">
    <Navbar />
    <HeroSection />
    <CatalogProductSection />
    <Footer />
  </main>
</template>
<script setup lang="ts">
  import Navbar from "~/components/layout/navbar/Navbar.vue";
  import Footer from "~/components/layout/Footer/Footer.vue";
  import HeroSection from "~/components/features/catalog/hero-section/HeroSection.vue";
  import CatalogProductSection from "~/components/features/catalog/catalog-product-section/CatalogProductSection.vue";
</script>
