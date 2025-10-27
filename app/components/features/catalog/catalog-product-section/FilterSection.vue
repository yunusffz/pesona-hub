<template>
  <div class="flex xl:flex-row flex-col gap-4 justify-start lg:justify-between">
    <div>
      <SearchInput class="w-full md:w-[484px]" />
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
</script>
