<template>
  <div class="flex-1 w-full lg:w-auto max-w-full overflow-hidden">
    <!-- Main Image Swiper -->
    <div
      class="relative rounded-3xl overflow-hidden mb-3 main-swiper-container"
    >
      <Swiper
        :modules="[SwiperThumbs, SwiperAutoplay]"
        :slides-per-view="1"
        :space-between="0"
        :thumbs="{ swiper: thumbsSwiper }"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        :loop="safeImages.length > 1"
        @swiper="setMainSwiper"
      >
        <SwiperSlide v-for="(image, index) in safeImages" :key="index">
          <div
            class="w-full h-[400px] lg:h-[579px] rounded-3xl overflow-hidden"
          >
            <img
              :src="image.url"
              :alt="image.alt || `Product Image ${index + 1}`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Thumbnail Swiper -->
    <div class="thumbs-swiper-container">
      <Swiper
        :modules="[SwiperThumbs]"
        :slides-per-view="4"
        :space-between="12"
        :watch-slides-progress="true"
        @swiper="setThumbsSwiper"
      >
        <SwiperSlide
          v-for="(image, index) in safeImages"
          :key="index"
          class="cursor-pointer"
          @click="goToSlide(index)"
        >
          <div
            class="relative rounded-xl overflow-hidden h-[80px] lg:h-[100px]"
          >
            <NuxtImg
              :src="image.url"
              :alt="image.alt || `Thumbnail ${index + 1}`"
              class="w-full h-full object-cover"
              @error="handleImageError || ''"
            />
            <!-- Overlay for active thumbnail -->
            <div
              class="absolute inset-0 bg-white/30 transition-opacity duration-200"
              :class="{
                'opacity-100': index === activeIndex,
                'opacity-0': index !== activeIndex,
              }"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import {
  Thumbs as SwiperThumbs,
  Autoplay as SwiperAutoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/autoplay";

interface ProductImage {
  url: string;
  alt?: string;
}

interface Props {
  images: ProductImage[];
}

const props = defineProps<Props>();
const { getImageUrlWithFallback, getRandomFallbackImage } = useSafeImage();

const thumbsSwiper = ref<any>(null);
const mainSwiper = ref<any>(null);
const activeIndex = ref(0);

// Create safe image URLs with fallback handling
const safeImages = computed(() => {
  return props.images.map((image) => ({
    url: getImageUrlWithFallback(image.url),
    alt: image.alt,
  }));
});

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
};

const setMainSwiper = (swiper: any) => {
  mainSwiper.value = swiper;
  // Update active index when slide changes
  swiper.on("slideChange", () => {
    const realIndex = swiper.realIndex;
    activeIndex.value = realIndex;

    // Update thumbnail swiper to show active thumbnail
    if (thumbsSwiper.value) {
      thumbsSwiper.value.slideTo(realIndex);
    }
  });
};

const goToSlide = (index: number) => {
  if (mainSwiper.value) {
    mainSwiper.value.slideTo(index);
  }
};

// Handle image load errors - replace with random fallback
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img && !img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = "true";
    img.src = getRandomFallbackImage() || "";
  }
};
</script>

<style scoped>
/* Main swiper - full width slides */
.main-swiper-container :deep(.swiper) {
  width: 100% !important;
  max-width: 100% !important;
}

.main-swiper-container :deep(.swiper-wrapper) {
  width: 100% !important;
  max-width: 100% !important;
}

.main-swiper-container :deep(.swiper-slide) {
  width: 100% !important;
  max-width: 100% !important;
  flex-shrink: 0;
}

/* Thumbnail swiper - auto width for multiple slides */
.thumbs-swiper-container :deep(.swiper) {
  width: 100% !important;
}

.thumbs-swiper-container :deep(.swiper-wrapper) {
  width: 100% !important;
}

.thumbs-swiper-container :deep(.swiper-slide) {
  width: auto !important;
  flex-shrink: 0;
}

/* Customize swiper-slide-thumb-active if needed */
:deep(.swiper-slide-thumb-active) {
  opacity: 1;
}
</style>
