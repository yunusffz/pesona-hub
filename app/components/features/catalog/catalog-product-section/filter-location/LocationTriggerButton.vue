<template>
  <button class="dropdown-trigger rounded-full">
    <div class="trigger-content flex flex-nowrap">
      <Icon name="uil:map-marker" size="20px" class="trigger-icon" />
      <span class="trigger-text text-base">
        {{ displayText }}
      </span>
    </div>
    <Icon name="uil:angle-down" size="20px" class="chevron-icon" />
  </button>
</template>

<script setup lang="ts">
  interface Props {
    selectedCount: number;
  }

  const props = defineProps<Props>();

  const displayText = computed(() => {
    return props.selectedCount > 0
      ? `${props.selectedCount} wilayah dipilih`
      : "Pilih Wilayah";
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
