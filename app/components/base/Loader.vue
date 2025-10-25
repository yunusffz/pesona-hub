<template>
  <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- Rotating ring with rounded head -->
    <div
      class="absolute inset-0 rounded-full animate-spin"
      :style="{
        background: `conic-gradient(
          from 90deg at 50% 50%,
          rgba(73, 174, 39, 0) 0deg,
          ${color} 360deg
        )`,
        maskImage:
          'radial-gradient(circle at center, transparent 60%, black 61%)',
        WebkitMaskImage:
          'radial-gradient(circle at center, transparent 60%, black 61%)',
        animationDuration: `${speed}s`,
      }"
    ></div>

    <!-- Inner cutout -->
    <div class="absolute inset-[4px] rounded-full"></div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    size?: number;
    color?: string;
    speed?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 56,
    color: "#4DE13A",
    speed: 1,
  });
</script>

<style scoped>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
