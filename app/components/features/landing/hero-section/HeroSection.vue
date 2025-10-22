<template>
  <section class="h-screen max-h-[800px] w-full overflow-hidden">
    <!-- Background -->
    <NuxtImg
      src="/assets/images/landing-hero-bg.png"
      alt="Landscape"
      class="absolute inset-0 w-full h-full max-h-[800px] object-cover brightness-75"
    />
    <div
      class="absolute inset-0 bg-gradient-to-b max-h-[800px] from-black/10 via-black/30 to-black/40"
    ></div>
    <!-- Overlay -->
    <div
      class="relative z-10 flex flex-col justify-between h-full py-10 text-white"
    >
      <div
        class="mt-auto 2xl:px-20 lg:px-10 px-4 mb-20 flex justify-between lg:flex-row flex-col-reverse w-full text-center lg:text-left gap-12"
      >
        <div class="max-w-xl flex flex-col gap-9">
          <h2 class="text-2xl md:text-[28px] font-medium leading-snug pt-4">
            Pesona Hub Digi menjembatani KUPS dengan mitra B2B, B2C, dan CSR
            untuk pembangunan ekonomi hijau dan berkelanjutan.
          </h2>
          <HeroCTA />
        </div>

        <!-- Bottom Right Title -->
        <div class="text-center lg:text-right">
          <h1 class="text-5xl md:text-[70px] font-medium leading-tight">
            Akses Pasar<br />untuk<br />Masyarakat.
          </h1>
        </div>
      </div>

      <NuxtLink
        class="lg:justify-end inline-flex items-center mt-6 text-md hover:opacity-80 gap-2 2xl:px-20 lg:px-10 px-4 group transition-all duration-300 hover:translate-y-1"
        @click="scrollToImpact"
      >
        <div
          class="transition-transform duration-300 group-hover:translate-y-0.5"
        >
          Mulai eksplor informasi
        </div>
        <Icon
          name="uil:arrow-down"
          size="24px"
          class="transition-transform duration-300 group-hover:translate-y-1"
        />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
  import HeroCTA from "./HeroCTA.vue";

  const scrollToImpact = (event: Event) => {
    event.preventDefault();
    const infoElement = document.getElementById("impact");

    if (infoElement) {
      const yOffset = -100; // ubah sesuai padding/header height
      const y =
        infoElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };
</script>
