<template>
  <div
    class="commodity-item"
    :class="{ selected: isSelected }"
    @click="$emit('toggle')"
  >
    <Icon
      v-if="isSelected"
      name="uil:check"
      size="16px"
      class="check-icon"
    />
    <span class="commodity-name">{{ label }}</span>
    <span v-if="count !== undefined" class="item-count">({{ count }})</span>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    label: string;
    isSelected: boolean;
    count?: number;
  }

  defineProps<Props>();
  defineEmits<{
    toggle: [];
  }>();
</script>

<style scoped>
  .commodity-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    min-height: 38px;
  }

  .commodity-item:hover {
    background-color: #f3f4f6;
  }

  .commodity-item.selected {
    background-color: #effcef;
    color: #035925;
    font-weight: 500;
  }

  .commodity-item.selected .commodity-name {
    color: #035925;
    font-weight: 600;
  }

  .check-icon {
    flex-shrink: 0;
    color: #035925;
  }

  .commodity-name {
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

  .item-count {
    color: #0a0a0a;
    font-size: 12px;
    font-weight: 500;
    margin-left: auto;
    margin-right: 0.875rem;
    flex-shrink: 0;
  }

  .commodity-item.selected .item-count {
    color: #035925;
    font-weight: 600;
  }
</style>
