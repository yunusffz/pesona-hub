<template>
  <div class="flex xl:flex-row flex-col gap-4 justify-start lg:justify-between">
    <div>
      <SearchInput
        class="w-full md:w-[484px] text-md placeholder:text-base"
        size="md"
        :onSearch="onSearch"
      />
    </div>
    <div class="flex md:flex-row flex-col gap-4 max-w-[650px]">
      <FilterLocation />
      <FilterCommodityPriority />
      <FilterCollaboration />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SearchInput from "~/components/base/SearchInput.vue";
  import FilterLocation from "./filter-location/FilterLocation.vue";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import FilterCommodityPriority from "./filter-commodity-priority/FilterCommodityPriority.vue";
  import FilterCollaboration from "./FilterCollaboration.vue";
  const catalogStore = useCatalogStore();
  const onSearch = (value: string) => {
    catalogStore.setSearchQuery(value);
  };
</script>
