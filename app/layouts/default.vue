<template>
  <main class="min-h-screen flex flex-col max-w-[1536px] mx-auto">
    <Navbar />
    <slot />
    <Footer />
  </main>
</template>
<script setup lang="ts">
  import Navbar from "~/components/layout/navbar/Navbar.vue";
  import Footer from "~/components/layout/Footer/Footer.vue";
</script>
