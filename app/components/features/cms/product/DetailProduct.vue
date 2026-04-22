<template>
  <div
    class="bg-white rounded-2xl shadow-lg w-[480px] max-h-[90vh] overflow-hidden flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-[#e7efea] shrink-0">
      <h2 class="font-semibold text-base text-[#1e1e1e]">Detail Produk</h2>
      <button
        type="button"
        class="rounded-lg p-1.5 text-[#6a7282] hover:bg-gray-100 hover:text-[#1e1e1e] transition-colors"
        @click="$emit('close')"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Scrollable body -->
    <div class="overflow-y-auto flex-1 flex flex-col gap-4 p-5">
      <!-- Image Carousel -->
      <div v-if="images.length > 0" class="flex flex-col gap-2">
        <!-- Main image -->
        <div class="relative rounded-xl overflow-hidden bg-gray-100 aspect-[16/9]">
          <img
            :src="images[activeImageIndex]"
            :alt="product.name"
            class="w-full h-full object-cover"
            @error="handleImageError(activeImageIndex)"
          />

          <!-- Prev button -->
          <button
            v-if="images.length > 1"
            type="button"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-colors"
            @click="prevImage"
          >
            <ChevronLeft class="w-4 h-4 text-gray-700" />
          </button>

          <!-- Next button -->
          <button
            v-if="images.length > 1"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-colors"
            @click="nextImage"
          >
            <ChevronRight class="w-4 h-4 text-gray-700" />
          </button>

          <!-- Counter -->
          <div
            v-if="images.length > 1"
            class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ activeImageIndex + 1 }} / {{ images.length }}
          </div>
        </div>

        <!-- Thumbnails -->
        <div v-if="images.length > 1" class="flex gap-2">
          <button
            v-for="(src, i) in images"
            :key="i"
            type="button"
            class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border-2 transition-colors"
            :class="i === activeImageIndex ? 'border-[#035925]' : 'border-transparent'"
            @click="activeImageIndex = i"
          >
            <img
              :src="src"
              :alt="`${product.name} ${i + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <!-- No image placeholder -->
      <div
        v-else
        class="rounded-xl bg-gray-100 aspect-[16/9] flex items-center justify-center"
      >
        <ImageOff class="w-10 h-10 text-gray-300" />
      </div>

      <!-- Product Name -->
      <div class="flex flex-col gap-2">
        <h3 class="font-bold text-lg text-[#1e1e1e] leading-snug">
          {{ product.name }}
        </h3>
        <RankBadges
          v-if="classGroup"
          :rank="classGroup as any"
          class="border-[#E5E5E5] text-[#737373] px-1.5 py-0.5 gap-1 rounded-lg self-start"
          icon-size="w-3 h-3"
        />
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-1">
        <span class="text-sm font-semibold text-[#1e1e1e]">Deskripsi</span>
        <p class="text-sm text-[#6a7282] leading-relaxed">
          {{ product.description || "-" }}
        </p>
      </div>

      <!-- Info grid -->
      <div class="grid grid-cols-2 gap-4 border-t border-[#e7efea] pt-4">
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-[#6a7282]">Komoditas</span>
          <span class="text-sm font-semibold text-[#1e1e1e]">
            {{ toTitleCase((product as any).commodity?.name) || "-" }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-[#6a7282]">Varian</span>
          <span class="text-sm font-semibold text-[#1e1e1e]">
            {{ toTitleCase(product.unit) || "-" }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-[#6a7282]">Harga</span>
          <span class="text-sm font-semibold text-[#1e1e1e]">
            {{ formatPrice(product.price) }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-[#6a7282]">Kapasitas</span>
          <span class="text-sm font-semibold text-[#1e1e1e]">
            {{ product.capacity ? `${product.capacity} ${product.unit || ""}`.trim() : "-" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-vue-next";
import RankBadges from "~/components/base/RankBadges.vue";
import type { ProductWithRelations } from "~/types/product";

const props = defineProps<{
  product: ProductWithRelations;
}>();

defineEmits<{
  close: [];
}>();

const config = useRuntimeConfig();
const activeImageIndex = ref(0);

const placeholderImages = [
  "/assets/images/product-1.png",
  "/assets/images/product-2.png",
  "/assets/images/product-3.png",
];

const getPlaceholder = (id: string | number | undefined): string => {
  const idx =
    id === undefined
      ? 0
      : (typeof id === "string" ? parseInt(id) || 0 : id) % placeholderImages.length;
  return placeholderImages[idx] ?? placeholderImages[0] ?? "/assets/images/product-1.png";
};

const failedIndexes = ref<Set<number>>(new Set());

const images = computed<string[]>(() => {
  const thumbnails = props.product.thumbnails;
  if (Array.isArray(thumbnails) && thumbnails.length > 0) {
    return thumbnails
      .map((t, i) => {
        if (failedIndexes.value.has(i)) return getPlaceholder(props.product.id);
        if (typeof t === "string" && t.trim() !== "") {
          return `${config.public.pesonaApiUrl}/files/${t.trim()}`;
        }
        return getPlaceholder(props.product.id);
      });
  }
  return [getPlaceholder(props.product.id)];
});

const handleImageError = (index: number) => {
  failedIndexes.value.add(index);
};

const prevImage = () => {
  activeImageIndex.value =
    (activeImageIndex.value - 1 + images.value.length) % images.value.length;
};

const nextImage = () => {
  activeImageIndex.value = (activeImageIndex.value + 1) % images.value.length;
};

const classGroup = computed(() => {
  return (props.product.social_forestry_business_group as any)?.class_group || "";
});

const toTitleCase = (value: string | null | undefined): string => {
  if (!value) return "";
  return value.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "-";
  return "Rp. " + price.toLocaleString("id-ID");
};
</script>
