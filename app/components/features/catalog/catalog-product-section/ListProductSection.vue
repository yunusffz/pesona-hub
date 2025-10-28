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
        <Icon name="uil:error" class="mx-auto h-12 w-12" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Gagal memuat produk
      </h3>
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
        <CatalogCard :product="product" :linkText="linkText" />
      </template>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <Icon name="uil:search" class="mx-auto h-12 w-12" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada produk</h3>
      <p class="text-gray-500">Produk akan segera ditambahkan.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CatalogCard from "~/components/common/catalog-section/CatalogCard.vue";
  import { useProducts } from "~/queries";
  import type { ProductWithRelations } from "~/types/product";
  // Props
  interface Props {
    search?: string;
    page?: number;
    limit?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    search: "",
    page: 1,
    limit: 3,
  });

  // Use products query
  const { data, isLoading, error, refetch } = useProducts({
    search: props.search,
    page: props.page,
    limit: props.limit,
    fields: ["id", "name", "thumbnails", "price", "unit"],
    populate: [
      "social_forestry_business_group.contact",
      "social_forestry_business_group.location",
      "social_forestry_group",
    ],
  });

  // Extract products from API response
  const products = computed(() => {
    const productsData = data.value?.data;
    if (Array.isArray(productsData)) {
      return productsData as unknown as ProductWithRelations[];
    }
    return [] as ProductWithRelations[];
  });

  const linkText = "Lihat Detail";
</script>
