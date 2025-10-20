<template>
  <section class="relative flex flex-col px-6 2xl:pl-20 lg:pl-10 pl-4 gap-6">
    <IconBadge
      label="Solusi Kami"
      icon="plant"
      variant="white"
      class="flex items-center space-x-2.5 border border-[#EBEBEB] rounded-full px-3 py-1 max-w-fit 2xl:[330px] lg:w-[330px]"
    />
    <div
      class="relative flex flex-col lg:flex-row lg:space-x-5 items-start pb-6 overflow-hidden"
    >
      <SolutionHeader />

      <SolutionSwiper />
    </div>
  </section>
</template>

<script setup lang="ts">
  import SolutionHeader from "./SolutionHeader.vue";
  import SolutionSwiper from "./SolutionSwiper.vue";
  import IconBadge from "~/components/base/IconBadge.vue";
</script>
