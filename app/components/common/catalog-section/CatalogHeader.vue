<template>
  <section class="gap-10 flex flex-col">
    <div v-if="props.label">
      <IconBadge :label="props.label" icon="plant" variant="white" />
    </div>
    <div class="flex justify-between items-center">
      <div class="pr-[180px]">
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
      <BaseButton class="whitespace-nowrap" v-if="props.linkText">{{
        props.linkText
      }}</BaseButton>
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
