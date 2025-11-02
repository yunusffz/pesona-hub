<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Urutkan</span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2.5">
      <select
        :value="sortBy"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        @change="handleChange"
      >
        <option value="">Pilih urutan...</option>
        <option value="name:asc">Nama (A-Z)</option>
        <option value="name:desc">Nama (Z-A)</option>
        <option value="price:asc">Harga (Terendah)</option>
        <option value="price:desc">Harga (Tertinggi)</option>
        <option value="created_at:desc">Terbaru</option>
        <option value="created_at:asc">Terlama</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  sortBy: string;
  defaultExpanded?: boolean;
}

interface Emits {
  (e: "update:sortBy", value: string): void;
  (e: "change"): void;
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false,
});

const emit = defineEmits<Emits>();

const isExpanded = ref(props.defaultExpanded);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:sortBy", target.value);
  emit("change");
};

watch(
  () => props.defaultExpanded,
  (newValue) => {
    isExpanded.value = newValue;
  }
);
</script>

