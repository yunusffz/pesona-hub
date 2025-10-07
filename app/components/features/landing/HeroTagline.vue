<template>
  <div class="flex items-center space-x-4 text-sm mb-4">
    <span v-for="tag in tags" :key="tag" class="flex items-center space-x-1">
      <SvgIcon name="diamond" size="10px" />
      <span>{{ tag }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/ui/SvgIcon.vue";

  const tags = ["Driven", "Rooted", "Impactful"];
</script>
