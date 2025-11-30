<template>
  <div class="search-container">
    <Icon name="uil:search" size="16px" class="search-icon" />
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="search-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <Icon
      v-if="modelValue"
      name="uil:times"
      size="16px"
      class="clear-icon"
      @click="$emit('update:modelValue', '')"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    modelValue: string;
    placeholder: string;
  }>();

  defineEmits<{
    "update:modelValue": [value: string];
  }>();
</script>

<style scoped>
  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    padding: 0 0.25rem;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    color: #6b7280;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    border-color: #035925;
    box-shadow: 0 0 0 2px rgba(3, 89, 37, 0.1);
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .clear-icon {
    position: absolute;
    right: 0.75rem;
    color: #9ca3af;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .clear-icon:hover {
    color: #6b7280;
  }
</style>
