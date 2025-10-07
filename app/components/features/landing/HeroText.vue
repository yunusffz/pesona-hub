<template>
  <div class="flex items-center space-x-4 text-sm mb-4">
    <span v-for="tag in tags" :key="tag" class="flex items-center space-x-1">
      <span class="text-green-400">⬥</span>
      <span>{{ tag }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
  const tags = ["Driven", "Rooted", "Impactful"];
</script>
