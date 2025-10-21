<script setup lang="ts">
  interface Props {
    number: string;
    title: string;
    description: string;
  }

  const props = defineProps<Props>();
</script>

<template>
  <section class="p-6 bg-white rounded-2xl">
    <h1 class="font-medium text-[70px] text-rich-black leading-tight">
      {{ props.number }}
    </h1>
    <span class="font-semibold text-[20px]">{{ props.title }}</span>
    <div class="mt-[22px] text-md text-[#585858]">
      {{ props.description }}
    </div>
  </section>
</template>
