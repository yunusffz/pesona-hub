<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900"
        >Jenis Komoditas <span class="text-red-500">*</span></label
      >
      <p class="text-xs text-[#6B7280]">
        Cari dan pilih komoditas yang Anda butuhkan. Anda dapat memilih lebih
        dari satu (maksimal 5 komoditas).
      </p>
      <MultiSelectCombobox
        v-model="selectedCommodities"
        :options="commodities"
        placeholder="Cari Komoditas..."
        empty-text="Pilih Komoditas"
        buttonClass="!py-2 !px-3 rounded-lg text-sm"
        :max="5"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBoxVirtual.vue";
  import { useCommodities } from "~/queries/useCommodities";

  interface FormData {
    // Step 1 - Identity
    thumbnail: string | null;
    companyName: string;
    partnerLevel: string;
    whatsappNumber: string;
    websiteUrl: string;
    // Step 2 - Interests
    commodities: (string | number)[];
    // Step 3 - Collaboration
    collaborationType: string[];
    additionalInfo: string;
  }

  interface Props {
    modelValue: FormData;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    "update:modelValue": [value: FormData];
  }>();

  const { data } = useCommodities();

  const commodities = computed(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    // Optimize by mapping once and caching the result
    return (data.value.data as Array<Record<string, unknown>>).map(
      (commodity) => {
        const name = (commodity as any).name ?? (commodity as any).label;
        const id = (commodity as any).id;
        return {
          label: name || "-",
          value: id,
        };
      }
    );
  });

  // Use computed with getter/setter for better control
  const selectedCommodities = computed<(string | number)[]>({
    get() {
      return props.modelValue.commodities || [];
    },
    set(newValues) {
      // Convert to numbers and ensure max 5
      const numericValues = newValues
        .map((v) => (typeof v === "string" ? Number(v) : v))
        .filter((v) => v !== null && v !== undefined && !isNaN(Number(v)))
        .slice(0, 5) as number[];

      updateValue("commodities", numericValues);
    },
  });

  function updateValue(key: keyof FormData, value: any) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
  }
</script>
