<template>
  <section class="py-16 flex flex-col gap-20 justify-center bg-white">
    <div class="gap-6 flex flex-col justify-center text-center">
      <div class="text-center flex justify-center">
        <IconBadge label="Partner Kami" icon="plant" variant="white" />
      </div>
      <h1 class="font-medium text-[40px] text-[#0D0D0E]">
        Kolaborasi Bersama Lembaga
      </h1>
      <p class="text-[#585858] px-3">
        Bersama lembaga pemerintah, LSM, komunitas, dan KUPS, Pesona Hub Digi
        membangun ekosistem perhutanan sosial yang terhubung, transparan, dan
        berkelanjutan.
      </p>
    </div>

    <!-- Marquee Logo Section -->
    <div ref="containerRef" class="relative overflow-hidden">
      <!-- Fading shadows - only show when marquee is active -->
      <div
        v-if="shouldMarquee"
        class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"
      ></div>
      <div
        v-if="shouldMarquee"
        class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"
      ></div>

      <!-- Marquee container -->
      <div
        ref="contentRef"
        :class="shouldMarquee ? 'marquee-wrapper' : 'static-wrapper'"
      >
        <div class="marquee-content">
          <img
            v-for="(partner, index) in partnerLogos"
            :key="`logo-${index}`"
            :src="partner.src"
            :alt="partner.alt"
            class="marquee-item h-24 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
        </div>
        <!-- Duplicate for seamless loop - only render when marquee is needed -->
        <div v-if="shouldMarquee" class="marquee-content" aria-hidden="true">
          <img
            v-for="(partner, index) in partnerLogos"
            :key="`logo-duplicate-${index}`"
            :src="partner.src"
            :alt="partner.alt"
            class="marquee-item h-24 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import IconBadge from "~/components/base/IconBadge.vue";

  // Partner logos array - add or remove logos here
  const partnerLogos = ref([
    {
      src: "/assets/images/logo-jabar.png",
      alt: "Logo Jawa Barat",
    },
    {
      src: "/assets/images/logo-jatim.png",
      alt: "Logo Jawa Timur",
    },
    {
      src: "/assets/images/logo-sumbar.png",
      alt: "Logo Sumatera Barat",
    },
  ]);

  const containerRef = ref<HTMLElement | null>(null);
  const contentRef = ref<HTMLElement | null>(null);
  const shouldMarquee = ref(false);

  const checkOverflow = () => {
    if (containerRef.value && contentRef.value) {
      const containerWidth = containerRef.value.offsetWidth;
      const contentWidth = contentRef.value.scrollWidth;
      shouldMarquee.value = contentWidth > containerWidth;
    }
  };

  onMounted(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkOverflow);
  });
</script>

<style scoped>
  .marquee-wrapper {
    display: flex;
    width: fit-content;
    animation: scroll 20s linear infinite;
  }

  .marquee-wrapper:hover {
    animation-play-state: paused;
  }

  .static-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .marquee-content {
    display: flex;
    gap: 2rem;
    flex-shrink: 0;
  }

  .marquee-wrapper .marquee-content {
    padding-right: 2rem;
  }

  .marquee-item {
    flex-shrink: 0;
    display: inline-block;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
</style>
