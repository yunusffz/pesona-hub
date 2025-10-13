<template>
  <section class="gap-10 flex flex-col">
    <div>
      <IconBadge :label="props.label" icon="plant" />
    </div>
    <div class="flex justify-between items-center gap-64">
      <div>
        <h1 class="font-medium text-[40px]">
          {{ props.title }}
        </h1>
        <p class="text-md text-[#585858] mt-[21px]">
          {{ props.description }}
        </p>
      </div>
      <BaseButton class="whitespace-nowrap">{{ props.linkText }}</BaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
  import IconBadge from "~/components/ui/IconBadge.vue";
  import BaseButton from "~/components/ui/BaseButton.vue";
  const props = defineProps<{
    title: string;
    description: string;
    link: string;
    linkText: string;
    label: string;
  }>();
</script>
