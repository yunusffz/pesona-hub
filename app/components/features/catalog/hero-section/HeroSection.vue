<template>
  <section class="relative h-[450px] w-full overflow-hidden">
    <!-- Background -->
    <img
      src="/assets/images/catalog-hero-bg.png"
      alt="Landscape"
      class="absolute inset-0 w-full h-full object-cover brightness-75"
    />
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/40"
    ></div>
    <!-- Overlay -->
    <div class="relative z-10 flex flex-col justify-between h-full text-white">
      <!-- Center Content -->
      <div class="mt-[118px] flex justify-center mx-auto mb-20 w-full">
        <div
          class="max-w-[625px] flex flex-col text-center justify-center gap-4"
        >
          <div class="flex justify-center">
            <Badge
              variant="transparent"
              class="flex items-center justify-center gap-[11px] px-3 py-1"
            >
              <SvgIcon name="plant" size="17px" />
              Produk dan Wisata</Badge
            >
          </div>
          <div class="flex flex-col gap-1.5">
            <HeroTagline />

            <HeroText />
          </div>
        </div>
      </div>

      <NuxtLink
        to="#info"
        class="justify-end inline-flex items-center mt-6 text-md hover:opacity-80 gap-2 px-20"
      >
        <div>Mulai eksplor informasi</div>
        <Icon name="uil:arrow-down" size="24px" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
  import Badge from "~/components/ui/badge/Badge.vue";
  import SvgIcon from "~/components/ui/SvgIcon.vue";
  import HeroTagline from "./HeroTagline.vue";
  import HeroText from "./HeroText.vue";
</script>
