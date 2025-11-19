<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Pilih Prioritas Komoditas</span>
      <span class="text-[#717182]">
        ({{ checkedCount }}/{{ options.length }})
      </span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2.5">
      <div
        v-for="priority in options"
        :key="priority.value"
        class="flex items-center gap-1.5 cursor-pointer"
        @click="togglePriority(priority.value)"
      >
        <Checkbox :checked="selectedMap[String(priority.value)] || false" />
        <span class="flex-1 text-xs text-neutral-950">
          {{ priority.label }}
        </span>
        <span class="text-xs text-[#717182]"
          >({{ getPriorityCount(priority.value) }})</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { Checkbox } from "~/components/ui/checkbox";

  interface PriorityOption {
    label: string;
    value: string;
  }

  interface Props {
    options: PriorityOption[];
    selectedMap: Record<string, boolean>;
    defaultExpanded?: boolean;
  }

  interface Emits {
    (e: "update:selectedMap", value: Record<string, boolean>): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultExpanded: true,
  });

  const emit = defineEmits<Emits>();

  const isExpanded = ref(props.defaultExpanded);

  const checkedCount = computed(() => {
    return Object.values(props.selectedMap).filter(Boolean).length;
  });

  const getPriorityCount = (value: string) => {
    return 0;
  };

  const togglePriority = (value: string) => {
    const key = String(value);
    const newMap = {
      ...props.selectedMap,
      [key]: !props.selectedMap[key],
    };
    emit("update:selectedMap", newMap);
  };

  watch(
    () => props.defaultExpanded,
    (newValue) => {
      isExpanded.value = newValue;
    }
  );
</script>
