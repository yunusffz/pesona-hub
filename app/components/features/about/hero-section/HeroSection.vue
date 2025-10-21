<template>
  <section class="min-h-[564px] w-full overflow-hidden">
    <div
      class="flex gap-8 text-center lg:text-left lg:gap-20 lg:flex-row flex-col-reverse"
    >
      <div class="h-[300px] sm:h-[400px] lg:h-[620px]">
        <img
          src="/assets/images/about-hero.png"
          class="w-full object-cover object-center"
          alt="About Hero Image"
        />
      </div>
      <div
        class="max-w-[673px] flex flex-col justify-center items-center px-4 lg:px-6 lg:items-start gap-4 lg:pr-10 my-auto"
      >
        <div class="flex w-full justify-center lg:justify-start">
          <IconBadge label="Tentang Kami" icon="plant" variant="white" />
        </div>
        <div class="flex flex-col gap-4 w-full items-center lg:items-start">
          <HeroTagline />

          <HeroText />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import IconBadge from "~/components/base/IconBadge.vue";
  import HeroTagline from "./HeroTagline.vue";
  import HeroText from "./HeroText.vue";
</script>
