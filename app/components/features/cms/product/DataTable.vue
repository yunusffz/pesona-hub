<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Loader />
    </div>
    <div v-else class="rounded-2xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full table-fixed">
          <thead class="border-b border-gray-200">
            <tr>
              <th
                class="bg-gray-50 px-6 rounded-tl-2xl py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[220px]"
              >
                Nama Brand/Produk
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[130px]"
              >
                Komoditas
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[150px]"
              >
                Kapasitas Penyediaan
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[90px]"
              >
                Satuan
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[130px]"
              >
                Jenis Bahan
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[140px]"
              >
                Wilayah
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[160px]"
              >
                Nama KUPS
              </th>
              <th class="bg-gray-50 px-6 py-3 rounded-tr-2xl w-10"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="product in paginatedData"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 overflow-hidden">
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      :src="getImageSrc(product)"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError($event, product)"
                    />
                  </div>
                  <div class="flex flex-col gap-1 min-w-0">
                    <span
                      class="text-sm font-medium text-gray-900 truncate"
                      :title="product.name"
                      >{{ product.name }}</span
                    >
                    <span
                      v-if="product.status"
                      class="text-xs text-gray-500 truncate"
                      :title="product.status"
                    >
                      {{ product.status }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 overflow-hidden">
                <span
                  class="text-sm text-gray-600 truncate block"
                  :title="(product as any).commodity?.name"
                  >{{ (product as any).commodity?.name || "-" }}</span
                >
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  product.capacity
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ product.unit }}</span>
              </td>
              <td class="px-6 py-4 overflow-hidden">
                <span
                  class="text-sm text-gray-600 truncate block"
                  :title="product.value_chain ?? ''"
                  >{{ product.value_chain || "-" }}</span
                >
              </td>
              <td class="px-6 py-4 overflow-hidden">
                <span
                  class="text-sm text-gray-600 truncate block"
                  :title="getRegion(product)"
                  >{{ getRegion(product) }}</span
                >
              </td>
              <td class="px-6 py-4 overflow-hidden">
                <span
                  class="text-sm text-gray-900 truncate block"
                  :title="product.social_forestry_business_group?.name"
                  >{{
                    product.social_forestry_business_group?.name || "-"
                  }}</span
                >
              </td>
              <td class="px-6 py-4">
                <button
                  class="text-gray-400 hover:text-gray-600"
                  @click="emit('edit', product)"
                >
                  <Icon name="uil:ellipsis-v" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer with Pagination -->
    <div class="py-4 border-t border-gray-200 flex justify-end">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :start-item="startItem"
        @update:current-page="currentPage = $event"
        @update:items-per-page="itemsPerPage = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Pagination from "~/components/ui/pagination/Pagination.vue";
import Loader from "~/components/base/Loader.vue";
import type { ProductWithRelations } from "~/types/product";

interface Props {
  products?: ProductWithRelations[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
  isLoading: false,
});

const emit = defineEmits<{
  edit: [product: ProductWithRelations];
}>();

const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalItems = computed(() => props.products.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.products.slice(start, end);
});

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const placeholderImages = [
  "/assets/images/product-1.png",
  "/assets/images/product-2.png",
  "/assets/images/product-3.png",
];

const getRandomPlaceholderImage = (
  productId: string | number | undefined
): string => {
  if (productId === undefined) {
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    return (
      placeholderImages[randomIndex] ??
      placeholderImages[0] ??
      "/assets/images/product-1.png"
    );
  }
  const id =
    typeof productId === "string" ? parseInt(productId) || 0 : productId;
  return (
    placeholderImages[id % placeholderImages.length] ??
    placeholderImages[0] ??
    "/assets/images/product-1.png"
  );
};

const failedImages = ref<Map<string | number, boolean>>(new Map());
const config = useRuntimeConfig();

const getImageSrc = (product: ProductWithRelations): string => {
  if (failedImages.value.get(product.id)) {
    return getRandomPlaceholderImage(product.id);
  }
  if (
    product.thumbnails &&
    Array.isArray(product.thumbnails) &&
    product.thumbnails.length > 0
  ) {
    const thumbnail = product.thumbnails[0];
    if (thumbnail && typeof thumbnail === "string" && thumbnail.trim() !== "") {
      return `${config.public.pesonaApiUrl}/files/${thumbnail.trim()}`;
    }
  }
  return getRandomPlaceholderImage(product.id);
};

const handleImageError = (
  event: Event,
  product: ProductWithRelations
): void => {
  const img = event.target as HTMLImageElement;
  failedImages.value.set(product.id, true);
  img.src = getRandomPlaceholderImage(product.id);
};

const getRegion = (product: ProductWithRelations): string => {
  const businessGroup = product.social_forestry_business_group as any;
  return businessGroup?.location?.province || "-";
};
</script>
