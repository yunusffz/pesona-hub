<template>
  <section class="gap-10 flex flex-col">
    <div v-if="props.label">
      <IconBadge :label="props.label" icon="plant" variant="white" />
    </div>
    <div
      class="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-0"
    >
      <div class="lg:pr-[180px] pr-0">
        <h1 class="font-medium text-[40px] leading-[48px]">
          {{ props.title }}
        </h1>
        <p
          :class="
            cn('text-md text-[#585858] mt-[21px]', props.descriptionClass)
          "
        >
          {{ props.description }}
        </p>
      </div>
      <BaseButton
        class="whitespace-nowrap w-full lg:w-auto"
        v-if="props.linkText"
        >{{ props.linkText }}</BaseButton
      >
    </div>
  </section>
</template>

<script setup lang="ts">
  import IconBadge from "~/components/base/IconBadge.vue";
  import BaseButton from "~/components/base/BaseButton.vue";
  import { cn } from "~/lib/utils";

  const props = defineProps<{
    title: string;
    description: string;
    link?: string;
    linkText?: string;
    label?: string;
    descriptionClass?: string;
  }>();
</script>
