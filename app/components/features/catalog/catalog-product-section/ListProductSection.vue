<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <Loader />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-[#6B7280] mb-4">
        <Icon name="uil:search" class="mx-auto h-12 w-12" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Tidak ada produk yang ditemukan
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

    <div class="flex justify-end p-3">
      <Pagination
        :is-items-per-page="false"
        :current-page="paginationMeta.currentPage"
        :total-pages="paginationMeta.totalPages"
        :total-items="paginationMeta.totalItems"
        :items-per-page="paginationMeta.itemsPerPage"
        :start-item="paginationMeta.startItem"
        @update:current-page="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import CatalogCard from "~/components/common/catalog-section/CatalogCard.vue";
  import { mockProducts } from "~/mocks/data/products";
  import type { ProductWithRelations } from "~/types/product";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import Pagination from "~/components/ui/pagination/Pagination.vue";
  import Loader from "~/components/base/Loader.vue";

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

  const catalogStore = useCatalogStore();
  const isLoading = ref(false);
  const error = ref(null);

  // Use offline mockup data
  const allProducts = computed(() => {
    return mockProducts as unknown as ProductWithRelations[];
  });

  // Apply filters to products
  const filteredProducts = computed(() => {
    let filtered = [...allProducts.value];

    // Search filter
    if (catalogStore.searchQuery.trim()) {
      const query = catalogStore.searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(query);
        const descriptionMatch = product.description?.toLowerCase().includes(query);
        return nameMatch || descriptionMatch;
      });
    }

    // Commodity filter
    if (catalogStore.selectedCommodities.length > 0) {
      filtered = filtered.filter((product) =>
        catalogStore.selectedCommodities.includes(product.commodity_id || 0)
      );
    }

    // Location filter (district)
    if (catalogStore.selectedLocations.length > 0) {
      filtered = filtered.filter((product) => {
        const district = product.social_forestry_business_group?.location?.district;
        return district && catalogStore.selectedLocations.includes(district);
      });
    }

    // Price range filter
    if (catalogStore.priceRange) {
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        return (
          price >= catalogStore.priceRange!.min &&
          price <= catalogStore.priceRange!.max
        );
      });
    }

    // Commodity priority filter
    if (catalogStore.selectedCommodityPriorities.length > 0) {
      filtered = filtered.filter((product) => {
        const priority = product.commodity_priority;
        return priority && catalogStore.selectedCommodityPriorities.includes(priority);
      });
    }

    // Sorting
    if (catalogStore.sortBy) {
      const [field, order] = catalogStore.sortBy.split(':');
      filtered.sort((a: any, b: any) => {
        const aVal = a[field] || 0;
        const bVal = b[field] || 0;
        if (order === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  });

  // Paginate products
  const products = computed(() => {
    const start = (catalogStore.currentPage - 1) * catalogStore.itemsPerPage;
    const end = start + catalogStore.itemsPerPage;
    return filteredProducts.value.slice(start, end);
  });

  // Calculate pagination metadata
  const paginationMeta = computed(() => {
    const totalItems = filteredProducts.value.length;
    const totalPages = Math.ceil(totalItems / catalogStore.itemsPerPage);
    const startItem = totalItems > 0
      ? (catalogStore.currentPage - 1) * catalogStore.itemsPerPage + 1
      : 0;

    return {
      totalItems,
      totalPages,
      currentPage: catalogStore.currentPage,
      itemsPerPage: catalogStore.itemsPerPage,
      startItem,
    };
  });

  // Handle pagination events
  const handlePageChange = (page: number) => {
    catalogStore.setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    catalogStore.setItemsPerPage(items);
  };

  const refetch = () => {
    // No-op for offline mode
  };

  const linkText = "Lihat Detail";
</script>
