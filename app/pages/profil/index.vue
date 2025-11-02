<template>
  <!-- Loading Overlay -->
  <div
    v-if="isSubmitting.value"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#035925]"
      ></div>
      <p class="text-sm font-medium text-gray-700">Menyimpan data profil...</p>
    </div>
  </div>

  <div class="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
    <div
      class="content-stretch flex flex-col gap-[28px] items-start relative w-full max-w-[666px]"
    >
      <div
        class="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full"
      >
        <div
          class="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full"
        >
          <div class="h-[21px] relative shrink-0">
            <p
              class="absolute font-semibold leading-[21px] left-0 text-[16px] text-neutral-950 text-nowrap top-0 tracking-[-0.1504px] whitespace-pre"
            >
              Lengkapi Data Profil Mitra
            </p>
          </div>
          <div class="h-[17.5px] relative shrink-0">
            <p
              class="absolute font-normal leading-[17.5px] left-0 text-[#717182] text-[12.25px] top-[0.5px] tracking-[-0.0179px] whitespace-pre"
            >
              Step {{ currentStep }} of 3
            </p>
          </div>
        </div>

        <!-- Subtitle -->
        <p class="font-normal leading-[17.5px] text-gray-500 text-[12.25px]">
          Isi data berikut untuk melengkapi profil dan mulai berkolaborasi
        </p>

        <!-- Step Progress -->
        <div class="flex items-center justify-between w-full relative">
          <div class="flex items-center w-full">
            <template v-for="(step, index) in steps" :key="step.id">
              <!-- Step Circle -->
              <div class="flex flex-col items-center gap-1 relative">
                <div
                  class="flex items-center justify-center w-[35px] h-[35px] rounded-full z-10"
                  :class="
                    currentStep >= step.id ? 'bg-[#035925]' : 'bg-[#e7efea]'
                  "
                >
                  <p
                    class="text-[14px] font-normal"
                    :class="
                      currentStep >= step.id ? 'text-white' : 'text-gray-500'
                    "
                  >
                    {{ step.id }}
                  </p>
                </div>
                <p
                  class="text-[10.5px]"
                  :class="
                    currentStep >= step.id
                      ? 'text-[#035925] font-semibold'
                      : 'text-[#717182]'
                  "
                >
                  {{ step.label }}
                </p>
              </div>

              <!-- Connector (garis penghubung antar step) -->
              <div
                v-if="index < steps.length - 1"
                class="flex-1 h-[3.5px] mx-2 rounded-full transition-colors duration-300"
                :class="currentStep > step.id ? 'bg-[#035925]' : 'bg-[#e7efea]'"
              ></div>
            </template>
          </div>
        </div>
      </div>

      <!-- Card -->
      <div
        class="bg-[#f8faf8] relative rounded-[10.5px] w-full p-[24px] border border-[#d9d9d9]"
      >
        <!-- STEP 1 -->
        <Step1Identity
          v-if="currentStep === 1"
          v-model="formData"
          v-model:logo-preview="logoPreview"
        />

        <!-- STEP 2 -->
        <Step2Interests v-else-if="currentStep === 2" v-model="formData" />

        <!-- STEP 3 -->
        <Step3Collaboration v-else-if="currentStep === 3" v-model="formData" />

        <!-- STEP SUCCESS -->
        <StepSuccess v-else-if="currentStep === 4" />

        <!-- Navigation -->
        <div
          class="flex justify-between items-center pt-6 border-t border-[#d9d9d9] mt-6"
          v-if="currentStep !== 4"
        >
          <button
            @click="handleBack"
            :disabled="currentStep === 1 || isSubmitting.value"
            class="flex items-center gap-2 px-3 py-2 rounded-full border border-[#d9d9d9] bg-[#f8faf8] hover:bg-gray-100 disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft class="w-4 h-4 text-[#1a1a1a]" />
            <span class="text-sm font-medium">Kembali</span>
          </button>

          <button
            @click="currentStep === 3 ? handleSubmit() : handleNext()"
            :disabled="isSubmitting.value"
            class="flex items-center gap-2 px-3 py-2 rounded-full bg-[#174c36] hover:bg-[#035925] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="text-sm font-medium">
              {{ currentStep === 3 ? "Selesai" : "Lanjutkan" }}
            </span>
            <component
              :is="currentStep === 3 ? Check : ChevronRight"
              class="w-4 h-4 text-white"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { ChevronLeft, ChevronRight, Check } from "lucide-vue-next";
  import Step1Identity from "@/components/features/profile/Step1Identity.vue";
  import Step2Interests from "@/components/features/profile/Step2Interests.vue";
  import Step3Collaboration from "@/components/features/profile/Step3Collaboration.vue";
  import StepSuccess from "@/components/features/profile/StepSuccess.vue";
  import { useUser } from "~/composables/useUser";
  import { useAuth } from "~/composables/useAuth";
  import type { components } from "~/types/pesona-hub-api";

  type UserDetail = components["schemas"]["UserDetail"];

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
    targetKupsClass?: string;
  }

  const { user } = useAuth();
  const { updateProfile, isUpdating, updateError } = useUser();

  const currentStep = ref(1);
  const logoPreview = ref<string | null>(null);
  const isSubmitting = computed(() => isUpdating.value);

  const formData = ref<FormData>({
    logo: null,
    companyName: "",
    partnerLevel: "",
    whatsappNumber: "",
    websiteUrl: "",
    interests: [],
    focusArea: "",
    expertise: "",
    collaborationType: [],
    availability: "",
    additionalInfo: "",
    commodities: [],
    productionEstimate: "",
    productionUnit: "kg",
    materialType: "",
    targetKupsClass: "",
  });

  // Load existing user data on mount
  onMounted(() => {
    if (user.value) {
      // Map existing user data to form
      if (user.value.details) {
        formData.value.companyName = user.value.details.institution_name || "";
        formData.value.whatsappNumber = user.value.details.contact_phone || "";
        formData.value.websiteUrl = user.value.details.website || "";
        formData.value.additionalInfo =
          user.value.details.product_service_description || "";

        // Map commodities if available
        if (user.value.details.collaboration_commodity_ids) {
          formData.value.commodities =
            user.value.details.collaboration_commodity_ids;
        }

        // Map collaborations if available
        if (user.value.details.collaboration_ids) {
          formData.value.collaborationType =
            user.value.details.collaboration_ids.map(String);
        }
      }

      // Map basic user data
      if (user.value.phone) {
        formData.value.whatsappNumber = user.value.phone;
      }

      if (user.value.thumbnail) {
        logoPreview.value = user.value.thumbnail;
      }
    }
  });

  const steps = [
    { id: 1, label: "Identitas" },
    { id: 2, label: "Minat" },
    { id: 3, label: "Kolaborasi" },
  ];

  function handleNext() {
    if (currentStep.value < 3) currentStep.value++;
  }

  function handleBack() {
    if (currentStep.value > 1) currentStep.value--;
  }

  async function handleSubmit() {
    console.log(user);
    if (!user.value?.username) {
      alert("User tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      // Map form data to UserDetail structure
      const userDetail: UserDetail = {
        institution_name: formData.value.companyName || undefined,
        contact_phone: formData.value.whatsappNumber || undefined,
        website: formData.value.websiteUrl || undefined,
        product_service_description: formData.value.additionalInfo || undefined,
        collaboration_commodity_ids:
          formData.value.commodities.length > 0
            ? formData.value.commodities.filter(
                (c): c is number => typeof c === "number"
              ).length > 0
              ? formData.value.commodities.filter(
                  (c): c is number => typeof c === "number"
                )
              : undefined
            : undefined,
        collaboration_ids:
          formData.value.collaborationType.length > 0
            ? formData.value.collaborationType
                .map((id) => {
                  const numId = typeof id === "string" ? parseInt(id, 10) : id;
                  return isNaN(numId) ? undefined : numId;
                })
                .filter((id): id is number => id !== undefined)
            : undefined,
      };

      // Remove undefined fields
      Object.keys(userDetail).forEach((key) => {
        if (userDetail[key as keyof UserDetail] === undefined) {
          delete userDetail[key as keyof UserDetail];
        }
      });

      await updateProfile(user.value.username, {
        name: formData.value.companyName || undefined,
        phone: formData.value.whatsappNumber || undefined,
        logoFile: formData.value.logo,
        details: Object.keys(userDetail).length > 0 ? userDetail : undefined,
      });

      // Navigate to success page
      await navigateTo("/profil/sukses");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan profil";
      alert(`Error: ${errorMessage}`);
      console.error("Error updating profile:", error);
    }
  }
</script>
