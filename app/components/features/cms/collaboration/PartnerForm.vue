<template>
  <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-bold text-[#101828]">
          {{ isEdit ? "Edit Partner" : "Tambah Partner" }}
        </h2>
        <p class="text-sm text-[#6A7282] mt-0.5">
          {{ isEdit ? "Perbarui data partner" : "Tambahkan partner baru ke landing page" }}
        </p>
      </div>
      <button
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        @click="emit('cancel')"
      >
        <X class="h-5 w-5 text-gray-400" />
      </button>
    </div>

    <!-- Form -->
    <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
      <!-- Logo Upload -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#344054]">Logo Partner</label>
        <div class="flex items-start gap-4">
          <!-- Preview -->
          <div
            class="relative w-24 h-24 rounded-xl border-2 border-dashed border-[#D0D5DD] bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#035925] transition-colors shrink-0"
            @click="triggerFileInput"
          >
            <img
              v-if="logoPreviewUrl"
              :src="logoPreviewUrl"
              alt="Logo preview"
              class="w-full h-full object-contain p-1"
            />
            <div v-else class="flex flex-col items-center gap-1 text-gray-400">
              <ImageIcon class="h-6 w-6" />
              <span class="text-xs">Upload</span>
            </div>
            <div
              v-if="logoUploading"
              class="absolute inset-0 flex items-center justify-center bg-white/70"
            >
              <Loader2 class="h-5 w-5 animate-spin text-[#035925]" />
            </div>
          </div>

          <div class="flex flex-col gap-1 flex-1">
            <button
              type="button"
              class="text-sm font-medium text-[#035925] hover:underline text-left"
              @click="triggerFileInput"
            >
              {{ logoPreviewUrl ? "Ganti Logo" : "Logo Partner*" }}
            </button>
            <p class="text-xs text-[#6A7282]">Format: PNG, JPG, SVG. Maksimal 2MB.<br />Rekomendasi: background transparan</p>
            <p v-if="logoError" class="text-xs text-red-500">{{ logoError }}</p>
          </div>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <!-- Partner Name -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#344054]">Nama Partner</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Contoh: WRI Indonesia"
          class="w-full h-10 px-3 rounded-lg border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition"
          required
        />
        <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-1">
        <button
          type="button"
          class="flex-1 h-10 rounded-full border border-[#D0D5DD] text-sm font-medium text-[#344054] hover:bg-gray-50 transition-colors"
          @click="emit('cancel')"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="submitting || logoUploading"
          class="flex-1 h-10 rounded-full bg-[#035925] text-sm font-medium text-white hover:bg-[#035925]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
          {{ isEdit ? "Simpan Perubahan" : "Tambah Partner" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { X, ImageIcon, Loader2 } from "lucide-vue-next";
import type { PartnerItem } from "~/queries/usePartners";

interface PartnerFormData {
  name: string;
  logo_object_name: string | null;
}

interface Props {
  partner?: PartnerItem | null;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  partner: null,
  submitting: false,
});

const emit = defineEmits<{
  cancel: [];
  submit: [data: PartnerFormData];
}>();

const config = useRuntimeConfig();
const { $apiClient } = useNuxtApp();

const isEdit = computed(() => !!props.partner);
const fileInputRef = ref<HTMLInputElement | null>(null);
const logoPreviewUrl = ref<string | null>(null);
const logoUploading = ref(false);
const logoError = ref<string | null>(null);

const form = reactive<PartnerFormData>({
  name: "",
  logo_object_name: null,
});

const errors = reactive({ name: "" });

const initForm = () => {
  if (props.partner) {
    form.name = props.partner.name;
    form.logo_object_name = props.partner.logo_object_name ?? null;
    logoPreviewUrl.value = form.logo_object_name
      ? `${config.public.pesonaApiUrl}/files/${form.logo_object_name}`
      : null;
  } else {
    form.name = "";
    form.logo_object_name = null;
    logoPreviewUrl.value = null;
  }
  errors.name = "";
  logoError.value = null;
};

watch(() => props.partner, initForm, { immediate: true });

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const maxSizeMb = 2;
  if (file.size > maxSizeMb * 1024 * 1024) {
    logoError.value = `File terlalu besar. Maksimal ${maxSizeMb}MB.`;
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    logoError.value = "Format tidak didukung. Gunakan PNG, JPG, atau SVG.";
    return;
  }

  logoError.value = null;
  logoUploading.value = true;

  const reader = new FileReader();
  reader.onloadend = () => {
    logoPreviewUrl.value = reader.result as string;
  };
  reader.readAsDataURL(file);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data, error } = await $apiClient.POST("/files", {
      body: formData as any,
    });

    if (error) {
      logoError.value = "Gagal mengupload logo. Coba lagi.";
      logoPreviewUrl.value = null;
      return;
    }

    const fileData = (data as any)?.data ?? data;
    const objectName = fileData?.object_name ?? null;

    if (objectName) {
      form.logo_object_name = objectName;
      logoPreviewUrl.value = `${config.public.pesonaApiUrl}/files/${objectName}`;
    } else {
      logoError.value = "Gagal mendapatkan file. Coba lagi.";
    }
  } finally {
    logoUploading.value = false;
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
};

const validate = (): boolean => {
  errors.name = "";
  if (!form.name.trim()) {
    errors.name = "Nama partner wajib diisi.";
    return false;
  }
  return true;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", { ...form });
};
</script>
