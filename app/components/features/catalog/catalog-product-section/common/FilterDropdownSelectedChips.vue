<template>
  <div v-if="items.length > 0" class="selected-items w-[400px] p-3">
    <DropdownMenuSeparator class="my-2" />
    <div class="selected-header">Terpilih ({{ items.length }})</div>
    <div class="selected-chips">
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        class="selected-chip"
      >
        <span class="chip-label">{{ item.label }}</span>
        <Icon
          name="uil:times"
          size="14px"
          class="chip-remove"
          @click="$emit('remove', index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DropdownMenuSeparator } from "~/components/ui/dropdown-menu";

  interface FilterItem {
    label: string;
    value: string | number;
  }

  interface Props {
    items: FilterItem[];
  }

  defineProps<Props>();
  defineEmits<{
    remove: [index: number];
  }>();

  const getItemKey = (item: FilterItem, index: number) => {
    return `${item.value}-${index}`;
  };
</script>

<style scoped>
  .selected-items {
    padding-top: 0.75rem;
  }

  .selected-header {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .selected-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .selected-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background-color: #effcef;
    border: 1px solid #b0d3b0;
    border-radius: 6px;
    font-size: 0.813rem;
  }

  .chip-label {
    color: #035925;
    font-weight: 500;
  }

  .chip-remove {
    cursor: pointer;
    color: #9ca3af;
    transition: color 0.2s ease;
  }

  .chip-remove:hover {
    color: #ef4444;
  }
</style>
