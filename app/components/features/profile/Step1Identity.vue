<template>
  <div class="flex flex-col items-start gap-4">
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
      <div>
        <label class="text-sm font-medium">Nama Lembaga / Perusahaan</label>
        <BaseInput
          :model-value="modelValue.companyName"
          @update:model-value="updateValue('companyName', $event)"
          type="text"
          placeholder="Masukkan nama lembaga"
          class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-[#035925]"
        />
      </div>

      <!-- Level Mitra dan WhatsApp -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium">Jenis Mitra</label>
          <select
            :value="modelValue.partnerLevel"
            @change="
              updateValue(
                'partnerLevel',
                ($event.target as HTMLSelectElement).value
              )
            "
            class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none"
          >
            <option value="">Pilih jenis mitra</option>
            <option value="perusahaan">Perusahaan</option>
            <option value="koperasi">Koperasi</option>
            <option value="individu">Individu</option>
            <option value="pemerintah">Pemerintah</option>
            <option value="lsm">LSM</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium">Nomor WhatsApp</label>
          <BaseInput
            :model-value="modelValue.whatsappNumber"
            @update:model-value="updateValue('whatsappNumber', $event)"
            type="tel"
            placeholder="08xxxxxxxxxx"
            class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <!-- Website -->
      <div>
        <label class="text-sm font-medium"
          >Website / Sosial Media (opsional)</label
        >
        <BaseInput
          :model-value="modelValue.websiteUrl"
          @update:model-value="updateValue('websiteUrl', $event)"
          type="url"
          placeholder="https://..."
          class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ImageUploader from "@/components/base/ImageUploader.vue";
  import { ref, watch } from "vue";
  import BaseInput from "@/components/base/BaseInput.vue";

  interface FormData {
    thumbnail: string | null;
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
    // Set the object_name to thumbnail field in form data
    emit("update:modelValue", { ...props.modelValue, thumbnail: objectName });
  }
</script>
