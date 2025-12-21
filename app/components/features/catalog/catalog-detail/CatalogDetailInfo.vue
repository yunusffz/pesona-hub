<script setup lang="ts">
import type { ProductWithRelations } from "~/types/product";
interface Props {
  product?: ProductWithRelations & {
    social_forestry_business_group?: {
      contact?: {
        chief_contact: string;
      };
      location?: {
        province: string;
      };
      name?: string;
    };
    social_forestry_group?: {
      name?: string;
    };
  };
}

const props = defineProps<Props>();
const { toTitleCase } = useTitleCase();
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-neutral-700 whitespace-nowrap">
        Informasi tambahan
      </span>
      <div class="flex-1 border-t border-neutral-200"></div>
    </div>
    <div class="flex flex-col gap-8 mt-8">
      <div v-if="product?.commodity?.name" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Komoditas:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ toTitleCase(product.commodity.name) }}
        </span>
      </div>

      <div v-if="product?.product_category" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Kategori Produk:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ toTitleCase(product.product_category) }}
        </span>
      </div>

      <div v-if="product?.product_usage" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Penggunaan:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ toTitleCase(product.product_usage) }}
        </span>
      </div>

      <div v-if="product?.value_chain" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Jenis Bahan:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ toTitleCase(product.value_chain) }}
        </span>
      </div>

      <div v-if="product?.capacity" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Kapasitas:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ product.capacity }} {{ product?.unit || "" }}
        </span>
      </div>

      <div v-if="product?.unit" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Satuan:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ product.unit }}
        </span>
      </div>

      <div v-if="product?.source" class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Mitra Fasilitator:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ product.source }}
        </span>
      </div>

      <div
        v-if="product?.social_forestry_business_group?.location?.province"
        class="flex flex-col gap-1"
      >
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Wilayah:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{
            toTitleCase(
              product.social_forestry_business_group.location.province
            )
          }}
        </span>
      </div>

      <div
        v-if="product?.social_forestry_business_group?.name"
        class="flex flex-col gap-1"
      >
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          KUPS:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ toTitleCase(product.social_forestry_business_group.name) }}
        </span>
      </div>

      <div
        v-if="product?.social_forestry_group?.name"
        class="flex flex-col gap-1"
      >
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          KPS:
        </span>
        <span class="text-md font-semibold text-neutral-900">
          {{ toTitleCase(product.social_forestry_group.name) }}
        </span>
      </div>
    </div>
  </div>
</template>
