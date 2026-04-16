<template>
  <Collaboration />
</template>

<script setup lang="ts">
import Collaboration from "~/components/features/cms/collaboration/Collaboration.vue";

definePageMeta({
  layout: "cms",
  middleware: "admin",
});
</script>
