<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-semibold text-gray-900 text-lg">
      Komoditas & Kebutuhan Material
    </h1>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900">
        Jenis Komoditas <span class="text-red-500">*</span>
      </label>
      <MultiSelectCombobox
        v-model="selectedCommodities"
        :options="commodities"
        placeholder="Cari Komoditas..."
        empty-text="Pilih Komoditas"
        buttonClass="!bg-[#f8faf8] !rounded-2xl !border-transparent !py-2 !px-3 text-sm !font-normal !text-[#717182]"
        :chevron-directional="true"
        :max="5"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBoxVirtual.vue";
import { useCommodities } from "~/queries/useCommodities";
import type { ProfileFormData } from "~/components/features/cms/mitra/types";

const form = defineModel<ProfileFormData>({ required: true });

const { data } = useCommodities();

const commodities = computed(() => {
  if (!data.value?.data || !Array.isArray(data.value.data)) return [];
  return (data.value.data as Array<Record<string, unknown>>).map((c) => ({
    label: (c as any).name ?? (c as any).label ?? "-",
    value: (c as any).id,
  }));
});

const selectedCommodities = computed<(string | number)[]>({
  get() {
    return form.value.commodities || [];
  },
  set(newValues) {
    form.value.commodities = newValues
      .map((v) => (typeof v === "string" ? Number(v) : v))
      .filter((v) => !isNaN(Number(v)))
      .slice(0, 5) as number[];
  },
});
</script>
