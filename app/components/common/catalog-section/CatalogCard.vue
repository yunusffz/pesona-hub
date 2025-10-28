<template>
  <div class="rounded-2xl border border-neutral-200">
    <div class="relative">
      <Badge class="absolute top-3 right-6" variant="white-transparent">{{
        props.product.catalogType || "Produk"
      }}</Badge>
      <NuxtImg
        :src="'/assets/images/product-2.png'"
        alt="Product Image"
        class="w-full h-[308px] object-cover rounded-t-2xl"
      />
    </div>
    <div class="flex flex-col px-5 py-4 gap-3">
      <div
        class="flex items-start justify-between 2xl:gap-3 gap-6 2xl:flex-row flex-col"
      >
        <div
          class="flex flex-col gap-3 2xl:flex-1 min-w-0 truncate w-full 2xl:w-auto"
        >
          <h1 class="font-semibold text-[20px] truncate">
            {{ props.product.name }}
          </h1>
          <p class="truncate">
            {{ props.product.description }}
          </p>
        </div>
        <BaseBadge variant="grey" size="xs">{{
          props.product.product_type
        }}</BaseBadge>
      </div>
      <div class="text-neutral-700 text-xs flex flex-col gap-1">
        <div>KPS : {{ props.product.social_forestry_group?.name }}</div>
        <div>
          KUPS : {{ props.product.social_forestry_business_group?.name }}
        </div>
      </div>
      <div>
        <BaseBadge variant="grey" size="xs">{{ props.product.unit }}</BaseBadge>
      </div>
      <div class="py-2 flex 2xl:flex-row flex-col gap-4">
        <div class="flex flex-col gap-1 flex-1">
          <div v-if="isAuthenticated" class="text-lg font-bold">
            {{
              formatRupiah(Number(props.product.price) ?? 0) ?? "Rp. xxx.xxx"
            }}
          </div>
          <div v-else class="text-lg font-bold">Rp xxx.xxx</div>
          <div v-if="!isAuthenticated" class="text-neutral-500 text-xs italic">
            Login untuk melihat harga & kontak supplier
          </div>
        </div>
        <div>
          <a
            :href="'/katalog/' + props.product.id"
            class="border inline-flex items-center justify-center w-full 2xl:w-auto border-neutral-200 rounded-full px-5 py-[10px] text-md bg-white text-neutral-800 font-medium"
          >
            {{ props.linkText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Badge from "~/components/ui/badge/Badge.vue";
  import BaseBadge from "~/components/base/BaseBadge.vue";
  import { formatRupiah } from "~/utils/format-number";
  import type { ApiProduct } from "~/types/api-product";

  const props = defineProps<{
    product: Partial<ApiProduct>;
    linkText: string;
  }>();

  const { isAuthenticated } = useAuth();
</script>
