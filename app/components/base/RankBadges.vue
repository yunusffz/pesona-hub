<template>
  <Badge
    variant="white-transparent"
    class="flex items-center gap-2 py-1 px-3 border border-[#E8E8E840]"
  >
    <NuxtImg
      :src="`/assets/images/${props.rank}.png`"
      alt="Rank Badge"
      class="w-5 h-5"
    />
    <span class="text-neutral-1000 text-xs font-semibold">{{
      props.rank.charAt(0).toUpperCase() + props.rank.slice(1)
    }}</span>
  </Badge>
</template>

<script setup lang="ts">
  import Badge from "~/components/ui/badge/Badge.vue";
  const props = defineProps<{
    rank: "silver" | "gold" | "platinum";
  }>();
</script>
