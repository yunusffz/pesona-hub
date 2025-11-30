<template>
  <div class="location-level" :class="`${level}-level`">
    <div
      class="location-item"
      :class="{ selected: isSelected }"
      @click="$emit('toggle')"
    >
      <Icon
        v-if="isSelected"
        name="uil:check"
        size="16px"
        class="check-icon"
      />
      <span class="location-name">{{ name }}</span>
      <span v-if="itemCount !== undefined" class="item-count"
        >({{ itemCount }})</span
      >
    </div>

    <div v-if="showChildren" class="location-children">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    name: string;
    level: "province" | "regency" | "district";
    isSelected: boolean;
    showChildren?: boolean;
    itemCount?: number;
  }

  defineProps<Props>();
  defineEmits<{
    toggle: [];
  }>();
</script>

<style scoped>
  .location-level {
    margin-bottom: 0.25rem;
  }

  .location-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    min-height: 38px;
  }

  .location-item:hover {
    background-color: #f3f4f6;
  }

  .location-item.selected {
    background-color: #effcef;
    color: #035925;
    font-weight: 500;
  }

  .location-item.selected .location-name {
    color: #035925;
    font-weight: 600;
  }

  .check-icon {
    flex-shrink: 0;
    color: #035925;
  }

  .location-name {
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

  .location-item.selected .item-count {
    color: #035925;
    font-weight: 600;
  }

  .location-children {
    padding-left: 1.5rem;
    margin-top: 0.25rem;
    position: relative;
  }

  .location-children::before {
    content: "";
    position: absolute;
    left: 0.5rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #e2e8f0;
  }

  .province-level .location-item {
    font-weight: 500;
  }

  .regency-level .location-item {
    font-size: 0.875rem;
  }

  .district-level .location-item {
    font-size: 0.813rem;
    padding-left: 0.5rem;
  }
</style>
