<script setup lang="ts">
  import type { ProductWithRelations } from "~/types/product";
  interface Props {
    product?: ProductWithRelations & {
      social_forestry_business_group?: {
        contact?: {
          chief_contact: string;
        };
      };
    };
  }

  const props = defineProps<Props>();
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-neutral-700 whitespace-nowrap">
        Informasi tambahan
      </span>
      <div class="flex-1 border-t border-neutral-200"></div>
    </div>
    <div class="flex flex-col gap-8 mt-12">
      <div class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Wilayah:
        </span>
        <span class="text-md font-semibold text-neutral-900 whitespace-nowrap">
          {{ product?.social_forestry_business_group?.name || "N/A" }}
        </span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Komoditas:
        </span>
        <span class="text-md font-semibold text-neutral-900 whitespace-nowrap">
          {{ product?.name || "N/A" }}
        </span>
      </div>
      <div v-if="product?.product_usage" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Penggunaan:
        </span>
        <span class="text-md font-semibold text-neutral-900 whitespace-nowrap">
          {{ product.product_usage }}
        </span>
      </div>
      <div v-if="product?.value_chain" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Jenis Bahan:
        </span>
        <span class="text-md font-semibold text-neutral-900 whitespace-nowrap">
          {{ product.value_chain }}
        </span>
      </div>
    </div>
  </div>
</template>
