<template>
  <div
    class="w-[280px] sm:w-[329px] h-[411px] rounded-2xl border border-neutral-200 flex flex-col relative overflow-hidden flex-shrink-0"
  >
    <!-- Drag handle -->
    <div
      class="drag-handle absolute top-3 left-3 z-20 w-7 h-7 rounded-xl bg-white/70 shadow flex items-center justify-center cursor-grab active:cursor-grabbing text-neutral-900"
    >
      <GripVertical :size="14" />
    </div>

    <!-- Remove button -->
    <button
      class="absolute top-3 right-3 z-20 w-7 h-7 rounded-xl bg-white/70 shadow flex items-center justify-center hover:bg-red-50 text-red-600 hover:text-red-500 transition-colors"
      @click="$emit('remove')"
    >
      <Trash2Icon :size="14" />
    </button>

    <!-- Image -->
    <div class="relative h-[200px] flex-shrink-0">
      <div
        v-if="isImageLoading"
        class="absolute inset-0 bg-neutral-200 animate-pulse"
      />

      <NuxtImg
        :src="imageSource"
        :alt="product.name"
        class="w-full h-full object-cover"
        :class="{ 'opacity-0': isImageLoading }"
        @load="isImageLoading = false"
        @error="
          imageSource = dummyImage;
          isImageLoading = false;
        "
      />
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 px-4 py-3 gap-1.5 overflow-hidden">
      <RankBadges
        v-if="(product as any).social_forestry_business_group?.class_group"
        :rank="(product as any).social_forestry_business_group.class_group"
        variant="outline"
        class="border border-[#E5E5E5] rounded-lg text-[#737373] px-1.5 py-0.5 gap-1"
        icon-size="w-3 h-3"
      />
      <h3 class="font-semibold text-base truncate">{{ product.name }}</h3>
      <div
        class="text-sm text-[#4A5565] line-clamp-3"
        :title="product.description ?? undefined"
      >
        {{ product.description }}
      </div>
      <hr />
      <div class="mt-1 flex items-center justify-between gap-2">
        <span
          class="text-xs text-neutral-500 truncate"
          :title="
            (product as any).social_forestry_business_group?.name ?? undefined
          "
        >
          {{ (product as any).social_forestry_business_group?.name || "-" }}
        </span>
        <div class="flex-shrink-0">
          <span
            v-if="isAuthenticated"
            class="text-base font-semibold text-primary"
          >
            {{
              formatRupiah(Number((product as any).price) ?? 0) ?? "Rp. xxx.xxx"
            }}
          </span>
          <span v-else class="text-base font-semibold text-neutral-400">
            Rp xxx.xxx
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Trash2Icon, GripVertical } from "lucide-vue-next";
import RankBadges from "~/components/base/RankBadges.vue";
import { formatRupiah } from "~/utils/format-number";
import type { ProductWithRelations } from "~/types/product";

const props = defineProps<{
  product: ProductWithRelations;
}>();

defineEmits<{ remove: [] }>();

const { isAuthenticated } = useAuth();

const dummyImage = "/assets/images/product-2.png";

const getImage = () => {
  const thumbnails = (props.product as any).thumbnails;
  if (Array.isArray(thumbnails) && thumbnails.length > 0) {
    return thumbnails[0]?.url || thumbnails[0] || dummyImage;
  }
  return dummyImage;
};

const imageSource = ref(getImage());
const isImageLoading = ref(true);

watch(
  () => props.product,
  () => {
    const newImage = getImage();
    if (newImage !== imageSource.value) {
      isImageLoading.value = true;
      imageSource.value = newImage;
    }
  }
);
</script>
