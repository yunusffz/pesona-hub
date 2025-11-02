<script setup lang="ts">
  import CatalogDetailHeader from "./CatalogDetailHeader.vue";
  import CatalogDetailContent from "./CatalogDetailContent.vue";
  import { useProduct } from "~/queries";
  import type { ProductWithRelations } from "~/types/product";
  import Loader from "~/components/base/Loader.vue";
  // Get product ID from route params
  const route = useRoute();
  const productId = route.params.slug as string;

  // Fetch product detail with populated relations
  const {
    data: productData,
    isLoading,
    error,
  } = useProduct(productId, {
    populate: ["social_forestry_business_group.contact"],
    fields: ["name", "description", "price", "unit", "product_usage"],
  });

  // Extract product data from API response
  const product = computed<ProductWithRelations | null>(() => {
    if (!productData.value?.data) return null;
    return productData.value.data as ProductWithRelations;
  });

  // Provide product data to child components
  provide("product", product);
  provide("isLoading", isLoading);
  provide("error", error);
</script>

<template>
  <section class="mt-10 2xl:px-20 lg:px-10 flex flex-col gap-10 mb-[60px] px-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Loader />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <h2 class="text-2xl font-semibold text-neutral-900 mb-4">
        Data Produk Tidak Ditemukan
      </h2>
      <p class="text-gray-600">{{ error.message }}</p>
    </div>

    <!-- Product Content -->
    <template v-else-if="product">
      <CatalogDetailHeader :product="product" />
      <CatalogDetailContent :product="product" />
    </template>

    <!-- No Product Found -->
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-semibold text-gray-600 mb-4">
        Product Not Found
      </h2>
      <p class="text-gray-500">The requested product could not be found.</p>
    </div>
  </section>
</template>
