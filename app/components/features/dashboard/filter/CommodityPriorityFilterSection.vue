<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Pilih Prioritas Komoditas</span>
      <span class="text-[#717182]">
        ({{ selectedCount }}/{{ options.length }})
      </span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2.5">
      <div v-if="isLoading" class="text-xs text-[#717182]">
        Memuat data prioritas komoditas...
      </div>
      <div v-else-if="error" class="text-xs text-red-500">
        Error memuat prioritas komoditas: {{ error.message }}
      </div>
      <div
        v-else-if="options.length === 0"
        class="text-xs text-[#717182]"
      >
        Tidak ada data prioritas komoditas
      </div>

      <div v-else class="flex flex-col gap-2">
        <div class="max-h-[300px] overflow-y-auto pr-1">
          <CommodityPriorityItem
            v-for="priority in options"
            :key="priority.value"
            :label="priority.label"
            :is-selected="isSelected(priority.value)"
            :count="priority.count"
            @toggle="toggleSelection(priority.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import CommodityPriorityItem from "./CommodityPriorityItem.vue";

  interface PriorityOption {
    label: string;
    value: string;
    count?: number;
  }

  interface Props {
    options: PriorityOption[];
    modelValue: string[];
    defaultExpanded?: boolean;
    isLoading?: boolean;
    error?: Error | null;
  }

  interface Emits {
    (e: "update:modelValue", value: string[]): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultExpanded: true,
    isLoading: false,
    error: null,
  });

  const emit = defineEmits<Emits>();

  const isExpanded = ref(props.defaultExpanded);

  const selectedCount = computed(() => {
    return props.modelValue.length;
  });

  const isSelected = (value: string): boolean => {
    return props.modelValue.includes(value);
  };

  const toggleSelection = (value: string) => {
    const index = props.modelValue.indexOf(value);
    const newSelection = [...props.modelValue];

    if (index > -1) {
      newSelection.splice(index, 1);
    } else {
      newSelection.push(value);
    }

    emit("update:modelValue", newSelection);
  };

  watch(
    () => props.defaultExpanded,
    (newValue) => {
      isExpanded.value = newValue;
    }
  );
</script>
