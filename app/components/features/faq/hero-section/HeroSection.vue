<template>
  <section class="h-[564px] w-full overflow-hidden">
    <div class="grid grid-cols-2 gap-[179px]">
      <div
        class="max-w-[673px] flex flex-col justify-center gap-4 pl-20 my-auto"
      >
        <div class="flex">
          <Badge variant="white" class="flex items-center gap-3 px-3 py-1">
            <SvgIcon name="plant" size="17px" class="text-primary" />
            FAQ</Badge
          >
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
  import Badge from "~/components/ui/badge/Badge.vue";
  import SvgIcon from "~/components/ui/SvgIcon.vue";
  import HeroTagline from "./HeroTagline.vue";
  import HeroText from "./HeroText.vue";
</script>
