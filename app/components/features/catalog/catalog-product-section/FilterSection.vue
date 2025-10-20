<template>
  <div class="flex gap-4">
    <div>
      <SearchInput />
    </div>
    <div class="flex gap-4 ml-auto">
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
