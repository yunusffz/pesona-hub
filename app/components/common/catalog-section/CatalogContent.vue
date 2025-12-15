<template>
  <div
    class="py-[60px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    v-if="!props.isLoading"
  >
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
  <div v-if="props.isLoading" class="flex justify-center items-center py-12">
    <Loader />
  </div>
</template>

<script setup lang="ts">
import CatalogCard from "./CatalogCard.vue";
import type { ProductWithRelations } from "~/types/product";
import Loader from "~/components/base/Loader.vue";

type ExtendedProduct = ProductWithRelations & {
  social_forestry_business_group?: {
    contact?: {
      chief_contact: string;
    };
    location?: {
      province: string;
    };
    name?: string;
    class_group?: string;
  };
  social_forestry_group?: {
    name?: string;
  };
};
const props = defineProps<{
  products: ExtendedProduct[];
  linkText: string;
  isLoading: boolean;
}>();
</script>
