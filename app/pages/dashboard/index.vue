<template>
  <DashboardSection />
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ["auth"] as any,
    requiresAuth: true,
  });
  import DashboardSection from "@/components/features/dashboard/DashboardSection.vue";
</script>
