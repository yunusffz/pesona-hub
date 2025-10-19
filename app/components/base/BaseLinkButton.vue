<template>
  <NuxtLink
    :to="props.to"
    :class="
      cn(
        'inline-flex items-center px-5 py-[18px] rounded-full font-medium hover:bg-neutral-200',
        'transition-all duration-300',
        props.class
      )
    "
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
  import { cn } from "~/lib/utils";

  const props = defineProps<{
    to: string;
    class?: string;
  }>();
</script>
