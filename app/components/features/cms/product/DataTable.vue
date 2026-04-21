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
                class="bg-gray-50 px-6 rounded-tl-2xl py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[260px]"
              >
                Nama Produk
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[200px]"
              >
                KUPS
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[130px]"
              >
                Kelas
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[140px]"
              >
                Wilayah
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-[140px]"
              >
                Harga Mulai
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
              <!-- Nama Produk -->
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
                  <div class="flex flex-col gap-0.5 min-w-0">
                    <span
                      class="text-sm font-medium text-gray-900 truncate"
                      :title="toTitleCase(product.name)"
                      >{{ toTitleCase(product.name) }}</span
                    >
                    <span class="text-xs text-gray-500 truncate">
                      {{ getCommodityUnit(product) }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- KUPS -->
              <td class="px-6 py-4 overflow-hidden">
                <span
                  class="text-sm text-gray-600 truncate block"
                  :title="
                    toTitleCase(product.social_forestry_business_group?.name)
                  "
                  >{{
                    toTitleCase(product.social_forestry_business_group?.name) ||
                    "-"
                  }}</span
                >
              </td>

              <!-- Kelas -->
              <td class="px-6 py-4">
                <RankBadges
                  v-if="getClassGroup(product)"
                  class="border-[#E5E5E5] text-[#737373] px-1.5 py-0.5 gap-1 rounded-lg"
                  icon-size="w-3 h-3"
                  :rank="getClassGroup(product) as any"
                />
                <span v-else class="text-sm text-gray-400">-</span>
              </td>

              <!-- Wilayah -->
              <td class="px-6 py-4 overflow-hidden">
                <span
                  class="text-sm text-gray-600 truncate block"
                  :title="toTitleCase(getRegion(product))"
                  >{{ toTitleCase(getRegion(product)) }}</span
                >
              </td>

              <!-- Harga Mulai -->
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  formatPrice(product.price)
                }}</span>
              </td>

              <td class="px-6 py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button class="text-gray-400 hover:text-gray-600">
                      <Icon name="uil:ellipsis-v" class="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-36">
                    <DropdownMenuItem
                      v-if="appConfig.cms.product.canUpdate"
                      class="cursor-pointer gap-2"
                      @click="emit('edit', product)"
                    >
                      <Icon name="uil:edit" class="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-if="appConfig.cms.product.canDelete"
                      class="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                      @click="emit('delete', product)"
                    >
                      <Icon name="uil:trash-alt" class="w-4 h-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
import RankBadges from "~/components/base/RankBadges.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { ProductWithRelations } from "~/types/product";

const appConfig = useAppConfig();

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
  delete: [product: ProductWithRelations];
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

const toTitleCase = (value: string | null | undefined): string => {
  if (!value) return "";
  return value.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

const getCommodityUnit = (product: ProductWithRelations): string => {
  const commodity = toTitleCase((product as any).commodity?.name);
  const unit = toTitleCase(product.unit);
  if (commodity && unit) return `${commodity} · ${unit}`;
  return commodity || unit || "-";
};

const getRegion = (product: ProductWithRelations): string => {
  const businessGroup = product.social_forestry_business_group as any;
  return businessGroup?.location?.regency || "-";
};

const getClassGroup = (product: ProductWithRelations): string => {
  return (product.social_forestry_business_group as any)?.class_group || "";
};

const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "-";
  return "Rp. " + price.toLocaleString("id-ID");
};
</script>
