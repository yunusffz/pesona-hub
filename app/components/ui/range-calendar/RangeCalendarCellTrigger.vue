<script lang="ts" setup>
import type { RangeCalendarCellTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { RangeCalendarCellTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<RangeCalendarCellTriggerProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarCellTrigger
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'h-8 w-8 p-0 font-normal transition-colors',
      // Base hover state (not selected, not disabled)
      'hover:bg-primary/20 hover:text-primary',
      // Today styling (when not selected)
      '[&[data-today]:not([data-selected]):not([data-selection-start]):not([data-selection-end])]:bg-accent',
      '[&[data-today]:not([data-selected]):not([data-selection-start]):not([data-selection-end])]:text-accent-foreground',
      '[&[data-today]:not([data-selected]):not([data-selection-start]):not([data-selection-end])]:font-semibold',
      // Selected range (middle dates)
      'data-[selected]:text-primary data-[selected]:bg-transparent data-[selected]:font-medium',
      'data-[selected]:hover:bg-primary/30',
      // Selection Start - primary background with white text
      'data-[selection-start]:!bg-primary data-[selection-start]:!text-white data-[selection-start]:font-semibold',
      'data-[selection-start]:hover:!bg-primary-dark data-[selection-start]:hover:!text-white',
      'data-[selection-start]:focus:!bg-primary data-[selection-start]:focus:!text-white',
      // Selection End - primary background with white text
      'data-[selection-end]:!bg-primary data-[selection-end]:!text-white data-[selection-end]:font-semibold',
      'data-[selection-end]:hover:!bg-primary-dark data-[selection-end]:hover:!text-white',
      'data-[selection-end]:focus:!bg-primary data-[selection-end]:focus:!text-white',
      // Outside months
      'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50',
      '[&[data-outside-view][data-selected]]:text-muted-foreground [&[data-outside-view][data-selected]]:opacity-30',
      // Disabled - no hover
      'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
      'data-[disabled]:hover:bg-transparent',
      // Unavailable
      'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCellTrigger>
</template>
