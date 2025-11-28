<template>
  <div class="flex flex-col gap-4">
    <div>
      <label class="text-sm text-neutral-900"
        >Jenis Komoditas dan Kebutuhan Produksi</label
      >
      <p class="text-xs text-[#6B7280]">
        Pilih komoditas dan estimasi kebutuhan Anda.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900">Jenis Bahan</label>
      <BaseSelect
        :model-value="modelValue.materialType"
        @update:model-value="updateValue('materialType', $event)"
        :options="materialTypes"
        placeholder="Pilih jenis bahan"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900"
        >Jenis Komoditas</label
      >
      <p class="text-xs text-[#6B7280]">
        Cari dan pilih komoditas yang Anda butuhkan. Anda dapat memilih lebih
        dari satu.
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

    <div
      class="flex flex-col gap-4"
      v-if="setting_feature.profile.showEstimation"
    >
      <div class="flex items-center gap-2">
        <Package class="w-5 h-5 text-[#174C36]" />
        <div class="font-medium">Estimasi Kebutuhan per Komoditas *</div>
      </div>
      <div
        class="flex flex-col gap-4 border border-[#174C3633] rounded-xl p-4"
        style="
          background: linear-gradient(
            135deg,
            rgba(23, 76, 54, 0.05) 0%,
            rgba(23, 76, 54, 0.1) 100%
          );
        "
      >
        <div class="font-medium text-[#174C36]">Kemenyan</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">Jumlah</label>
            <BaseInput
              type="text"
              :model-value="modelValue.productionEstimate"
              @update:model-value="updateValue('productionEstimate', $event)"
              placeholder="0"
              class="!h-9 !px-3 !rounded-lg !bg-white !border-[#d9d9d9]"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">Satuan</label>
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
              <option value="">Pilih satuan</option>
              <option
                v-for="unit in productionUnits"
                :key="unit.value"
                :value="unit.value"
              >
                {{ unit.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-[#F7FFF7] p-4 border border-[#174C3633] rounded-xl">
        💡<span class="text-sm font-semibold">Tips:</span>
        <p class="text-sm">
          Satuan yang tersedia disesuaikan dengan jenis komoditas. Anda dapat
          memilih maksimal <span class="font-bold">5 komoditas</span>. Estimasi
          kebutuhan ini akan membantu KUPS memahami skala kerjasama yang Anda
          inginkan.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
  import { useCommodities } from "~/queries/useCommodities";
  import BaseInput from "~/components/base/BaseInput.vue";
  import BaseSelect from "~/components/base/BaseSelect.vue";
  import { PRODUCTION_UNITS } from "~/consts/units";
  import { Package } from "lucide-vue-next";
  import setting_feature from "~/utils/setting-feature";

  interface FormData {
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

  const { data } = useCommodities({
    limit: 200,
  });

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

  const productionUnits = computed(() => PRODUCTION_UNITS);

  const materialTypes = [
    { label: "Bahan Mentah", value: "bahan-mentah" },
    { label: "Bahan Setengah Jadi", value: "bahan-setengah-jadi" },
    { label: "Bahan Jadi", value: "bahan-jadi" },
    { label: "Bahan Kimia", value: "bahan-kimia" },
    { label: "Bahan Organik", value: "bahan-organik" },
  ];

  function updateValue(key: keyof FormData, value: any) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
  }
</script>
