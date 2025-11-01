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
  import { useProducts } from "~/queries";
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

  // Use products query with reactive parameters
  const { data, isLoading, error, refetch } = useProducts({
    get search() {
      return catalogStore.searchQuery;
    },
    get page() {
      return catalogStore.currentPage;
    },
    get limit() {
      return catalogStore.itemsPerPage;
    },
    get filters() {
      return catalogStore.filters;
    },
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

  // Extract pagination metadata from API response
  const paginationMeta = computed(() => {
    const meta = data.value?.meta;
    if (meta && typeof meta === "object" && "pagination" in meta) {
      const pagination = meta.pagination as any;
      return {
        totalItems: pagination.total || 0,
        totalPages: pagination.page_count || 0,
        currentPage: pagination.page || 1,
        itemsPerPage: 12,
        startItem:
          ((pagination.page || 1) - 1) *
            (pagination.page_size || catalogStore.itemsPerPage) +
          1,
      };
    }
    return {
      totalItems: 0,
      totalPages: 0,
      currentPage: catalogStore.currentPage,
      itemsPerPage: catalogStore.itemsPerPage,
      startItem: 0,
    };
  });

  // Pagination metadata is now accessed via paginationMeta computed property

  // Handle pagination events
  const handlePageChange = (page: number) => {
    catalogStore.setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    catalogStore.setItemsPerPage(items);
  };

  const linkText = "Lihat Detail";
</script>
