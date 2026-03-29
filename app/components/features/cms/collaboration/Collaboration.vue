<template>
  <div class="flex flex-col gap-8">
    <!-- Add / Edit Modal -->
    <Dialog v-model:open="showFormModal">
      <DialogContent
        class="p-0 border-none shadow-none bg-transparent max-w-fit [&>button:last-child]:hidden"
      >
        <PartnerForm
          :partner="editingPartner"
          :submitting="isSubmitting"
          @cancel="closeModal"
          @submit="handleFormSubmit"
        />
      </DialogContent>
    </Dialog>

    <!-- Page header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">Kolaborasi</h1>
        <p class="text-[#6A7282] text-sm">Kelola partner pesona hub disini</p>
      </div>
      <BaseButton
        class="py-2 px-4 text-sm w-full sm:w-auto"
        @click="openAddModal"
      >
        <Plus class="w-4 h-4" />
        Tambah Partner
      </BaseButton>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-xl border border-[#E4E4E7]">
      <div class="p-4 lg:p-6 border-b border-[#E4E4E7]">
        <div class="flex items-center gap-2">
          <Handshake class="h-4 w-4 text-[#035925]" />
          <span class="text-sm font-medium text-[#344054]">
            Daftar Partner ({{ sortedPartners.length }})
          </span>
        </div>
      </div>

      <div class="p-4 lg:p-6">
        <PartnerDataTable
          :partners="sortedPartners"
          :is-loading="isLoading"
          @edit="openEditModal"
          @delete="handleDelete"
        />
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
import { Plus, Check, X, Handshake } from "lucide-vue-next";
import BaseButton from "~/components/base/BaseButton.vue";
import PartnerDataTable from "~/components/features/cms/collaboration/DataTable.vue";
import PartnerForm from "~/components/features/cms/collaboration/PartnerForm.vue";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  type PartnerItem,
} from "~/queries/usePartners";

interface PartnerFormData {
  name: string;
  logo_object_name: string | null;
}

const { data: partnersData, isLoading } = usePartners();
const { mutateAsync: createPartner } = useCreatePartner();
const { mutateAsync: updatePartner } = useUpdatePartner();
const { mutateAsync: deletePartner } = useDeletePartner();

const sortedPartners = computed<PartnerItem[]>(() => {
  if (!Array.isArray(partnersData.value)) return [];
  return [...partnersData.value].sort((a, b) => a.order - b.order);
});

// Modal state
const showFormModal = ref(false);
const editingPartner = ref<PartnerItem | null>(null);
const isSubmitting = ref(false);

const openAddModal = () => {
  editingPartner.value = null;
  showFormModal.value = true;
};

const openEditModal = (partner: PartnerItem) => {
  editingPartner.value = partner;
  showFormModal.value = true;
};

const closeModal = () => {
  showFormModal.value = false;
  editingPartner.value = null;
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
const handleFormSubmit = async (formData: PartnerFormData) => {
  isSubmitting.value = true;
  try {
    if (editingPartner.value) {
      await updatePartner({
        id: editingPartner.value.id,
        data: {
          name: formData.name,
          logo_object_name: formData.logo_object_name,
        },
      });
      showNotification("Partner berhasil diperbarui");
    } else {
      const nextOrder = (sortedPartners.value.at(-1)?.order ?? 0) + 1;
      await createPartner({
        name: formData.name,
        logo_object_name: formData.logo_object_name,
        order: nextOrder,
      });
      showNotification("Partner berhasil ditambahkan");
    }
    closeModal();
  } catch (err: any) {
    showNotification(err?.message || "Terjadi kesalahan. Coba lagi.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  try {
    await deletePartner(id);
    showNotification("Partner berhasil dihapus");
  } catch (err: any) {
    showNotification(err?.message || "Gagal menghapus partner.", "error");
  }
};
</script>
