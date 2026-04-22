<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Kelas KUPS</span>
      <span class="text-[#717182]">({{ modelValue.length }}/{{ options.length }})</span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2">
      <CommodityPriorityItem
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :is-selected="modelValue.includes(option.value)"
        @toggle="toggle(option.value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CommodityPriorityItem from "./CommodityPriorityItem.vue";

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    defaultExpanded?: boolean;
  }>(),
  { defaultExpanded: true }
);

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const isExpanded = ref(props.defaultExpanded);

const options = [
  { label: "Platinum", value: "PLATINUM" },
  { label: "Gold", value: "GOLD" },
  { label: "Silver", value: "SILVER" },
];

const toggle = (value: string) => {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value];
  emit("update:modelValue", next);
};
</script>
