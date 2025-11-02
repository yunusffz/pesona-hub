<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Rentang Harga</span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2.5">
      <div class="flex gap-3">
        <div class="flex-1">
          <label class="block text-xs text-[#717182] mb-1">Min</label>
          <input
            :value="priceMin ?? ''"
            type="number"
            placeholder="Min"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @input="handleMinChange"
          />
        </div>
        <div class="flex-1">
          <label class="block text-xs text-[#717182] mb-1">Max</label>
          <input
            :value="priceMax ?? ''"
            type="number"
            placeholder="Max"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @input="handleMaxChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  priceMin: number | null;
  priceMax: number | null;
  defaultExpanded?: boolean;
}

interface Emits {
  (e: "update:priceMin", value: number | null): void;
  (e: "update:priceMax", value: number | null): void;
  (e: "change"): void;
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false,
});

const emit = defineEmits<Emits>();

const isExpanded = ref(props.defaultExpanded);

const handleMinChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value ? Number(target.value) : null;
  emit("update:priceMin", value);
  emit("change");
};

const handleMaxChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value ? Number(target.value) : null;
  emit("update:priceMax", value);
  emit("change");
};

watch(
  () => props.defaultExpanded,
  (newValue) => {
    isExpanded.value = newValue;
  }
);
</script>

