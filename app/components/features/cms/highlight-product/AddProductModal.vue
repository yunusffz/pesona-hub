<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="max-w-2xl max-h-[80vh] flex flex-col gap-0 p-0 rounded-2xl"
    >
      <DialogHeader class="px-6 pt-6 border-gray-100">
        <DialogTitle>Pilih Produk untuk Di-Highlight</DialogTitle>
        <DialogDescription
          >Pilih produk unggulan yang akan ditampilkan di halaman
          utama</DialogDescription
        >
      </DialogHeader>

      <div class="px-6 py-4 relative">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#717182] pointer-events-none"
          />
          <Input
            v-model="search"
            placeholder="Cari berdasarkan nama produk,wisata,kategori, atau KUPS..."
            class="w-full rounded-xl pl-9 border-[#E8E8E8] bg-[#F7F7F7] placeholder:text-[#717182] focus-visible:ring-0"
          />
        </div>
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <button
            v-if="hasMore && displayedProducts.length > 0"
            class="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full z-10 mt-2 flex items-start gap-1.5 border border-[#EBEFEB] bg-white px-3 py-1.5 text-xs shadow-sm text-primary font-medium rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors"
            @click="sentinel?.scrollIntoView({ behavior: 'smooth' })"
          >
            <ArrowDown class="h-3 w-3" />
            Scroll untuk melihat lebih banyak
          </button>
        </Transition>
      </div>

      <div
        class="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border scrollbar-track-transparent"
      >
        <div class="px-6 py-4">
          <div
            v-if="isLoading && displayedProducts.length === 0"
            class="flex justify-center py-10"
          >
            <span class="text-sm text-gray-400">Memuat produk...</span>
          </div>
          <div
            v-else-if="!isLoading && displayedProducts.length === 0"
            class="flex justify-center py-10"
          >
            <span class="text-sm text-gray-400"
              >Tidak ada produk ditemukan</span
            >
          </div>
          <div v-else class="flex flex-col divide-y divide-gray-100">
            <div
              v-for="product in displayedProducts"
              :key="product.id"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors border border-[#E8E8E8]"
              @click="handleSelect(product)"
            >
              <div
                class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100"
              >
                <img
                  :src="getProductImage(product)"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                  @error="
                    (e) =>
                      ((e.target as HTMLImageElement).src =
                        '/assets/images/placeholder.png')
                  "
                />
              </div>
              <div class="flex flex-col gap-1 flex-1 min-w-0">
                <RankBadges
                  v-if="
                    (product as any).social_forestry_business_group?.class_group
                  "
                  :rank="
                    (product as any).social_forestry_business_group.class_group
                  "
                  variant="outline"
                  class="border border-[#E5E5E5] rounded-lg text-[#737373] px-1.5 py-0.5 gap-1 w-fit"
                  icon-size="w-3 h-3"
                />
                <span class="font-semibold text-gray-900 truncate capitalize">{{
                  product.name?.toLowerCase()
                }}</span>
                <div class="flex items-center justify-between gap-2 mt-0.5">
                  <div class="flex items-center gap-1 min-w-0">
                    <MapPin class="h-3 w-3 text-[#6A7282] flex-shrink-0" />
                    <span class="text-xs text-[#6A7282] truncate capitalize">{{
                      (
                        product as any
                      ).social_forestry_business_group?.name.toLowerCase() ||
                      "-"
                    }}</span>
                  </div>
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <span class="text-[#6A7282]">•</span>
                    <span class="text-xs font-semibold text-primary">{{
                      formatRupiah(Number((product as any).price) ?? 0)
                    }}</span>
                  </div>
                </div>
              </div>
              <span
                v-if="product.status"
                class="text-xs text-gray-400 flex-shrink-0"
                >{{ product.status }}</span
              >
            </div>
          </div>

          <!-- Sentinel always rendered for IntersectionObserver -->
          <div ref="sentinel" class="py-2 flex justify-center">
            <span
              v-if="isLoading && displayedProducts.length > 0"
              class="text-xs text-gray-400"
              >Memuat...</span
            >
          </div>
        </div>
      </div>

      <DialogFooter class="px-6 py-4 border-t border-gray-100">
        <BaseButton
          variant="primary"
          class="py-0 px-4 text-sm h-9"
          @click="open = false"
          >Batal</BaseButton
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, onUnmounted } from "vue";
import { Search, ArrowDown, MapPin } from "lucide-vue-next";
import { formatRupiah } from "~/utils/format-number";
import BaseButton from "~/components/base/BaseButton.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import type { ProductWithRelations } from "~/types/product";
import { useProductSearch } from "~/composables/useProductSearch";
import RankBadges from "~/components/base/RankBadges.vue";

const props = defineProps<{
  category: "PRODUK" | "EKOWISATA";
}>();

const emit = defineEmits<{
  select: [product: ProductWithRelations];
}>();

const open = defineModel<boolean>("open", { default: false });
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const {
  search,
  displayedProducts,
  hasMore,
  isLoading,
  open: fetchFirst,
  reset,
  loadMore,
} = useProductSearch(props.category);

watch(open, (val) => {
  if (val) fetchFirst();
  else reset();
});

watchEffect(() => {
  if (observer) observer.disconnect();
  const el = sentinel.value;
  if (!el) return;

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    },
    { threshold: 0.1 }
  );
  observer.observe(el);
});

onUnmounted(() => observer?.disconnect());

const getProductImage = (product: ProductWithRelations) => {
  const thumbnails = (product as any).thumbnails;
  if (Array.isArray(thumbnails) && thumbnails.length > 0) {
    return thumbnails[0]?.url || thumbnails[0];
  }
  return "/assets/images/placeholder.png";
};

const handleSelect = (product: ProductWithRelations) => {
  emit("select", product);
  open.value = false;
};
</script>
