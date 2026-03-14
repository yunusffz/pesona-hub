<template>
  <HighlightProduct />
</template>
<script setup lang="ts">
import HighlightProduct from "~/components/features/cms/highlight-product/HighlightProduct.vue";
definePageMeta({
  layout: "cms",
  middleware: "auth",
  requiresAuth: true,
});
</script>
