<template>
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
        <template v-if="currentStep === 1">
          <div class="flex flex-col items-start gap-4">
            <div
              class="flex flex-col items-center justify-center text-center gap-2 w-[150px]"
            >
              <ImageUploader
                v-model="logoPreview"
                additionalIcon="lucide:building-2"
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
                <label class="text-sm font-medium"
                  >Nama Lembaga / Perusahaan</label
                >
                <input
                  v-model="formData.companyName"
                  type="text"
                  placeholder="Masukkan nama lembaga"
                  class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm"
                />
              </div>

              <!-- Level Mitra dan WhatsApp -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-sm font-medium">Level Mitra</label>
                  <select
                    v-model="formData.partnerLevel"
                    class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm"
                  >
                    <option value="">Pilih level mitra</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label class="text-sm font-medium">Nomor WhatsApp</label>
                  <input
                    v-model="formData.whatsappNumber"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm"
                  />
                </div>
              </div>

              <!-- Website -->
              <div>
                <label class="text-sm font-medium"
                  >Website / Sosial Media (opsional)</label
                >
                <input
                  v-model="formData.websiteUrl"
                  type="url"
                  placeholder="https://..."
                  class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- STEP 2 -->
        <template v-else-if="currentStep === 2">
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-sm font-medium"
                >Area Minat (pilih semua yang sesuai)</label
              >
              <div class="grid grid-cols-2 gap-2 mt-2">
                <label
                  v-for="interest in interests"
                  :key="interest"
                  class="flex items-center gap-2 border border-[#d9d9d9] rounded-[8.5px] p-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="interest"
                    v-model="formData.interests"
                    class="accent-[#035925]"
                  />
                  <span class="text-sm">{{ interest }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium">Area Fokus Utama</label>
              <input
                v-model="formData.focusArea"
                type="text"
                placeholder="Masukkan area fokus utama"
                class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm"
              />
            </div>

            <div>
              <label class="text-sm font-medium">Keahlian / Expertise</label>
              <textarea
                v-model="formData.expertise"
                rows="4"
                placeholder="Deskripsikan keahlian dan pengalaman organisasi Anda"
                class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </template>

        <!-- STEP 3 -->
        <template v-else-if="currentStep === 3">
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-sm font-medium"
                >Tipe Kolaborasi yang Diminati</label
              >
              <div class="grid grid-cols-2 gap-2 mt-2">
                <label
                  v-for="type in collaborationTypes"
                  :key="type"
                  class="flex items-center gap-2 border border-[#d9d9d9] rounded-[8.5px] p-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="type"
                    v-model="formData.collaborationType"
                    class="accent-[#035925]"
                  />
                  <span class="text-sm">{{ type }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium">Ketersediaan Waktu</label>
              <select
                v-model="formData.availability"
                class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm"
              >
                <option value="">Pilih ketersediaan waktu</option>
                <option value="segera">Segera</option>
                <option value="1-3-bulan">1-3 Bulan</option>
                <option value="3-6-bulan">3-6 Bulan</option>
                <option value="lebih-6-bulan">Lebih dari 6 Bulan</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium"
                >Informasi Tambahan (opsional)</label
              >
              <textarea
                v-model="formData.additionalInfo"
                rows="4"
                placeholder="Tambahkan informasi lain yang relevan untuk kolaborasi"
                class="border border-[#d9d9d9] rounded-[8.5px] px-3 py-2 w-full text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </template>

        <!-- Navigation -->
        <div
          class="flex justify-between items-center pt-6 border-t border-[#d9d9d9] mt-6"
        >
          <button
            @click="handleBack"
            :disabled="currentStep === 1"
            class="flex items-center gap-2 px-3 py-2 rounded-full border border-[#d9d9d9] bg-[#f8faf8] hover:bg-gray-100 disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft class="w-4 h-4 text-[#1a1a1a]" />
            <span class="text-sm font-medium">Kembali</span>
          </button>

          <button
            @click="currentStep === 3 ? handleSubmit() : handleNext()"
            class="flex items-center gap-2 px-3 py-2 rounded-full bg-[#174c36] hover:bg-[#035925] text-white"
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
  import { ref } from "vue";
  import { ChevronLeft, ChevronRight, Upload, Check } from "lucide-vue-next";
  import ImageUploader from "@/components/base/ImageUploader.vue";

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
  }

  const currentStep = ref(1);
  const logoPreview = ref<string | null>(null);

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
  });

  const steps = [
    { id: 1, label: "Identitas" },
    { id: 2, label: "Minat" },
    { id: 3, label: "Kolaborasi" },
  ];

  const interests = [
    "Pendidikan",
    "Kesehatan",
    "Teknologi",
    "Lingkungan",
    "Sosial",
    "Ekonomi",
  ];
  const collaborationTypes = [
    "Proyek Jangka Pendek",
    "Proyek Jangka Panjang",
    "Konsultasi",
    "Pelatihan",
    "Sponsorship",
    "Kemitraan Strategis",
  ];

  function handleLogoUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      formData.value.logo = file;
      const reader = new FileReader();
      reader.onloadend = () => (logoPreview.value = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleNext() {
    if (currentStep.value < 3) currentStep.value++;
  }

  function handleBack() {
    if (currentStep.value > 1) currentStep.value--;
  }

  function handleSubmit() {
    console.log("Form submitted:", formData.value);
    alert("Profil mitra berhasil dilengkapi!");
  }
</script>
