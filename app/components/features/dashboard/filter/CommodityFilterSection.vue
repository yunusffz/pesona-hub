<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Pilih Komoditas</span>
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
        v-for="commodity in options"
        :key="commodity.value"
        class="flex items-center gap-1.5 cursor-pointer"
        @click="toggleCommodity(commodity.value)"
      >
        <Checkbox :checked="selectedMap[String(commodity.value)] || false" />
        <span class="flex-1 text-xs text-neutral-950">
          {{ commodity.label }}
        </span>
        <span class="text-xs text-[#717182]"
          >({{ getCommodityCount(commodity.value) }})</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { Checkbox } from "~/components/ui/checkbox";

  interface CommodityOption {
    label: string;
    value: string | number;
  }

  interface Props {
    options: CommodityOption[];
    selectedMap: Record<string | number, boolean>;
    defaultExpanded?: boolean;
  }

  interface Emits {
    (e: "update:selectedMap", value: Record<string | number, boolean>): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultExpanded: true,
  });

  const emit = defineEmits<Emits>();

  const isExpanded = ref(props.defaultExpanded);

  const checkedCount = computed(() => {
    return Object.values(props.selectedMap).filter(Boolean).length;
  });

  const getCommodityCount = (value: string | number) => {
    return 0;
  };

  const toggleCommodity = (value: string | number) => {
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
