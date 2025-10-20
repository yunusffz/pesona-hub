<template>
  <div class="relative flex-1 overflow-hidden sm:px-6 lg:px-0 w-full lg:w-auto">
    <Swiper
      :modules="[SwiperAutoplay, SwiperPagination]"
      :autoplay="{ delay: 3000 }"
      :pagination="{ clickable: true }"
      :loop="slides.length > 1"
      class="mySwiper"
      @slide-change="handleSlideChange"
      :slides-per-view="'auto'"
      :space-between="16"
      :breakpoints="{
        320: {
          spaceBetween: 16,
        },
        640: {
          spaceBetween: 20,
        },
        1024: {
          spaceBetween: 24,
        },
      }"
      @swiper="onSwiper"
    >
      <SwiperSlide
        v-for="slide in slides"
        :key="slide.id"
        class="!w-full sm:!w-[400px] lg:!w-[451px] flex-shrink-0"
      >
        <div
          class="w-full h-[220px] sm:h-[240px] lg:h-[261px] rounded-lg overflow-hidden relative"
        >
          <img
            :src="slide.image"
            :alt="slide.title"
            class="absolute inset-0 w-full h-full object-cover rounded-lg"
          />

          <div class="absolute inset-0 bg-black/18 rounded-lg"></div>

          <div
            class="absolute inset-0 rounded-lg"
            style="
              background: linear-gradient(
                180deg,
                rgba(145, 145, 145, 0) 0%,
                rgba(145, 145, 145, 0.2) 50%,
                rgba(74, 74, 74, 0.7) 75%,
                rgba(51, 51, 51, 0.9) 100%
              );
            "
          ></div>

          <div
            class="absolute inset-0 rounded-lg flex flex-col justify-end p-4 sm:p-5 lg:p-6 z-20"
          >
            <div class="flex flex-col gap-1.5 sm:gap-2">
              <h3 class="text-white text-xl sm:text-2xl font-medium">
                {{ slide.title }}
              </h3>
              <p
                class="text-white/80 text-xs sm:text-sm leading-snug line-clamp-2"
              >
                {{ slide.description }}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Navigation buttons -->
    <div class="flex justify-center sm:justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
      <button
        class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center text-center justify-center backdrop-blur-md transition group hover:bg-primary hover:border-primary"
        @click="swiper?.slidePrev()"
        aria-label="Previous slide"
      >
        <Icon
          name="quill:chevron-left"
          size="18px"
          class="sm:!w-5 sm:!h-5 group-hover:text-white text-[#333333] transition"
        />
      </button>
      <button
        class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center text-center justify-center backdrop-blur-md transition group hover:bg-primary hover:border-primary"
        @click="swiper?.slideNext()"
        aria-label="Next slide"
      >
        <Icon
          name="quill:chevron-right"
          size="18px"
          class="sm:!w-5 sm:!h-5 group-hover:text-white text-[#333333] transition"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Swiper, SwiperSlide } from "swiper/vue";
  import {
    Autoplay as SwiperAutoplay,
    Pagination as SwiperPagination,
  } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/pagination";

  const swiper = ref<any>(null);
  const activeSlideIndex = ref(0);

  const slides = [
    {
      id: 1,
      title: "Pemberdayaan Masyarakat",
      description:
        "Ratusan KUPS mendapatkan akses pasar yang lebih luas, meningkatkan pendapatan dan kema...",
      image: "/assets/images/solution-1.jpg",
    },
    {
      id: 2,
      title: "Konservasi Hutan",
      description:
        "Produk berkelanjutan membantu menjaga tutupan hutan dan mendorong praktik ramah lingkungan...",
      image: "/assets/images/solution-2.jpg",
    },
    {
      id: 3,
      title: "Ekonomi Hijau Inklusif",
      description:
        "Kolaborasi dengan mitra membuka peluang kerja, mendukung inovasi, dan memperkuat rantai nilai kehutanan sosial.",
      image: "/assets/images/solution-3.jpg",
    },
  ];

  const handleSlideChange = (instance: { realIndex: number }) => {
    activeSlideIndex.value = instance.realIndex;
  };
  const onSwiper = (instance: any) => {
    swiper.value = instance;
  };
</script>

<style scoped>
  :deep(.swiper-pagination) {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 1rem;
  }

  @media (min-width: 640px) {
    :deep(.swiper-pagination) {
      gap: 8px;
      margin-top: 1.5rem;
    }
  }

  :deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
    background: #d1d5db;
    opacity: 1;
    transition: all 0.3s ease;
    margin: 0;
  }

  @media (min-width: 640px) {
    :deep(.swiper-pagination-bullet) {
      width: 10px;
      height: 10px;
    }
  }

  :deep(.swiper-pagination-bullet-active) {
    background: var(--color-green-400);
    width: 24px;
    border-radius: 5px;
  }

  @media (min-width: 640px) {
    :deep(.swiper-pagination-bullet-active) {
      width: 32px;
    }
  }
</style>
