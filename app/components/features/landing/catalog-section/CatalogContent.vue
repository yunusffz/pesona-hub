<template>
  <div class="py-[60px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    <CatalogCard />
    <CatalogCard />
    <CatalogCard />
  </div>
</template>

<script setup lang="ts">
  import CatalogCard from "./CatalogCard.vue";
</script>
