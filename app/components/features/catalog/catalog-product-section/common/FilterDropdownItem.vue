<template>
  <div
    class="filter-item"
    :class="{ selected: isSelected }"
    @click="$emit('toggle')"
  >
    <Icon
      v-if="isSelected"
      name="uil:check"
      size="16px"
      class="check-icon"
    />
    <span class="item-name">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label: string;
    isSelected: boolean;
  }>();

  defineEmits<{
    toggle: [];
  }>();
</script>

<style scoped>
  .filter-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    min-height: 38px;
  }

  .filter-item:hover {
    background-color: #f3f4f6;
  }

  .filter-item.selected {
    background-color: #effcef;
    color: #035925;
    font-weight: 500;
  }

  .check-icon {
    flex-shrink: 0;
    color: #035925;
  }

  .item-name {
    flex: 1;
    font-size: 12px;
    color: #0a0a0a;
    user-select: none;
    line-height: 1.4;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .filter-item.selected .item-name {
    color: #035925;
    font-weight: 600;
  }
</style>
