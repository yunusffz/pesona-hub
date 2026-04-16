<template>
  <Faq />
</template>

<script setup lang="ts">
import Faq from "~/components/features/cms/faq/Faq.vue";

definePageMeta({
  layout: "cms",
  middleware: "admin",
});
</script>
