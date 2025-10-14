<template>
  <section class="gap-10 flex flex-col">
    <div v-if="props.label">
      <IconBadge :label="props.label" icon="plant" />
    </div>
    <div class="flex justify-between items-center gap-64">
      <div>
        <h1 class="font-medium text-[40px]">
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
  import IconBadge from "~/components/ui/IconBadge.vue";
  import BaseButton from "~/components/ui/BaseButton.vue";
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
