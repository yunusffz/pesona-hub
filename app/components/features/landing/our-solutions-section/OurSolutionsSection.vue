<template>
  <section
    class="relative flex flex-col lg:flex-row lg:space-x-5 items-center px-6 lg:pl-20 py-5 overflow-hidden gap-5"
  >
    <div class="relative flex flex-col gap-6 w-full lg:w-[330px]">
      <div
        class="flex items-center space-x-2.5 border border-[#EBEBEB] rounded-full px-4 py-2 max-w-fit"
      >
        <SvgIcon name="diamond" size="10px" class="text-forest-green" />
        <span class="text-md font-medium text-rich-black">Our Solutions</span>
      </div>
      <h2 class="text-[40px] font-medium text-rich-black leading-[48px]">
        Dampak Sosial & Lingkungan yang Nyata
      </h2>
      <p class="text-md text-gray-600">
        Melalui Pesona Hub Digi, setiap produk yang terhubung ke pasar membawa
        manfaat langsung bagi masyarakat dan kelestarian hutan.
      </p>
    </div>

    <div
      class="hidden lg:block absolute left-[360px] top-0 bottom-0 w-[150px] z-10 bg-white backdrop-blur-[20px]"
      style="
        -webkit-mask-image: url('/assets/images/white-divider.png');
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 150px 472px;
        -webkit-mask-position: center center;
        -webkit-mask-mode: alpha;
        mask-image: url('/assets/images/white-divider.png');
        mask-repeat: no-repeat;
        mask-size: 150px 472px;
        mask-position: center center;
        mask-mode: alpha;
      "
    ></div>

    <div class="relative flex-1 overflow-hidden">
      <Swiper
        :modules="[SwiperAutoplay, SwiperPagination]"
        :autoplay="{ delay: 3000 }"
        :pagination="{ clickable: true }"
        loop
        class="mySwiper"
        @slide-change="handleSlideChange"
        slides-per-view="auto"
        space-between="24"
      >
        <SwiperSlide
          v-for="slide in slides"
          :key="slide.id"
          class="!w-[451px] flex-shrink-0"
        >
          <div class="w-[451px] h-[261px] rounded-lg overflow-hidden relative">
            <img
              :src="slide.image"
              :alt="slide.title"
              class="absolute inset-0 w-full h-full object-cover rounded-lg"
            />

            <!-- 18% black overlay -->
            <div class="absolute inset-0 bg-black/18 rounded-lg"></div>

            <!-- white mask divider - only for first position slide -->

            <!-- gradient from half to bottom -->
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

            <!-- content -->
            <div
              class="absolute inset-0 rounded-lg flex flex-col justify-end p-6 z-20"
            >
              <div class="flex flex-col gap-2">
                <h3 class="text-white text-2xl font-medium">
                  {{ slide.title }}
                </h3>
                <p class="text-white/80 text-sm leading-snug">
                  {{ slide.description }}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/ui/SvgIcon.vue";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import {
    Autoplay as SwiperAutoplay,
    Pagination as SwiperPagination,
  } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/pagination";

  // Track active slide index
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

  const handleSlideChange = (swiper: { realIndex: number }) => {
    activeSlideIndex.value = swiper.realIndex;
  };
</script>

<style scoped>
  :deep(.swiper-pagination) {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 1.5rem;
  }

  :deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background: #d1d5db;
    opacity: 1;
    transition: all 0.3s ease;
    margin: 0;
  }

  :deep(.swiper-pagination-bullet-active) {
    background: #333333;
    width: 32px;
    border-radius: 5px;
  }
</style>
