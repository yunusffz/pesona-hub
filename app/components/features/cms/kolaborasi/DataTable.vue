<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Loader />
    </div>

    <div v-else class="rounded-2xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200">
            <tr>
              <th
                class="bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-20"
              >
                Urutan
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap w-32"
              >
                Logo Partner
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Nama Partner
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-right text-sm font-medium text-gray-700 whitespace-nowrap w-28"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="partners.length === 0">
              <td
                colspan="4"
                class="px-6 py-12 text-center text-sm text-gray-500"
              >
                Belum ada partner. Klik "+ Tambah Partner" untuk menambahkan.
              </td>
            </tr>
            <tr
              v-for="partner in partners"
              :key="partner.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Order column with grip handle -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-2 text-gray-400">
                  <GripVertical class="h-4 w-4 shrink-0" />
                  <span class="text-sm font-medium text-gray-600">
                    {{ partner.order }}
                  </span>
                </div>
              </td>

              <!-- Logo column -->
              <td class="px-6 py-4">
                <div
                  class="w-16 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="partner.logo_object_name"
                    :src="`${apiBaseUrl}/files/${partner.logo_object_name}`"
                    :alt="`Logo ${partner.name}`"
                    class="w-full h-full object-contain p-1"
                  />
                  <ImageOff v-else class="h-5 w-5 text-gray-300" />
                </div>
              </td>

              <!-- Name column -->
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-900">
                  {{ partner.name }}
                </span>
              </td>

              <!-- Actions column -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="p-2 rounded-lg text-gray-500 hover:text-[#035925] hover:bg-[#e6f1d6] transition-colors"
                    title="Edit partner"
                    @click="emit('edit', partner)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>

                  <button
                    v-if="deletingId !== partner.id"
                    class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus partner"
                    @click="deletingId = partner.id"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>

                  <div v-else class="flex items-center gap-1">
                    <button
                      class="px-2 py-1 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                      @click="confirmDelete(partner.id)"
                    >
                      Hapus
                    </button>
                    <button
                      class="px-2 py-1 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                      @click="deletingId = null"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GripVertical, Pencil, Trash2, ImageOff } from "lucide-vue-next";
import Loader from "~/components/base/Loader.vue";
import type { PartnerItem } from "~/queries/usePartners";

interface Props {
  partners?: PartnerItem[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  partners: () => [],
  isLoading: false,
});

const emit = defineEmits<{
  edit: [partner: PartnerItem];
  delete: [id: string];
}>();

const config = useRuntimeConfig();
const apiBaseUrl = config.public.pesonaApiUrl;
const deletingId = ref<string | null>(null);

const confirmDelete = (id: string) => {
  deletingId.value = null;
  emit("delete", id);
};
</script>
