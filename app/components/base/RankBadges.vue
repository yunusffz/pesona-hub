<template>
  <Badge
    :variant="variant"
    :class="cn('flex items-center gap-2 py-1 px-3 border border-[#E8E8E840]', props.class)"
  >
    <NuxtImg
      :src="`/assets/images/${props.rank.toLowerCase()}.png`"
      alt="Rank Badge"
      :class="iconSize"
    />
    <span :class="textSize" class="font-semibold">{{
      toTitleCase(props.rank || "")
    }}</span>
  </Badge>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import Badge from "~/components/ui/badge/Badge.vue";
import type { BadgeVariants } from "~/components/ui/badge";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    rank: "silver" | "gold" | "platinum" | "blue";
    variant?: BadgeVariants["variant"];
    textSize?: string;
    iconSize?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    variant: "white-transparent",
    textSize: "text-xs",
    iconSize: "w-5 h-5",
  }
);

const { toTitleCase } = useTitleCase();
</script>
