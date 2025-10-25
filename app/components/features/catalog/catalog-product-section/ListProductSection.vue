<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <svg
          class="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Gagal memuat produk
      </h3>
      <p class="text-gray-500 mb-4">{{ error.message }}</p>
      <button
        @click="() => refetch()"
        class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Products Grid -->
    <div
      v-else-if="products && products.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      <template v-for="product in products" :key="product.id">
        <CatalogCard
          :product="transformProduct(product)"
          :linkText="linkText"
        />
      </template>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg
          class="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada produk</h3>
      <p class="text-gray-500">Produk akan segera ditambahkan.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CatalogCard from "~/components/common/catalog-section/CatalogCard.vue";
  import type { Product } from "~/types/product";
  import type { components } from "~/types/pesona-hub-api";
  import { useProducts } from "~/queries";

  // Props
  interface Props {
    search?: string;
    page?: number;
    limit?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    search: "",
    page: 1,
    limit: 12,
  });

  // Use products query
  const { data, isLoading, error, refetch } = useProducts({
    search: props.search,
    page: props.page,
    limit: props.limit,
  });

  // Extract products from API response
  const products = computed(() => {
    const productsData = data.value?.data;
    if (Array.isArray(productsData)) {
      return productsData as components["schemas"]["Product"][];
    }
    return [] as components["schemas"]["Product"][];
  });

  // Transform API product to UI product format
  const transformProduct = (
    apiProduct: components["schemas"]["Product"]
  ): Product => {
    return {
      ...apiProduct,
      title: apiProduct.name,
      image: "/assets/images/product-1.png", // Default image, can be enhanced later
      price: "100000", // Default price, can be enhanced later
      contact: "081234567890", // Default contact, can be enhanced later
      catalogType: "Produk",
      kps: "LPHN Limo Koto", // Default KPS, can be enhanced later
      kups: "KUPS Agroforestri Danau Raya", // Default KUPS, can be enhanced later
      link: `/katalog/${apiProduct.id}`,
      isNew: true, // Default to new, can be enhanced later
    };
  };

  const linkText = "Lihat Detail";
</script>
