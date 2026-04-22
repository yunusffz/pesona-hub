<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Filter Balai</span>
      <span class="text-[#717182]">({{ modelValue.length }}/{{ options.length }})</span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2">
      <div v-if="isLoading" class="text-xs text-[#717182]">Memuat data balai...</div>
      <div v-else-if="options.length === 0" class="text-xs text-[#717182]">Tidak ada data balai</div>
      <template v-else>
        <input
          v-model="search"
          type="text"
          placeholder="Cari balai..."
          class="w-full text-xs px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#035925]"
        />
        <div class="max-h-48 overflow-y-auto pr-1">
          <CommodityPriorityItem
            v-for="option in filteredOptions"
            :key="option"
            :label="option"
            :is-selected="modelValue.includes(option)"
            @toggle="toggle(option)"
          />
          <p v-if="filteredOptions.length === 0" class="text-xs text-[#717182] px-2 py-1">
            Tidak ditemukan
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CommodityPriorityItem from "./CommodityPriorityItem.vue";
import { useLocations } from "~/queries/useLocations";

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    defaultExpanded?: boolean;
  }>(),
  { defaultExpanded: true }
);

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const isExpanded = ref(props.defaultExpanded);
const search = ref("");

const { data, isLoading } = useLocations({ fields: ["hall"] });

const options = computed<string[]>(() => {
  const list = (data.value as any)?.data;
  if (!Array.isArray(list)) return [];
  const halls = list
    .map((l: any) => l.hall as string | null)
    .filter((h): h is string => !!h);
  return [...new Set(halls)].sort();
});

const filteredOptions = computed(() => {
  if (!search.value.trim()) return options.value;
  const q = search.value.toLowerCase();
  return options.value.filter((h) => h.toLowerCase().includes(q));
});

const toggle = (value: string) => {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value];
  emit("update:modelValue", next);
};
</script>
