<template>
  <div class="flex xl:flex-row flex-col gap-4 justify-start lg:justify-between">
    <div>
      <SearchInput class="w-full md:w-[484px]" :onSearch="onSearch" />
    </div>
    <div class="flex md:flex-row flex-col gap-4">
      <FilterRegional />
      <FilterRegional />
      <FilterRegional />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SearchInput from "~/components/base/SearchInput.vue";
  import FilterRegional from "./FilterRegional.vue";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  const catalogStore = useCatalogStore();
  const onSearch = (value: string) => {
    catalogStore.setSearchQuery(value);
  };
</script>
