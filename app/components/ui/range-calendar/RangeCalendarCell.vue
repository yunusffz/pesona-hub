<script lang="ts" setup>
import type { RangeCalendarCellProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { RangeCalendarCell, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<RangeCalendarCellProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarCell
    :class="cn(
      'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
      // Selected range styling
      '[&:has([data-selected])]:bg-primary/10',
      '[&:has([data-selected])]:text-primary',
      // First and last selected
      'first:[&:has([data-selected])]:rounded-l-md',
      'last:[&:has([data-selected])]:rounded-r-md',
      // Outside view
      '[&:has([data-selected][data-outside-view])]:bg-primary/5',
      '[&:has([data-selected][data-outside-view])]:opacity-30',
      // Selection edges - full rounding
      '[&:has([data-selected][data-selection-end])]:rounded-r-md',
      '[&:has([data-selected][data-selection-start])]:rounded-l-md',
      props.class
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCell>
</template>
