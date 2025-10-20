<template>
  <section class="h-[450px] w-full overflow-hidden">
    <!-- Background -->
    <img
      src="/assets/images/catalog-hero-bg.png"
      alt="Landscape"
      class="absolute inset-0 w-full h-[450px] object-cover brightness-75"
    />
    <div
      class="absolute h-[450px] inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/40"
    ></div>
    <!-- Overlay -->
    <div class="relative z-10 flex flex-col justify-between h-full text-white">
      <!-- Center Content -->
      <div class="mt-[118px] flex justify-center mx-auto mb-20 w-full">
        <div
          class="max-w-[625px] flex flex-col text-center justify-center gap-4"
        >
          <div class="flex justify-center">
            <IconBadge
              label="Produk dan Wisata"
              icon="plant"
              variant="default"
              iconClass="text-white"
              buttonClass="bg-[#FFFFFF14] border border-[#EBEBEB8C]"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <HeroTagline />

            <HeroText />
          </div>
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
