<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[300px] justify-start text-left font-normal',
            !modelValue && 'text-muted-foreground'
          )
        "
      >
        <Icon name="uil:calendar-alt" class="mr-2 h-4 w-4" />
        <span v-if="modelValue?.start && modelValue?.end">
          {{ formatDate(modelValue.start) }} - {{ formatDate(modelValue.end) }}
        </span>
        <span v-else>Pick a date range</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <RangeCalendar :number-of-months="numberOfMonths" />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from "vue";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import { Button } from "@/components/ui/button";
  import { RangeCalendar } from "@/components/ui/range-calendar";
  import { cn } from "@/lib/utils";
  import type { DateValue } from "@internationalized/date";

  type DateRange = {
    start: DateValue | undefined;
    end: DateValue | undefined;
  };

  interface Props {
    modelValue?: DateRange;
    numberOfMonths?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    numberOfMonths: 2,
  });

  const emit = defineEmits<{
    "update:modelValue": [value: DateRange | undefined];
  }>();

  const isOpen = ref(false);
  const dateRange = ref<DateRange | null | undefined>(
    props.modelValue
      ? { start: props.modelValue.start, end: props.modelValue.end }
      : null
  );

  // Watch for external changes to modelValue
  watch(
    () => props.modelValue,
    (newValue) => {
      dateRange.value = newValue
        ? { start: newValue.start, end: newValue.end }
        : null;
    }
  );

  const handleDateChange = (value: any) => {
    dateRange.value = value as DateRange | null | undefined;
    const convertedValue: DateRange | undefined = value
      ? { start: value.start, end: value.end }
      : undefined;
    emit("update:modelValue", convertedValue);

    // Close popover when both dates are selected
    if (value?.start && value?.end) {
      isOpen.value = false;
    }
  };

  const formatDate = (date: DateValue | undefined): string => {
    if (!date) return "";

    // DateValue from @internationalized/date has year/month/day properties
    const year = date.year;
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");

    return `${day}/${month}/${year}`;
  };
</script>
