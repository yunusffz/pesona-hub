<template>
  <div class="flex flex-col gap-4">
    <div>
      <label class="text-sm font-medium"
        >Jenis Komoditas dan Kebutuhan Produksi</label
      >
      <p class="text-xs text-[#6B7280]">
        Pilih komoditas dan estimasi kebutuhan Anda.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">Jenis Komoditas</label>
      <p class="text-xs text-[#6B7280]">
        Cari dan pilih komoditas yang Anda butuhkan. Anda dapat memilih lebih
        dari satu.
      </p>
      <MultiSelectCombobox
        :model-value="modelValue.commodities"
        @update:model-value="updateValue('commodities', $event)"
        :options="commodities"
        placeholder="Cari komoditas"
        empty-text="Pilih komoditas"
        icon="tags"
        icon-size="24px"
        buttonClass="!py-2 !px-3 rounded-lg text-sm"
      />
    </div>

    <!-- Estimasi Kebutuhan Produksi -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">Estimasi Kebutuhan Produksi</label>
      <div class="grid grid-cols-2 gap-3">
        <BaseInput
          :value="modelValue.productionEstimate"
          @input="
            updateValue(
              'productionEstimate',
              ($event.target as HTMLInputElement).value
            )
          "
          type="text"
          placeholder="1000"
          class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none"
        />
        <select
          :value="modelValue.productionUnit"
          @change="
            updateValue(
              'productionUnit',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none"
        >
          <option value="kg">kg</option>
          <option value="ton">ton</option>
          <option value="liter">liter</option>
          <option value="unit">unit</option>
        </select>
      </div>
    </div>

    <!-- Jenis Bahan -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">Jenis Bahan</label>
      <select
        :value="modelValue.materialType"
        @change="
          updateValue(
            'materialType',
            ($event.target as HTMLSelectElement).value
          )
        "
        class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none"
      >
        <option value="">Pilih jenis bahan</option>
        <option value="bahan-mentah">Bahan Mentah</option>
        <option value="bahan-setengah-jadi">Bahan Setengah Jadi</option>
        <option value="bahan-jadi">Bahan Jadi</option>
        <option value="bahan-kimia">Bahan Kimia</option>
        <option value="bahan-organik">Bahan Organik</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
  import { useCommodities } from "~/queries/useCommodities";
  import BaseInput from "@/components/base/BaseInput.vue";
  interface FormData {
    logo: File | null;
    companyName: string;
    partnerLevel: string;
    whatsappNumber: string;
    websiteUrl: string;
    interests: string[];
    focusArea: string;
    expertise: string;
    collaborationType: string[];
    availability: string;
    additionalInfo: string;
    commodities: (string | number)[];
    productionEstimate: string;
    productionUnit: string;
    materialType: string;
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

    return (data.value.data as Array<Record<string, unknown>>).map(
      (commodity) => ({
        label: String(
          (commodity as any).name ?? (commodity as any).label ?? "-"
        ),
        value: (commodity as any).id as string | number,
      })
    );
  });

  function updateValue(key: keyof FormData, value: any) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
  }
</script>
