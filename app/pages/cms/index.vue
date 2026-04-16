<template>
  <Product />
</template>
<script setup lang="ts">
import Product from "~/components/features/cms/product/Product.vue";
definePageMeta({
  layout: "cms",
  middleware: "admin",
});
</script>
