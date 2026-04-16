<template>
  <Mitra />
</template>
<script setup lang="ts">
import Mitra from "~/components/features/cms/mitra/Mitra.vue";
definePageMeta({
  layout: "cms",
  middleware: "admin",
});
</script>
