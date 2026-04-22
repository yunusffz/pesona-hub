<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Filter KUPS</span>
      <span class="text-[#717182]">({{ modelValue.length }}/{{ options.length }})</span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2">
      <div v-if="isLoading" class="text-xs text-[#717182]">
        Memuat data KUPS...
      </div>
      <div v-else-if="options.length === 0" class="text-xs text-[#717182]">
        Tidak ada data KUPS
      </div>
      <template v-else>
        <input
          v-model="search"
          type="text"
          placeholder="Cari KUPS..."
          class="w-full text-xs px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#035925]"
        />
        <div class="max-h-48 overflow-y-auto pr-1">
          <CommodityPriorityItem
            v-for="option in filteredOptions"
            :key="option.value"
            :label="option.label"
            :is-selected="modelValue.includes(option.value)"
            @toggle="toggle(option.value)"
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
import { useSocialForestryBusinessGroups } from "~/queries/useSocialForestryBusinessGroups";

const props = withDefaults(
  defineProps<{
    modelValue: number[];
    defaultExpanded?: boolean;
  }>(),
  { defaultExpanded: true }
);

const emit = defineEmits<{
  "update:modelValue": [value: number[]];
}>();

const isExpanded = ref(props.defaultExpanded);
const search = ref("");

const { data, isLoading } = useSocialForestryBusinessGroups({
  fields: ["id", "name"],
});

const options = computed(() => {
  const list = (data.value as any)?.data;
  if (!Array.isArray(list)) return [];
  return list.map((g: any) => ({ label: g.name ?? String(g.id), value: g.id as number }));
});

const filteredOptions = computed(() => {
  if (!search.value.trim()) return options.value;
  const q = search.value.toLowerCase();
  return options.value.filter((o) => o.label.toLowerCase().includes(q));
});

const toggle = (value: number) => {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value];
  emit("update:modelValue", next);
};
</script>
