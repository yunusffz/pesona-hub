<template>
  <Dashboard />
</template>
<script setup lang="ts">
import Dashboard from "~/components/features/cms/dashboard/Dashboard.vue";
definePageMeta({
  layout: false,
  middleware: "auth",
  requiresAuth: true,
});
</script>
