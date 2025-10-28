<template>
  <div
    class="border-t border-neutral-200 flex flex-col gap-6 pt-6 text-sm font-medium"
  >
    <div class="flex gap-2 items-center">
      <NuxtLink
        to="/"
        class="text-text-secondary flex items-center gap-2 hover:text-neutral-1000"
        >Beranda <Icon name="uil:angle-right" size="20px"
      /></NuxtLink>
      <NuxtLink
        to="/katalog"
        class="text-text-secondary flex items-center gap-2 hover:text-neutral-1000"
        >Katalog <Icon name="uil:angle-right" size="20px"
      /></NuxtLink>
      <div class="text-neutral-1000">{{ product?.name || "Produk" }}</div>
    </div>
    <div class="flex items-center gap-2">
      <BaseLinkButton
        to="/katalog"
        class="border border-neutral-300 text-md py-2.5 px-5 gap-[6px]"
        ><Icon
          name="uil:angle-left"
          mode="svg"
          size="20px"
          class="!w-5 !h-5 scale-[1.25]"
        />
        Kembali ke Katalog</BaseLinkButton
      >
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { ProductWithRelations } from "~/types/product";
  interface Props {
    product?: ProductWithRelations | null;
  }

  const props = defineProps<Props>();
</script>
