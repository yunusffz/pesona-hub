<template>
  <div class="flex flex-col gap-8">
    <!-- Delete Confirmation Modal -->
    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="max-w-sm [&>button:last-child]:hidden">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="font-semibold text-lg text-[#1e1e1e]">Hapus Mitra</h2>
            <p class="text-sm text-[#6a7282]">
              Apakah Anda yakin ingin menghapus mitra
              <span class="font-medium text-[#1e1e1e]">{{ selectedUser?.name }}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="flex justify-end gap-3">
            <BaseButton
              variant="secondary"
              class="h-9 px-4 rounded-2xl text-sm border border-[#e7efea] text-[#1e1e1e]"
              @click="showDeleteModal = false"
            >
              Batal
            </BaseButton>
            <BaseButton
              class="h-9 px-4 rounded-2xl text-sm bg-red-600 hover:bg-red-700 text-white"
              :disabled="isDeletePending"
              @click="handleDelete"
            >
              {{ isDeletePending ? "Menghapus..." : "Hapus" }}
            </BaseButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Add Modal -->
    <Dialog v-model:open="showAddModal">
      <DialogContent
        class="p-0 border-none shadow-none bg-transparent max-w-fit [&>button:last-child]:hidden"
      >
        <AddMitra
          @cancel="showAddModal = false"
          @submit="onSubmit('add')"
        />
      </DialogContent>
    </Dialog>

    <!-- Edit Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent
        class="p-0 border-none shadow-none bg-transparent max-w-fit [&>button:last-child]:hidden"
      >
        <AddMitra
          :user="selectedUser"
          @cancel="showEditModal = false"
          @submit="onSubmit('edit')"
        />
      </DialogContent>
    </Dialog>

    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">Data Mitra</h1>
        <p class="text-[#6A7282] text-sm">
          Kelola akun mitra KUPS
        </p>
      </div>
      <BaseButton
        class="py-2 px-4 text-sm w-full sm:w-auto"
        @click="showAddModal = true"
      >
        <Plus class="w-5" /> Tambah Mitra
      </BaseButton>
    </div>

    <div class="bg-white rounded-xl border border-[#E4E4E7]">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#E4E4E7]"
      >
        <SearchInput
          class="w-full sm:w-[290px] h-12"
          placeholder="Cari..."
          :onSearch="handleSearch"
        />
        <div class="flex items-center gap-2">
          <BaseButton
            variant="solid"
            class="px-3 py-2 text-sm w-full sm:w-auto"
            @click="handleExportToExcel"
          >
            <Icon name="uil:file-export" class="w-4 h-4" />
            Export
          </BaseButton>
        </div>
      </div>

      <div class="p-4 lg:p-8">
        <MitraDataTable
          :users="filteredUsers"
          :isLoading="isLoading"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>
    </div>

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
          style="background-color: #e8f5ee"
        >
          <div
            class="h-5 w-5 shrink-0 rounded-full flex items-center justify-center"
            style="background-color: #035925"
          >
            <Check class="h-3 w-3 text-white" :stroke-width="3" />
          </div>
          <span class="text-sm font-medium" style="color: #035925">
            {{ toastMessage }}
          </span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Plus, Check } from "lucide-vue-next";
import { useCmsToast } from "~/composables/useCmsToast";
import BaseButton from "~/components/base/BaseButton.vue";
import SearchInput from "~/components/base/SearchInput.vue";
import MitraDataTable from "~/components/features/cms/mitra/DataTable.vue";
import AddMitra from "~/components/features/cms/mitra/AddMitra.vue";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useUsers, useDeleteUser } from "~/queries/useUsers";
import type { components } from "~/types/pesona-hub-api";

type UserResponse = components["schemas"]["UserResponse"];

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref<UserResponse | null>(null);
const searchQuery = ref("");
const { showToast, toastMessage, show: showCmsToast } = useCmsToast();

const onSubmit = (type: "add" | "edit") => {
  if (type === "add") showAddModal.value = false;
  else showEditModal.value = false;
  refetch();
  showCmsToast(type === "add" ? "Mitra berhasil ditambahkan" : "Mitra berhasil diperbarui");
};

const openEditModal = (user: UserResponse) => {
  selectedUser.value = user;
  showEditModal.value = true;
};

const openDeleteModal = (user: UserResponse) => {
  selectedUser.value = user;
  showDeleteModal.value = true;
};

const { mutateAsync: deleteUser, isPending: isDeletePending } = useDeleteUser();

const handleDelete = async () => {
  if (!selectedUser.value?.username) return;
  await deleteUser(selectedUser.value.username);
  showDeleteModal.value = false;
  showCmsToast("Mitra berhasil dihapus");
};

const { data, isLoading, refetch } = useUsers({
  filters: {
    role: {
      $eq: "PARTNER",
    },
  },
  populate: ["details"],
  fields: ["id", "name", "username", "email", "phone", "status", "role"],
});

const users = computed<UserResponse[]>(() => {
  const list = (data.value as any)?.data;
  return Array.isArray(list) ? list : [];
});

const handleSearch = (value: string) => {
  searchQuery.value = value.toLowerCase().trim();
};

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value;
  return users.value.filter((user) => {
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      user.details?.institution_name?.toLowerCase().includes(query) ||
      user.details?.province?.toLowerCase().includes(query)
    );
  });
});

const handleExportToExcel = async () => {
  try {
    const XLSX = await import("xlsx");
    const excelData = filteredUsers.value.map((user) => ({
      "Nama Mitra": user.name || "-",
      "Nama Institusi": user.details?.institution_name || "-",
      "Lokasi Target": [user.details?.province, user.details?.regency].filter(Boolean).join(", ") || "-",
      "Kontak Mitra": user.details?.contact_phone || user.phone || user.email || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mitra");
    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
    ];

    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Data_Mitra_${timestamp}.xlsx`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};
</script>
