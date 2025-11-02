<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Loader />
    </div>
    <div v-else class="rounded-2xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200">
            <tr>
              <th
                class="bg-gray-50 px-6 rounded-tl-2xl py-3 text-left text-sm font-medium text-gray-700"
              >
                Nama Brand/Produk
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Komoditas
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Kapasitas Penyediaan
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Rantai Nilai
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Wilayah
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Nama KUPS
              </th>
              <th class="bg-gray-50 px-6 py-3 rounded-tr-2xl"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="product in paginatedData"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    v-if="getThumbnail(product)"
                    class="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      :src="getThumbnail(product) || undefined"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-900">{{
                      product.name
                    }}</span>
                    <span v-if="product.status" class="text-xs text-gray-500">
                      {{ product.status }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{
                  (product as any).commodity?.name || "-"
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  getCapacity(product)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{
                  product.value_chain || "-"
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{
                  getRegion(product)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  product.social_forestry_business_group?.name || "-"
                }}</span>
              </td>
              <td class="px-6 py-4">
                <button class="text-gray-400 hover:text-gray-600">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination -->
      <div class="px-6 py-4 border-t border-gray-200">
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

  // Helper function to get thumbnail image
  const getThumbnail = (product: ProductWithRelations): string | null => {
    if (
      product.thumbnails &&
      Array.isArray(product.thumbnails) &&
      product.thumbnails.length > 0
    ) {
      const thumbnail = product.thumbnails[0];
      if (typeof thumbnail === "string") {
        return thumbnail;
      }
      if (
        typeof thumbnail === "object" &&
        thumbnail !== null &&
        "url" in thumbnail
      ) {
        return (thumbnail as { url: string }).url;
      }
    }
    return null;
  };

  // Helper function to get capacity from metadatas
  const getCapacity = (product: ProductWithRelations): string => {
    if (!product.metadatas) return "-";

    // Handle array format
    if (Array.isArray(product.metadatas)) {
      const capacityMeta = product.metadatas.find(
        (meta: any) =>
          meta?.capacity || meta?.supply_capacity || meta?.kapasitas
      );
      if (capacityMeta) {
        const capacity =
          capacityMeta.capacity ||
          capacityMeta.supply_capacity ||
          capacityMeta.kapasitas;
        if (capacity) return String(capacity);
      }
    }

    // Handle object format
    if (typeof product.metadatas === "object" && product.metadatas !== null) {
      const meta = product.metadatas as Record<string, unknown>;
      const capacity = meta.capacity || meta.supply_capacity || meta.kapasitas;
      if (capacity) return String(capacity);
    }

    return "-";
  };

  // Helper function to get region (province)
  const getRegion = (product: ProductWithRelations): string => {
    const businessGroup = product.social_forestry_business_group as any;
    const location = businessGroup?.location;
    const province = location?.province;
    return province || "-";
  };
</script>
