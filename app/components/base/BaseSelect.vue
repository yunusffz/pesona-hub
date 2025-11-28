<template>
  <Select :model-value="modelValue" @update:model-value="handleUpdate">
    <SelectTrigger
      :class="
        cn(
          'h-9 text-sm relative [&_svg:not(.custom-icon)]:hidden border border-[#d9d9d9] shadow-none rounded-lg text-[#6B7280] font-medium',
          backgroundColor,
          props.class
        )
      "
    >
      <SelectValue :placeholder="placeholder" />
      <ChevronDown
        v-if="iconType === 'chevron-down'"
        class="custom-icon absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
      />
      <ChevronsUpDown
        v-else
        class="custom-icon absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
      />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
  import type { HTMLAttributes } from "vue";
  import { useVModel } from "@vueuse/core";
  import { cn } from "@/lib/utils";
  import { ChevronsUpDown, ChevronDown } from "lucide-vue-next";
  import type { AcceptableValue } from "reka-ui";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  interface SelectOption {
    label: string;
    value: string;
  }

  interface Props {
    modelValue?: AcceptableValue;
    options: SelectOption[];
    placeholder?: string;
    class?: HTMLAttributes["class"];
    iconType?: "chevron-down" | "chevrons-up-down";
    backgroundColor?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: "Select an option",
    iconType: "chevrons-up-down",
    backgroundColor: "",
  });

  const emits = defineEmits<{
    (e: "update:modelValue", payload: AcceptableValue): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const handleUpdate = (value: AcceptableValue) => {
    modelValue.value = value;
  };
</script>
