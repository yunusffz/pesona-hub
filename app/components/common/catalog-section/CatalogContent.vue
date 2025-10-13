<template>
  <div class="py-[60px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    <CatalogCard
      :product="props.products[0]"
      v-if="props.products[0]"
      :linkText="props.linkText"
    />
    <CatalogCard
      :product="props.products[1]"
      v-if="props.products[1]"
      :linkText="props.linkText"
    />
    <CatalogCard
      :product="props.products[2]"
      v-if="props.products[2]"
      :linkText="props.linkText"
    />
  </div>
</template>

<script setup lang="ts">
  import CatalogCard from "./CatalogCard.vue";
  import type { Product } from "~/types/product";
  const props = defineProps<{
    products: Product[];
    linkText: string;
  }>();
</script>
