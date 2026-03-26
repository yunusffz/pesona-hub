<template>
  <div class="flex flex-col gap-6">
    <!-- Add / Edit Modal -->
    <Dialog v-model:open="showFormModal">
      <DialogContent
        class="p-0 border-none shadow-none bg-transparent max-w-fit [&>button:last-child]:hidden"
      >
        <FaqForm
          :faq="editingFaq"
          :submitting="isSubmitting"
          @cancel="closeModal"
          @submit="handleFormSubmit"
        />
      </DialogContent>
    </Dialog>

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">FAQ (Frequently Asked Questions)</h1>
        <p class="text-[#6A7282] text-sm">Kelola pertanyaan yang sering ditanyakan</p>
      </div>
      <BaseButton class="py-2 px-4 text-sm w-full sm:w-auto" @click="openAddModal">
        <Plus class="w-4 h-4" />
        Tambah FAQ
      </BaseButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-[#E4E4E7] p-4 flex items-center gap-4">
        <div class="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <MessageCircleQuestion class="h-5 w-5 text-blue-500" />
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-[#101828]">{{ sortedFaqs.length }}</span>
          <span class="text-xs text-[#6A7282]">Total FAQ</span>
        </div>
      </div>
      <div class="bg-[#e8f5ee] rounded-xl border border-[#d1ead9] p-4 flex items-center gap-4">
        <div class="h-10 w-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
          <ToggleRight class="h-5 w-5 text-[#035925]" />
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-[#035925]">{{ activeFaqs }}</span>
          <span class="text-xs text-[#035925]/70">FAQ Aktif</span>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA4AE]" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari pertanyaan atau jawaban..."
        class="w-full rounded-xl border border-[#E4E4E7] bg-white pl-10 pr-4 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition"
      />
    </div>

    <!-- List -->
    <div class="flex flex-col gap-3">
      <!-- Loading -->
      <template v-if="isLoading">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-xl border border-[#E4E4E7] p-4 animate-pulse h-20"
        />
      </template>

      <!-- Empty state -->
      <div
        v-else-if="filteredFaqs.length === 0"
        class="bg-white rounded-xl border border-[#E4E4E7] flex flex-col items-center justify-center py-16 gap-4"
      >
        <div class="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
          <MessageCircleQuestion class="h-8 w-8 text-gray-300" />
        </div>
        <div class="flex flex-col items-center gap-1 text-center">
          <span class="font-semibold text-[#344054]">
            {{ searchQuery ? "FAQ tidak ditemukan" : "Belum ada FAQ" }}
          </span>
          <p class="text-sm text-[#6A7282] max-w-xs">
            {{
              searchQuery
                ? "Coba kata kunci lain atau hapus filter pencarian."
                : "Tambahkan pertanyaan umum beserta jawabannya agar pengguna mendapatkan informasi dengan cepat."
            }}
          </p>
        </div>
        <BaseButton v-if="!searchQuery" class="py-2 px-4 text-sm" @click="openAddModal">
          <Plus class="w-4 h-4" />
          Tambah FAQ
        </BaseButton>
      </div>

      <!-- FAQ items -->
      <div
        v-else
        v-for="item in filteredFaqs"
        :key="item.id"
        class="bg-white rounded-xl border border-[#E4E4E7] overflow-hidden"
      >
        <div class="flex items-start gap-3 p-4">
          <!-- Active indicator -->
          <div
            :class="[
              'mt-0.5 h-2 w-2 rounded-full shrink-0',
              item.is_active ? 'bg-[#035925]' : 'bg-gray-300',
            ]"
          />

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-[#101828] leading-snug">{{ item.question }}</p>
            <p class="text-sm text-[#6A7282] mt-1 leading-relaxed line-clamp-2">{{ item.answer }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0">
            <!-- Toggle active -->
            <button
              type="button"
              :title="item.is_active ? 'Nonaktifkan' : 'Aktifkan'"
              :class="[
                'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none',
                item.is_active ? 'bg-[#035925]' : 'bg-gray-200',
              ]"
              @click="handleToggleActive(item)"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200',
                  item.is_active ? 'translate-x-4' : 'translate-x-0',
                ]"
              />
            </button>

            <button
              type="button"
              class="p-1.5 rounded-lg text-[#6A7282] hover:bg-gray-100 hover:text-[#101828] transition"
              @click="openEditModal(item)"
            >
              <Pencil class="h-4 w-4" />
            </button>

            <button
              v-if="deletingId !== item.id"
              type="button"
              class="p-1.5 rounded-lg text-[#6A7282] hover:bg-red-50 hover:text-red-500 transition"
              @click="deletingId = item.id"
            >
              <Trash2 class="h-4 w-4" />
            </button>

            <!-- Confirm delete -->
            <div v-else class="flex items-center gap-1">
              <button
                type="button"
                class="px-2 py-1 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition"
                @click="handleDelete(item.id)"
              >
                Hapus
              </button>
              <button
                type="button"
                class="px-2 py-1 rounded-lg text-xs font-medium text-[#344054] bg-gray-100 hover:bg-gray-200 transition"
                @click="deletingId = null"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
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
          :style="{ backgroundColor: toastVariant === 'error' ? '#fef2f2' : '#e8f5ee' }"
        >
          <div
            class="h-5 w-5 shrink-0 rounded-full flex items-center justify-center"
            :style="{ backgroundColor: toastVariant === 'error' ? '#ef4444' : '#035925' }"
          >
            <Check v-if="toastVariant !== 'error'" class="h-3 w-3 text-white" :stroke-width="3" />
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
import { ref, computed } from "vue";
import { Plus, Check, X, Pencil, Trash2, Search, MessageCircleQuestion, ToggleRight } from "lucide-vue-next";
import BaseButton from "~/components/base/BaseButton.vue";
import FaqForm from "~/components/features/cms/faq/FaqForm.vue";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import {
  useFaqs,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
  type FaqItem,
} from "~/queries/useFaq";

interface FaqFormData {
  question: string;
  answer: string;
  is_active: boolean;
}

const { data: faqsData, isLoading } = useFaqs();
const { mutateAsync: createFaq } = useCreateFaq();
const { mutateAsync: updateFaq } = useUpdateFaq();
const { mutateAsync: deleteFaq } = useDeleteFaq();

const sortedFaqs = computed<FaqItem[]>(() => {
  if (!Array.isArray(faqsData.value)) return [];
  return [...faqsData.value].sort((a, b) => a.order - b.order);
});

const searchQuery = ref("");

const filteredFaqs = computed(() => {
  if (!searchQuery.value.trim()) return sortedFaqs.value;
  const q = searchQuery.value.toLowerCase();
  return sortedFaqs.value.filter(
    (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );
});

const activeFaqs = computed(() => sortedFaqs.value.filter((f) => f.is_active).length);

// Modal state
const showFormModal = ref(false);
const editingFaq = ref<FaqItem | null>(null);
const isSubmitting = ref(false);
const deletingId = ref<string | null>(null);

const openAddModal = () => {
  editingFaq.value = null;
  showFormModal.value = true;
};

const openEditModal = (faq: FaqItem) => {
  editingFaq.value = faq;
  showFormModal.value = true;
};

const closeModal = () => {
  showFormModal.value = false;
  editingFaq.value = null;
};

// Toast
const showToast = ref(false);
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");
let toastTimer: ReturnType<typeof setTimeout>;

const showNotification = (message: string, variant: "success" | "error" = "success") => {
  toastMessage.value = message;
  toastVariant.value = variant;
  showToast.value = true;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (showToast.value = false), 3000);
};

// Handlers
const handleFormSubmit = async (formData: FaqFormData) => {
  isSubmitting.value = true;
  try {
    if (editingFaq.value) {
      await updateFaq({ id: editingFaq.value.id, data: formData });
      showNotification("FAQ berhasil diperbarui");
    } else {
      await createFaq(formData);
      showNotification("FAQ berhasil ditambahkan");
    }
    closeModal();
  } catch (err: any) {
    showNotification(err?.message || "Terjadi kesalahan. Coba lagi.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

const handleToggleActive = async (faq: FaqItem) => {
  try {
    await updateFaq({ id: faq.id, data: { is_active: !faq.is_active } });
  } catch (err: any) {
    showNotification(err?.message || "Gagal mengubah status FAQ.", "error");
  }
};

const handleDelete = async (id: string) => {
  try {
    await deleteFaq(id);
    showNotification("FAQ berhasil dihapus");
  } catch (err: any) {
    showNotification(err?.message || "Gagal menghapus FAQ.", "error");
  } finally {
    deletingId.value = null;
  }
};
</script>
