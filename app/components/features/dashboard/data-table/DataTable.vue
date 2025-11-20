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
                Satuan
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Jenis Bahan
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
              <!-- <th class="bg-gray-50 px-6 py-3 rounded-tr-2xl"></th> -->
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
                    class="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      :src="getImageSrc(product)"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError($event, product)"
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
                  product.capacity
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ product.unit }}</span>
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
              <!-- <td class="px-6 py-4">
                <button class="text-gray-400 hover:text-gray-600">
                  <Icon name="uil:ellipsis-v" class="w-5 h-5" />
                </button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
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

  // Array of 5 random placeholder images for products
  const placeholderImages = [
    "/assets/images/product-1.png",
    "/assets/images/product-2.png",
    "/assets/images/product-3.png",
  ];

  // Helper function to get random placeholder image based on product ID
  const getRandomPlaceholderImage = (
    productId: string | number | undefined
  ): string => {
    if (productId === undefined) {
      // Use a random index if no ID is provided
      const randomIndex = Math.floor(Math.random() * placeholderImages.length);
      const selectedImage = placeholderImages[randomIndex];
      return (
        selectedImage ?? placeholderImages[0] ?? "/assets/images/product-1.png"
      );
    }
    const id =
      typeof productId === "string" ? parseInt(productId) || 0 : productId;
    const index = id % placeholderImages.length;
    const selectedImage = placeholderImages[index];
    return (
      selectedImage ?? placeholderImages[0] ?? "/assets/images/product-1.png"
    );
  };

  // Map to store failed image URLs for each product
  const failedImages = ref<Map<string | number, boolean>>(new Map());

  // Helper function to get image source (thumbnail or placeholder)
  const getImageSrc = (product: ProductWithRelations): string => {
    // If image already failed, use placeholder immediately
    if (failedImages.value.get(product.id)) {
      return getRandomPlaceholderImage(product.id);
    }

    // Try to get thumbnail first
    if (
      product.thumbnails &&
      Array.isArray(product.thumbnails) &&
      product.thumbnails.length > 0
    ) {
      const thumbnail = product.thumbnails[0];
      let imageUrl = "";

      if (typeof thumbnail === "string" && thumbnail.trim() !== "") {
        imageUrl = thumbnail.trim();
      } else if (
        typeof thumbnail === "object" &&
        thumbnail !== null &&
        "url" in thumbnail &&
        thumbnail.url
      ) {
        imageUrl = (thumbnail as { url: string }).url.trim();
      }

      // If we have a valid image URL, return it
      if (imageUrl) {
        return imageUrl;
      }
    }

    // Return random placeholder image if no thumbnail exists
    return getRandomPlaceholderImage(product.id);
  };

  // Handle image load error
  const handleImageError = (
    event: Event,
    product: ProductWithRelations
  ): void => {
    const img = event.target as HTMLImageElement;
    // Mark this product's image as failed
    failedImages.value.set(product.id, true);
    // Set fallback placeholder image
    img.src = getRandomPlaceholderImage(product.id);
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
