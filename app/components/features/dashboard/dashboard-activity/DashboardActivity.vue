<template>
  <section class="flex flex-col gap-4">
    <ActivityTable :start-date="startDate" :end-date="endDate" />
  </section>
</template>

<script setup lang="ts">
  import ActivityTable from "./ActivityTable.vue";

  interface Props {
    startDate?: string;
    endDate?: string;
  }

  defineProps<Props>();
</script>


