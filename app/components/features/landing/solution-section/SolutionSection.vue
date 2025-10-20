<template>
  <section
    class="relative flex flex-col lg:flex-row lg:space-x-5 items-center px-6 lg:pl-20 pt-[60px] pb-6 overflow-hidden gap-5"
  >
    <SolutionHeader />

    <WhiteMaskDivider />

    <SolutionSwiper />
  </section>
</template>

<script setup lang="ts">
  import SolutionHeader from "./SolutionHeader.vue";
  import WhiteMaskDivider from "./WhiteMaskDivider.vue";
  import SolutionSwiper from "./SolutionSwiper.vue";
</script>
