<template>
  <button
    class="flex items-center space-x-2 font-medium text-md px-3 py-1 border border-[#EBEBEB] rounded-full"
  >
    <SvgIcon :name="icon" class="text-primary" size="18px" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/ui/SvgIcon.vue";

  interface Props {
    label: string;
    icon: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    label: "",
    icon: "",
  });
</script>
