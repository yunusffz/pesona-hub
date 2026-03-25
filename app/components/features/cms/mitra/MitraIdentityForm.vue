<template>
  <div class="flex flex-col items-start gap-4">
    <h1 class="font-semibold text-gray-900 text-lg">
      Data Organisasi & Kontak
    </h1>

    <div class="flex gap-4 w-full">
      <!-- Left: Logo + Org contact -->
      <div class="shrink-0 flex flex-col gap-4 w-[225px]">
        <div>
          <div class="text-sm font-medium text-[#1E1E1E] mb-1">
            Logo Organisasi (Opsional)
          </div>
          <ImageUploader
            v-model="logoPreview"
            @uploaded="handleImageUploaded"
            label="Klik atau drag & drop"
            :accept="['PNG', 'JPG', 'SVG']"
            :max-size-mb="2"
            width="225px"
            height="192px"
            border-class="border-dashed"
            class="mb-1"
          />
          <div class="font-normal text-xs text-[#6A7282]">
            Logo akan ditampilkan di profil mitra
          </div>
        </div>

        <!-- Whatsapp Organisasi & Website -->
      </div>

      <!-- Right: PIC + Org name -->
      <div class="flex flex-col gap-4 flex-1 min-w-0">
        <!-- Nama Lengkap PIC -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]">
            Nama Lengkap PIC <span class="text-red-500">*</span>
          </label>
          <BaseInput
            :model-value="modelValue.picName"
            type="text"
            placeholder="Masukkan nama lengkap PIC"
            class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full placeholder:text-[#717182] placeholder:font-normal"
            @update:model-value="updateValue('picName', $event)"
          />
        </div>

        <!-- Email PIC & Whatsapp PIC -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]">
              Email PIC
            </label>
            <BaseInput
              :model-value="modelValue.picEmail"
              type="email"
              placeholder="email@contoh.com"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full placeholder:text-[#717182] placeholder:font-normal"
              @update:model-value="updateValue('picEmail', $event)"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]">
              WhatsApp PIC
            </label>
            <BaseInput
              :model-value="modelValue.picWhatsapp"
              type="tel"
              placeholder="08xxxxxxxxxx"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full placeholder:text-[#717182] placeholder:font-normal"
              @update:model-value="updateValue('picWhatsapp', $event)"
            />
          </div>
        </div>

        <!-- Nama Organisasi / Perusahaan -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]">
            Nama Organisasi / Perusahaan <span class="text-red-500">*</span>
          </label>
          <BaseInput
            :model-value="modelValue.companyName"
            type="text"
            placeholder="Masukkan nama organisasi / perusahaan"
            class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full placeholder:text-[#717182] placeholder:font-normal"
            @update:model-value="updateValue('companyName', $event)"
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 w-full">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]">
          WhatsApp Organisasi
        </label>
        <BaseInput
          :model-value="modelValue.whatsappNumber"
          type="tel"
          placeholder="08xxxxxxxxxx"
          class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full placeholder:text-[#717182] placeholder:font-normal"
          @update:model-value="updateValue('whatsappNumber', $event)"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]"> Website </label>
        <BaseInput
          :model-value="modelValue.websiteUrl"
          type="url"
          placeholder="https://..."
          class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm w-full placeholder:text-[#717182] placeholder:font-normal"
          @update:model-value="updateValue('websiteUrl', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseInput from "@/components/base/BaseInput.vue";
import ImageUploader from "~/components/base/ImageUploader.vue";
import type { ProfileFormData } from "./types";

interface Props {
  modelValue: ProfileFormData;
  logoPreview?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: ProfileFormData];
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

function updateValue(key: keyof ProfileFormData, value: any) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

function handleImageUploaded(objectName: string) {
  emit("update:modelValue", { ...props.modelValue, thumbnail: objectName });
}
</script>
