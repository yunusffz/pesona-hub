<template>
  <div class="flex gap-4">
    <div>
      <SearchInput />
    </div>
    <div class="gap-4 ml-auto">
      <FilterRegional />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SearchInput from "~/components/ui/SearchInput.vue";
  import FilterRegional from "./FilterRegional.vue";
</script>
