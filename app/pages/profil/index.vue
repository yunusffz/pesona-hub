<template>
  <!-- Loading User Data Overlay -->
  <div
    v-if="isLoadingUserData"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#035925]"
      ></div>
      <p class="text-sm font-medium text-gray-700">Memuat data profil...</p>
    </div>
  </div>

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
  import { useApi } from "~/composables/useApi";
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

  const { user: authUser } = useAuth();
  const { updateProfile, isUpdating, updateError } = useUser();
  const client = useApi();

  const currentStep = ref(1);
  const logoPreview = ref<string | null>(null);
  const isSubmitting = computed(() => isUpdating.value);
  const isLoadingUserData = ref(false);
  const user = ref<any>(null);

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

  // Fetch fresh user data with details populated on mount
  onMounted(async () => {
    if (!authUser.value?.username) {
      await navigateTo("/login");
      return;
    }

    try {
      isLoadingUserData.value = true;

      // Fetch user data with details populated
      const { data, error } = await client.GET("/me", {
        params: {
          query: {
            "populate[0]": "details",
          },
        },
      });

      if (error) {
        console.error("Failed to fetch user data:", error);
        return;
      }

      // Extract user data from response
      if (data && typeof data === "object" && "data" in data) {
        user.value = (data as any).data;
      } else {
        user.value = data;
      }

      // Map existing user data to form
      if (user.value?.details) {
        formData.value.companyName = user.value.details.institution_name || "";
        formData.value.partnerLevel = user.value.details.stakeholder_type || "";
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
      if (user.value?.phone && !formData.value.whatsappNumber) {
        formData.value.whatsappNumber = user.value.phone;
      }

      if (user.value?.thumbnail) {
        logoPreview.value = user.value.thumbnail;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      isLoadingUserData.value = false;
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
    if (!user.value?.username) {
      alert("User tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      // Convert commodities to numbers array
      const commodityIds: number[] = formData.value.commodities
        .map((c) => {
          if (typeof c === "number") return c;
          const numId = typeof c === "string" ? parseInt(c, 10) : null;
          return isNaN(numId as any) ? null : numId;
        })
        .filter((c): c is number => c !== null);

      // Convert collaboration types to numbers array
      const collaborationIds: number[] = formData.value.collaborationType
        .map((id) => {
          const numId = typeof id === "string" ? parseInt(id, 10) : id;
          return isNaN(numId as any) ? null : numId;
        })
        .filter((id): id is number => id !== null);

      // Prepare user update payload - top level fields from Step1Identity
      const userUpdatePayload: {
        name?: string;
        phone?: string;
        thumbnail?: string;
        details: UserDetail;
      } = {
        // Step 1 - Identity mappings
        name: formData.value.companyName || undefined, // Nama Lembaga/Perusahaan -> name
        phone: formData.value.whatsappNumber || undefined, // Nomor WhatsApp -> phone
        thumbnail:
          logoPreview.value && logoPreview.value.startsWith("http")
            ? logoPreview.value
            : undefined, // Logo -> thumbnail

        // Map form data to UserDetail structure
        details: {
          // Step 1 - Identity mappings to details
          institution_name: formData.value.companyName || null, // Nama Lembaga/Perusahaan
          stakeholder_type: formData.value.partnerLevel || null, // Jenis Mitra
          contact_phone: formData.value.whatsappNumber || null, // Nomor WhatsApp
          website: formData.value.websiteUrl || null, // Website/Sosial Media

          // Step 2 - Interests mappings
          collaboration_commodity_ids:
            commodityIds.length > 0 ? commodityIds : null, // Jenis Komoditas

          // Step 3 - Collaboration mappings
          product_service_description: formData.value.additionalInfo || null, // Additional info
          collaboration_ids:
            collaborationIds.length > 0 ? collaborationIds : null, // Collaboration types

          // Fields without form inputs - preserve existing or set to null
          legal_entity_type: user.value?.details?.legal_entity_type || null,
          legal_number: user.value?.details?.legal_number || null,
          office_address: user.value?.details?.office_address || null,
          province: user.value?.details?.province || null,
          regency: user.value?.details?.regency || null,
          contact_name: user.value?.details?.contact_name || null,
          contact_position: user.value?.details?.contact_position || null,
          contact_email: user.value?.details?.contact_email || null,
          operation_scale: user.value?.details?.operation_scale || null,
          main_sector: user.value?.details?.main_sector || null,
          certifications: user.value?.details?.certifications || null,
          collaboration_impact_ids:
            user.value?.details?.collaboration_impact_ids || null,
          collaboration_location_ids:
            user.value?.details?.collaboration_location_ids || null,
        },
      };

      // Handle logo upload if new file is provided
      if (formData.value.logo && formData.value.logo instanceof File) {
        // TODO: Upload logo file and get URL
        // For now, we skip this as we don't have the upload endpoint
        console.log("Logo file to upload:", formData.value.logo);
      }

      await updateProfile(user.value.username, userUpdatePayload);

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
