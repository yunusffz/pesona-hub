<template>
  <button class="dropdown-trigger rounded-full">
    <div class="trigger-content flex flex-nowrap">
      <Icon :name="icon" size="20px" class="trigger-icon" />
      <span class="trigger-text text-base text-nowrap">
        {{ displayText }}
      </span>
    </div>
    <Icon name="uil:angle-down" size="20px" class="chevron-icon" />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  selectedCount: number;
  placeholder: string;
  selectedText?: string;
  icon: string;
}

const props = defineProps<Props>();

const displayText = computed(() => {
  if (props.selectedCount > 0) {
    return props.selectedText
      ? `${props.selectedCount} ${props.selectedText}`
      : `${props.selectedCount} ${props.placeholder}`;
  }
  return props.placeholder;
});
</script>

<style scoped>
.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 340px;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-trigger:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.trigger-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trigger-icon {
  color: #6b7280;
}

.trigger-text {
  color: #374151;
  font-weight: 500;
}

.chevron-icon {
  color: #9ca3af;
}
</style>
