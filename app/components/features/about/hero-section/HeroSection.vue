<template>
  <section class="h-[564px] w-full overflow-hidden">
    <div class="grid grid-cols-2 xl:gap-20 gap-10">
      <div class="flex">
        <img src="/assets/images/about-hero.png" alt="About Hero Image" />
      </div>
      <div
        class="max-w-[673px] flex flex-col justify-center gap-4 pr-10 my-auto"
      >
        <div class="flex">
          <IconBadge label="Tentang Kami" icon="plant" variant="white" />
        </div>
        <div class="flex flex-col gap-4">
          <HeroTagline />

          <HeroText />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import IconBadge from "~/components/ui/IconBadge.vue";
  import HeroTagline from "./HeroTagline.vue";
  import HeroText from "./HeroText.vue";
</script>
