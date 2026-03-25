<template>
  <div
    class="bg-white rounded-2xl border border-[#e7efea] shadow-lg w-[560px] lg:w-[768px] max-h-[90vh] overflow-hidden"
  >
    <div class="flex flex-col gap-0 overflow-y-auto max-h-[90vh]">
      <!-- Header -->
      <div
        class="flex items-center justify-between bg-gray-50 border-b border-[#e7efea] px-6 py-4 shrink-0"
      >
        <div class="flex flex-col gap-0.5">
          <h2 class="font-bold text-lg text-gray-900 tracking-tight">
            Tambah Mitra Baru
          </h2>
          <p class="text-gray-500 text-xs">
            Langkah {{ currentStep }} dari {{ steps.length }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          @click="$emit('cancel')"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Step Progress -->
      <div class="px-6 pt-4 pb-2 shrink-0">
        <div class="flex items-center w-full">
          <template v-for="(step, index) in steps" :key="step.id">
            <div class="flex flex-col items-center gap-1">
              <div
                class="flex items-center justify-center w-8 h-8 rounded-full z-10 transition-colors"
                :class="
                  currentStep >= step.id ? 'bg-[#035925]' : 'bg-[#e7efea]'
                "
              >
                <span
                  class="text-xs font-medium"
                  :class="
                    currentStep >= step.id ? 'text-white' : 'text-gray-500'
                  "
                >
                  {{ step.id }}
                </span>
              </div>
              <span
                class="text-[10px] whitespace-nowrap"
                :class="
                  currentStep >= step.id
                    ? 'text-[#035925] font-semibold'
                    : 'text-gray-400'
                "
              >
                {{ step.label }}
              </span>
            </div>
            <div
              v-if="index < steps.length - 1"
              class="flex-1 h-[3px] mx-2 mb-4 rounded-full transition-colors duration-300"
              :class="currentStep > step.id ? 'bg-[#035925]' : 'bg-[#e7efea]'"
            />
          </template>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="mx-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
      >
        {{ errorMessage }}
      </div>

      <!-- Step Content -->
      <div class="px-6 py-4">
        <!-- Step 1: Akun -->
        <MitraAccountForm v-if="currentStep === 1" v-model="accountForm" />

        <!-- Step 2: Identitas -->
        <MitraIdentityForm
          v-else-if="currentStep === 2"
          v-model="profileForm"
          v-model:logo-preview="logoPreview"
        />

        <!-- Step 3: Minat -->
        <MitraInterestsForm
          v-else-if="currentStep === 3"
          v-model="profileForm"
        />

        <!-- Step 4: Kolaborasi -->
        <MitraCollaborationForm
          v-else-if="currentStep === 4"
          v-model="profileForm"
        />
      </div>

      <!-- Footer Navigation -->
      <div
        class="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb] shrink-0"
      >
        <BaseButton
          variant="secondary"
          class="h-9 px-4 rounded-2xl text-sm border border-[#e7efea] text-[#1e1e1e] flex items-center gap-2"
          :disabled="currentStep === 1"
          @click="handleBack"
        >
          <ChevronLeft class="h-4 w-4" />
          Kembali
        </BaseButton>

        <BaseButton
          class="h-9 px-4 rounded-2xl text-sm bg-[#035925] hover:bg-[#024c20] text-white flex items-center gap-2"
          :disabled="!canProceed || isPending"
          @click="handleNext"
        >
          <span>{{
            currentStep === steps.length
              ? isPending
                ? "Menyimpan..."
                : "Selesai"
              : "Lanjutkan"
          }}</span>
          <component
            :is="currentStep === steps.length ? Check : ChevronRight"
            class="h-4 w-4"
          />
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-vue-next";
import BaseButton from "~/components/base/BaseButton.vue";
import MitraAccountForm from "~/components/features/cms/mitra/MitraAccountForm.vue";
import MitraIdentityForm from "~/components/features/cms/mitra/MitraIdentityForm.vue";
import MitraInterestsForm from "~/components/features/cms/mitra/MitraInterestsForm.vue";
import MitraCollaborationForm from "~/components/features/cms/mitra/MitraCollaborationForm.vue";
import type {
  ProfileFormData,
  AccountFormData,
} from "~/components/features/cms/mitra/types";

const emit = defineEmits<{
  cancel: [];
  submit: [];
}>();

const steps = [
  { id: 1, label: "Akun" },
  { id: 2, label: "Identitas" },
  { id: 3, label: "Minat" },
  { id: 4, label: "Kolaborasi" },
];

const currentStep = ref(1);
const errorMessage = ref("");
const logoPreview = ref<string | null>(null);

const accountForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
});

const profileForm = ref<ProfileFormData>({
  thumbnail: null,
  picName: "",
  picEmail: "",
  picWhatsapp: "",
  companyName: "",
  partnerLevel: "",
  whatsappNumber: "",
  websiteUrl: "",
  commodities: [],
  collaborationType: [],
  additionalInfo: "",
});

const { $apiClient } = useNuxtApp();

const isLoading = ref(false);
const isPending = computed(() => isLoading.value);

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return (
      !!accountForm.value.username &&
      accountForm.value.password.length >= 8 &&
      accountForm.value.password === accountForm.value.confirmPassword
    );
  }
  if (currentStep.value === 2) {
    return !!profileForm.value.picName && !!profileForm.value.companyName;
  }
  if (currentStep.value === 3) {
    return profileForm.value.commodities.length > 0;
  }
  return true;
});

const handleBack = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const handleNext = async () => {
  errorMessage.value = "";
  if (currentStep.value === steps.length) {
    await handleSubmit();
  } else {
    currentStep.value++;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const commodityIds: number[] = profileForm.value.commodities
      .map((c) => (typeof c === "string" ? parseInt(c, 10) : c))
      .filter((c): c is number => !isNaN(c));

    const collaborationIds: number[] = profileForm.value.collaborationType
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    const { error } = await $apiClient.POST("/users", {
      body: {
        name: profileForm.value.picName || accountForm.value.username,
        username: accountForm.value.username,
        email: profileForm.value.picEmail,
        password: accountForm.value.password,
        phone: profileForm.value.whatsappNumber || null,
        thumbnail: profileForm.value.thumbnail || null,
        role: "PARTNER",
        details: {
          institution_name: profileForm.value.companyName || null,
          stakeholder_type: profileForm.value.partnerLevel || null,
          contact_phone: profileForm.value.whatsappNumber || null,
          website: profileForm.value.websiteUrl || null,
          collaboration_commodities:
            commodityIds.length > 0
              ? commodityIds.map((id) => ({ [String(id)]: null }))
              : null,
          product_service_description: profileForm.value.additionalInfo || null,
          collaboration_ids:
            collaborationIds.length > 0 ? collaborationIds : null,
        },
      },
    });

    if (error)
      throw new Error((error as any)?.message || "Gagal membuat mitra");

    emit("submit");
  } catch (error: any) {
    errorMessage.value =
      error.message || "Gagal membuat mitra. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};
</script>
