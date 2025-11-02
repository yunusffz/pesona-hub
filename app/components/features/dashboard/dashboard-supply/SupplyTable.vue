<template>
  <section>
    <div class="flex items-center justify-between">
      <SearchInput
        class="w-[290px] h-9"
        placeholder="Cari..."
        :onSearch="handleSearch"
      />
      <BaseButton
        variant="solid"
        class="pr-2 px-3 py-2 justify-between text-sm"
      >
        <Icon name="uil:file-export" class="w-4 h-4" />
        Export
      </BaseButton>
    </div>
    <div class="mt-4">
      <DataTable :products="filteredProducts" :isLoading="isLoading" />
    </div>
  </section>
</template>
<script setup lang="ts">
  import SearchInput from "~/components/base/SearchInput.vue";
  import BaseButton from "~/components/base/BaseButton.vue";
  import DataTable from "../data-table/DataTable.vue";
  import { useProducts } from "~/queries/useProducts";
  import type { ProductWithRelations } from "~/types/product";
  import { computed, ref } from "vue";

  const { data, isLoading } = useProducts({
    populate: [
      "commodity",
      "social_forestry_business_group",
      "social_forestry_business_group.location",
    ],
    fields: ["id", "name", "value_chain", "metadatas", "thumbnails"],
  });

  const products = computed(() => {
    const productsData = data.value?.data;
    if (Array.isArray(productsData)) {
      return productsData as unknown as ProductWithRelations[];
    }
    return [] as ProductWithRelations[];
  });

  const searchQuery = ref("");

  const handleSearch = (value: string) => {
    searchQuery.value = value.toLowerCase().trim();
  };

  const filteredProducts = computed(() => {
    if (!searchQuery.value) {
      return products.value;
    }

    return products.value.filter((product) => {
      const query = searchQuery.value;

      // Search in product name
      const nameMatch = product.name?.toLowerCase().includes(query);

      // Search in commodity name
      const commodityMatch = (product as any).commodity?.name
        ?.toLowerCase()
        .includes(query);

      // Search in value chain
      const valueChainMatch = product.value_chain
        ?.toLowerCase()
        .includes(query);

      // Search in region (province)
      const businessGroup = product.social_forestry_business_group as any;
      const location = businessGroup?.location;
      const province = location?.province?.toLowerCase() || "";
      const regionMatch = province.includes(query);

      // Search in KUPS name
      const kupsMatch = businessGroup?.name?.toLowerCase().includes(query);

      return (
        nameMatch ||
        commodityMatch ||
        valueChainMatch ||
        regionMatch ||
        kupsMatch
      );
    });
  });
</script>
