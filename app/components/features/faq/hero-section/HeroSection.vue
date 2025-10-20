<template>
  <section class="h-[564px] w-full overflow-hidden">
    <div class="grid grid-cols-2 gap-[179px]">
      <div
        class="max-w-[673px] flex flex-col justify-center gap-4 2xl:pl-20 lg:pl-10 pl-4 my-auto"
      >
        <div class="flex">
          <IconBadge label="FAQ" icon="plant" variant="white" />
        </div>
        <div class="flex flex-col gap-1.5">
          <HeroTagline />

          <HeroText />
        </div>
      </div>
      <div class="flex justify-end">
        <img src="/assets/images/faq-hero.png" alt="FAQ Hero Image" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import IconBadge from "~/components/base/IconBadge.vue";
  import HeroTagline from "./HeroTagline.vue";
  import HeroText from "./HeroText.vue";
</script>
