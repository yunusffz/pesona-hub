<!-- components/ui/BaseButton.vue -->
<template>
  <button
    class="text-md font-medium text-white bg-primary rounded-full px-5 py-[18px] hover:bg-primary/80"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
