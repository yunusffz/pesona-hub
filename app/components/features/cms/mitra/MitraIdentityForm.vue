<template>
  <div class="flex flex-col items-start gap-4">
    <h1 class="font-semibold text-gray-900 text-lg">
      Data Organisasi & Kontak
    </h1>

    <div>
      <div class="text-sm font-medium text-[#1E1E1E]">
        Logo Organisasi (Opsional)
      </div>
      <div
        class="flex flex-col items-center justify-center text-center gap-2 w-[150px]"
      >
        <ImageUploader
          v-model="logoPreview"
          additional-icon="lucide:building-2"
          @uploaded="handleImageUploaded"
        />
        <p class="text-xs text-[#6B7280] text-center">
          Upload logo perusahaan <br />
          <span class="text-[11px] text-center"
            >Klik atau drag & drop gambar</span
          >
        </p>
      </div>

      <div class="w-full flex flex-col gap-4">
        <!-- Nama Lembaga -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]">
            Nama Lembaga / Perusahaan <span class="text-red-500">*</span>
          </label>
          <BaseInput
            :model-value="modelValue.companyName"
            type="text"
            placeholder="Masukkan nama lembaga"
            class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full"
            @update:model-value="updateValue('companyName', $event)"
          />
        </div>

        <!-- Jenis Mitra & WhatsApp -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]">
              Jenis Mitra <span class="text-red-500">*</span>
            </label>
            <BaseSelect
              :model-value="modelValue.partnerLevel"
              :options="[
                { label: 'Perusahaan', value: 'perusahaan' },
                { label: 'Koperasi', value: 'koperasi' },
                { label: 'Individu', value: 'individu' },
                { label: 'Pemerintah', value: 'pemerintah' },
                { label: 'LSM', value: 'lsm' },
              ]"
              placeholder="Pilih jenis mitra"
              icon-type="chevron-down"
              background-color="bg-[#f8faf8]"
              class="rounded-2xl border-transparent h-9 w-full"
              @update:model-value="updateValue('partnerLevel', $event)"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]">
              Nomor WhatsApp <span class="text-red-500">*</span>
            </label>
            <BaseInput
              :model-value="modelValue.whatsappNumber"
              type="tel"
              placeholder="08xxxxxxxxxx"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full"
              @update:model-value="updateValue('whatsappNumber', $event)"
            />
          </div>
        </div>

        <!-- Website -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]">
            Website / Sosial Media (opsional)
          </label>
          <BaseInput
            :model-value="modelValue.websiteUrl"
            type="url"
            placeholder="https://..."
            class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full"
            @update:model-value="updateValue('websiteUrl', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import ImageUploader from "~/components/base/ImageUploader.vue";

interface FormData {
  thumbnail: string | null;
  companyName: string;
  partnerLevel: string;
  whatsappNumber: string;
  websiteUrl: string;
  commodities: (string | number)[];
  collaborationType: string[];
  additionalInfo: string;
}

interface Props {
  modelValue: FormData;
  logoPreview?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: FormData];
  "update:logoPreview": [value: string | null];
}>();

const logoPreview = ref<string | null>(props.logoPreview || null);

watch(
  () => props.logoPreview,
  (val) => {
    logoPreview.value = val || null;
  }
);

watch(logoPreview, (val) => {
  emit("update:logoPreview", val);
});

function updateValue(key: keyof FormData, value: any) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

function handleImageUploaded(objectName: string) {
  emit("update:modelValue", { ...props.modelValue, thumbnail: objectName });
}
</script>
