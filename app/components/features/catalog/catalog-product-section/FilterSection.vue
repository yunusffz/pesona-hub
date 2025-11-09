<template>
  <div class="flex xl:flex-row flex-col gap-4 justify-start lg:justify-between">
    <div>
      <SearchInput
        class="w-full md:w-[484px] text-md placeholder:text-md"
        :onSearch="onSearch"
      />
    </div>
    <div class="flex md:flex-row flex-col gap-4">
      <FilterLocation />
      <FilterCommodity />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SearchInput from "~/components/base/SearchInput.vue";
  import FilterLocation from "./FilterLocation.vue";
  import FilterCommodity from "./FilterCommodity.vue";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  const catalogStore = useCatalogStore();
  const onSearch = (value: string) => {
    catalogStore.setSearchQuery(value);
  };
  const selectedLocation = ref<string[]>([]);

  // Sync with store
  watch(
    () => catalogStore.selectedLocations,
    (newLocations) => {
      selectedLocation.value = newLocations;
    },
    { immediate: true }
  );
</script>
