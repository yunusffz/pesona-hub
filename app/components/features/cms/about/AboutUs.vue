<template>
  <div class="flex flex-col gap-8">
    <!-- Page header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">Tentang Kami</h1>
        <p class="text-[#6A7282] text-sm">Kelola konten halaman Tentang Kami</p>
      </div>
      <BaseButton
        class="py-2 px-4 text-sm w-full sm:w-auto"
        :disabled="isSaving || isLoading"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        Simpan Perubahan
      </BaseButton>
    </div>

    <!-- Informasi Utama card -->
    <div class="bg-white rounded-xl border border-[#E4E4E7]">
      <div class="p-4 lg:p-6 border-b border-[#E4E4E7]">
        <span class="text-base font-semibold text-[#101828]"
          >Informasi Utama</span
        >
      </div>

      <div class="p-4 lg:p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Image upload -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#344054]"
              >Gambar Utama</label
            >
            <ImageUploader
              v-model="form.image_object_name"
              label="Klik untuk upload"
              :accept="['PNG', 'JPG']"
              :max-size-mb="5"
              width="100%"
              height="220px"
              border-class="border-dashed"
              @uploaded="(v) => (form.image_object_name = v)"
            />
            <p class="text-xs text-[#6A7282]">
              Rasio gambar: 16/9. Ukuran maksimal: 5MB
            </p>
            <p class="text-xs text-[#6A7282]">Rekomendasi: 1200 x 675px</p>
          </div>

          <!-- Title & Description -->
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-[#344054]">
                Judul <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Tentang Pesona Hub Digi"
                class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-[#344054]">
                Deskripsi <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.description"
                placeholder="Deskripsi lengkap tentang Pesona Hub Digi..."
                rows="6"
                class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition resize-none"
              />
              <p class="text-xs text-[#6A7282]">
                Jelaskan secara singkat tentang Pesona Hub Digi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Misi card -->
    <div class="bg-white rounded-xl border border-[#E4E4E7]">
      <div class="p-4 lg:p-6 border-b border-[#E4E4E7]">
        <span class="text-base font-semibold text-[#101828]">Misi</span>
      </div>

      <div class="p-4 lg:p-6 flex flex-col gap-5">
        <!-- Judul Section -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#344054]"
            >Judul Section</label
          >
          <input
            v-model="form.misi.section_title"
            type="text"
            placeholder="Mengapa Kami Hadir"
            class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition"
          />
        </div>

        <!-- Headline Utama -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#344054]">
            Headline Utama <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.misi.headline"
            placeholder="Contoh: Lebih dari sekadar platform — kami adalah mitra tumbuh yang berkelanjutan."
            rows="3"
            class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition resize-none"
          />
          <p class="text-xs text-[#6A7282]">
            Headline besar yang menarik perhatian
          </p>
        </div>

        <!-- Deskripsi Misi -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#344054]">
            Deskripsi Misi <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.misi.description"
            placeholder="Jelaskan secara singkat tentang misi organisasi..."
            rows="4"
            class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition resize-none"
          />
          <p class="text-xs text-[#6A7282]">
            Paragraf penjelasan di bawah headline
          </p>
        </div>

        <!-- Item Misi (Cards) -->
        <div class="flex flex-col gap-4 pt-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-[#344054]"
              >Item Misi (Cards)</span
            >
            <span class="text-xs text-[#6A7282]"
              >{{ form.misi.items.length }} / {{ MAX_ITEMS }} item</span
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(item, index) in form.misi.items"
              :key="item.id"
              class="rounded-xl border border-[#E4E4E7] bg-[#F9FAFB] p-4 flex flex-col gap-4"
            >
              <!-- Card header -->
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-semibold text-white bg-[#035925] rounded-full px-3 py-1"
                >
                  Item #{{ index + 1 }}
                </span>
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                  @click="removeItem(index)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

              <!-- Image -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[#344054]"
                  >Gambar Item (Opsional)</label
                >
                <ImageUploader
                  v-model="item.image_object_name"
                  label="Upload icon/gambar"
                  :accept="['PNG', 'JPG']"
                  :max-size-mb="2"
                  width="156px"
                  height="156px"
                  border-class="border-dashed"
                  label-class="text-xs"
                  @uploaded="(v) => (item.image_object_name = v)"
                />
                <p class="text-xs text-[#6A7282]">
                  Rasio gambar: 1/1. Ukuran maksimal: 2MB
                </p>
              </div>

              <!-- Judul Item -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[#344054]"
                  >Judul Item</label
                >
                <input
                  v-model="item.title"
                  type="text"
                  placeholder="Inovasi Efektif"
                  class="w-full rounded-lg border border-[#D1D5DC] bg-white px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition"
                />
              </div>

              <!-- Deskripsi -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[#344054]"
                  >Deskripsi</label
                >
                <textarea
                  v-model="item.description"
                  placeholder="Jelaskan tentang item misi ini..."
                  rows="3"
                  class="w-full rounded-lg border border-[#D1D5DC] bg-white px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition resize-none"
                />
              </div>
            </div>
          </div>

          <!-- Add item button -->
          <button
            v-if="form.misi.items.length < MAX_ITEMS"
            type="button"
            class="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-[#D1D5DC] py-3 text-sm font-medium text-[#6A7282] hover:border-[#035925] hover:text-[#035925] hover:bg-[#F0F8F3] transition"
            @click="addItem"
          >
            <Plus class="w-4 h-4" />
            Tambah Item Misi
          </button>
        </div>
      </div>
    </div>

    <!-- Visi (Timeline) card -->
    <div class="bg-white rounded-xl border border-[#E4E4E7]">
      <div class="p-4 lg:p-6 border-b border-[#E4E4E7] flex items-center justify-between">
        <span class="text-base font-semibold text-[#101828]">Visi (Timeline)</span>
        <BaseButton class="py-1.5 px-3 text-sm" @click="addVisiItem">
          <Plus class="w-4 h-4" />
          Tambah Visi
        </BaseButton>
      </div>

      <div class="p-4 lg:p-6 flex flex-col gap-4">
        <div
          v-for="(item, index) in form.visi"
          :key="item.id"
          class="rounded-xl border border-[#E4E4E7] p-4 flex flex-col gap-4"
        >
          <!-- Card header -->
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-white bg-[#035925] rounded-full px-3 py-1">
              Visi #{{ index + 1 }}
            </span>
            <button
              type="button"
              class="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
              @click="removeVisiItem(index)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Image -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-[#344054]">Gambar Ilustrasi</label>
              <ImageUploader
                v-model="item.image_object_name"
                label="Upload gambar"
                :accept="['PNG', 'JPG']"
                :max-size-mb="3"
                width="100%"
                height="160px"
                border-class="border-dashed"
                @uploaded="(v) => (item.image_object_name = v)"
              />
              <p class="text-xs text-[#6A7282]">
                Rekomendasi: 800 x 450px. Rasio gambar: 16/9. Ukuran maksimal: 3MB
              </p>
            </div>

            <!-- Year + Title + Description -->
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[#344054]">Judul Visi</label>
                <input
                  v-model="item.title"
                  type="text"
                  placeholder="Digitalisasi Perhutanan Sosial"
                  class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[#344054]">Tahun Target</label>
                <div class="relative">
                  <CalendarDays class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A7282]" />
                  <input
                    v-model.number="item.year"
                    type="number"
                    :min="2000"
                    :max="2100"
                    placeholder="2025"
                    class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] pl-9 pr-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[#344054]">Deskripsi Visi</label>
                <textarea
                  v-model="item.description"
                  placeholder="Tuliskan visi untuk tahun ini..."
                  rows="4"
                  class="w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <p v-if="form.visi.length === 0" class="text-sm text-[#9DA4AE] text-center py-6">
          Belum ada visi. Klik "Tambah Visi" untuk menambahkan.
        </p>
      </div>
    </div>

    <!-- Toast -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-4 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-4 opacity-0"
      >
        <div
          v-if="showToast"
          class="fixed top-5 right-5 z-[9999] flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg"
          :style="{
            backgroundColor: toastVariant === 'error' ? '#fef2f2' : '#e8f5ee',
          }"
        >
          <div
            class="h-5 w-5 shrink-0 rounded-full flex items-center justify-center"
            :style="{
              backgroundColor: toastVariant === 'error' ? '#ef4444' : '#035925',
            }"
          >
            <Check
              v-if="toastVariant !== 'error'"
              class="h-3 w-3 text-white"
              :stroke-width="3"
            />
            <X v-else class="h-3 w-3 text-white" :stroke-width="3" />
          </div>
          <span
            class="text-sm font-medium"
            :style="{ color: toastVariant === 'error' ? '#ef4444' : '#035925' }"
          >
            {{ toastMessage }}
          </span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Save, Check, X, Trash2, Plus, CalendarDays } from "lucide-vue-next";
import BaseButton from "~/components/base/BaseButton.vue";
import ImageUploader from "~/components/base/ImageUploader.vue";
import {
  useAboutUs,
  useSaveAboutUs,
  type MisiItem,
  type VisiItem,
} from "~/queries/useAboutUs";

const MAX_ITEMS = 4;

const { data, isLoading } = useAboutUs();
const { mutateAsync: saveAboutUs, isPending: isSaving } = useSaveAboutUs();

const form = ref({
  title: "",
  description: "",
  image_object_name: null as string | null,
  misi: {
    section_title: "",
    headline: "",
    description: "",
    items: [] as MisiItem[],
  },
  visi: [] as VisiItem[],
});

watch(
  data,
  (val) => {
    if (val) {
      form.value.title = val.title;
      form.value.description = val.description;
      form.value.image_object_name = val.image_object_name;
      form.value.misi = {
        section_title: val.misi.section_title,
        headline: val.misi.headline,
        description: val.misi.description,
        items: val.misi.items.map((i) => ({ ...i })),
      };
      form.value.visi = val.visi.map((i) => ({ ...i }));
    }
  },
  { immediate: true }
);

const addItem = () => {
  if (form.value.misi.items.length >= MAX_ITEMS) return;
  form.value.misi.items.push({
    id: `item_${Date.now()}`,
    image_object_name: null,
    title: "",
    description: "",
  });
};

const removeItem = (index: number) => {
  form.value.misi.items.splice(index, 1);
};

const addVisiItem = () => {
  form.value.visi.push({
    id: `visi_${Date.now()}`,
    image_object_name: null,
    year: new Date().getFullYear(),
    title: "",
    description: "",
  });
};

const removeVisiItem = (index: number) => {
  form.value.visi.splice(index, 1);
};

// Toast
const showToast = ref(false);
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");
let toastTimer: ReturnType<typeof setTimeout>;

const showNotification = (
  message: string,
  variant: "success" | "error" = "success"
) => {
  toastMessage.value = message;
  toastVariant.value = variant;
  showToast.value = true;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (showToast.value = false), 3000);
};

const handleSave = async () => {
  if (!form.value.title.trim()) {
    showNotification("Judul tidak boleh kosong.", "error");
    return;
  }
  if (!form.value.description.trim()) {
    showNotification("Deskripsi tidak boleh kosong.", "error");
    return;
  }
  try {
    await saveAboutUs({
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      image_object_name: form.value.image_object_name,
      misi: {
        section_title: form.value.misi.section_title.trim(),
        headline: form.value.misi.headline.trim(),
        description: form.value.misi.description.trim(),
        items: form.value.misi.items.map((i) => ({
          ...i,
          title: i.title.trim(),
          description: i.description.trim(),
        })),
      },
      visi: form.value.visi.map((i) => ({
        ...i,
        title: i.title.trim(),
        description: i.description.trim(),
      })),
    });
    showNotification("Perubahan berhasil disimpan");
  } catch (err: any) {
    showNotification(err?.message || "Terjadi kesalahan. Coba lagi.", "error");
  }
};
</script>
