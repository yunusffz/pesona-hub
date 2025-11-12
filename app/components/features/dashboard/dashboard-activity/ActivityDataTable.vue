<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Loader />
    </div>
    <div v-else class="rounded-2xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200">
            <tr>
              <th
                class="bg-gray-50 px-6 rounded-tl-2xl py-3 text-left text-xs font-medium text-gray-700"
              >
                Waktu
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-700"
              >
                Aktivitas
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-700"
              >
                Nama Produk
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-700"
              >
                Kontak KUPS
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-700"
              >
                Mitra
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-700"
              >
                Kontak Mitra
              </th>
              <th
                class="bg-gray-50 px-4 py-3 rounded-tr-2xl text-center text-xs font-medium text-gray-700 w-16"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="log in paginatedData"
              :key="log.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 text-nowrap">
                <span class="text-xs text-gray-900">{{
                  formatDateTimeIndonesian(log.created_at || log.createdAt)
                }}</span>
              </td>
              <td class="px-6 py-4 text-nowrap">
                <span class="text-xs text-gray-900">{{
                  getActivity(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs text-gray-900">{{
                  getProductName(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs text-gray-900">{{
                  getKupsContact(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs text-gray-900">{{
                  getMitraName(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs text-gray-900">{{
                  getMitraContact(log)
                }}</span>
              </td>
              <td class="px-4 py-4 text-center">
                <button
                  @click="openDetailModal(log)"
                  class="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  :aria-label="`Detail aktivitas ${log.id}`"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="4" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" />
                    <circle cx="10" cy="16" r="1.5" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :start-item="startItem"
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
        />
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeDetailModal"
    >
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        ></div>

        <!-- Center modal -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          @click.stop
        >
          <!-- Modal Header -->
          <div
            class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h3 class="text-lg font-semibold text-gray-900">
              Detail Aktivitas
            </h3>
            <button
              @click="closeDetailModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div v-if="selectedLog" class="space-y-4">
              <!-- Time -->
              <div class="border-b border-gray-100 pb-3">
                <label class="block text-xs font-medium text-gray-500 mb-1"
                  >Waktu</label
                >
                <p class="text-sm text-gray-900">
                  {{
                    formatDateTimeIndonesian(
                      selectedLog.created_at || selectedLog.createdAt
                    )
                  }}
                </p>
              </div>

              <!-- Activity -->
              <div class="border-b border-gray-100 pb-3">
                <label class="block text-xs font-medium text-gray-500 mb-1"
                  >Aktivitas</label
                >
                <p class="text-sm text-gray-900">
                  {{ getActivity(selectedLog) }}
                </p>
              </div>

              <!-- Product Name -->
              <div
                v-if="selectedLog.extra_data?.product_name"
                class="border-b border-gray-100 pb-3"
              >
                <label class="block text-xs font-medium text-gray-500 mb-1"
                  >Nama Produk</label
                >
                <p class="text-sm text-gray-900">
                  {{ selectedLog.extra_data?.product_name }}
                </p>
              </div>

              <!-- Product Description -->
              <div
                v-if="selectedLog.extra_data?.product_description"
                class="border-b border-gray-100 pb-3"
              >
                <label class="block text-xs font-medium text-gray-500 mb-1"
                  >Deskripsi Produk</label
                >
                <p class="text-sm text-gray-900">
                  {{ selectedLog.extra_data?.product_description }}
                </p>
              </div>

              <!-- Product Details -->
              <div
                v-if="
                  selectedLog.extra_data?.product_price ||
                  selectedLog.extra_data?.product_quantity
                "
                class="border-b border-gray-100 pb-3"
              >
                <label class="block text-xs font-medium text-gray-500 mb-2"
                  >Detail Produk</label
                >
                <div class="space-y-1 text-sm text-gray-900">
                  <p v-if="selectedLog.extra_data?.product_price">
                    <span class="font-medium">Harga:</span> Rp
                    {{
                      selectedLog.extra_data?.product_price.toLocaleString(
                        "id-ID"
                      )
                    }}
                    <span v-if="selectedLog.extra_data?.product_unit"
                      >/ {{ selectedLog.extra_data?.product_unit }}</span
                    >
                  </p>
                  <p v-if="selectedLog.extra_data?.product_quantity">
                    <span class="font-medium">Jumlah:</span>
                    {{ selectedLog.extra_data?.product_quantity }}
                    <span v-if="selectedLog.extra_data?.product_unit">
                      {{ selectedLog.extra_data?.product_unit }}</span
                    >
                  </p>
                  <p v-if="selectedLog.extra_data?.total_price">
                    <span class="font-medium">Total Harga:</span> Rp
                    {{
                      selectedLog.extra_data?.total_price.toLocaleString(
                        "id-ID"
                      )
                    }}
                  </p>
                  <p v-if="selectedLog.extra_data?.commodity_name">
                    <span class="font-medium">Komoditas:</span>
                    {{ selectedLog.extra_data?.commodity_name }}
                  </p>
                </div>
              </div>

              <!-- KUPS Info -->
              <div
                v-if="
                  selectedLog.extra_data?.kups_name ||
                  selectedLog.extra_data?.kups_contact ||
                  selectedLog.extra_data?.kups_class ||
                  selectedLog.extra_data?.kups_id
                "
                class="border-b border-gray-100 pb-3"
              >
                <label class="block text-xs font-medium text-gray-500 mb-2"
                  >Informasi KUPS</label
                >
                <div class="space-y-1 text-sm text-gray-900">
                  <p v-if="selectedLog.extra_data?.kups_name">
                    <span class="font-medium">Nama:</span>
                    {{ selectedLog.extra_data?.kups_name }}
                  </p>
                  <p v-if="selectedLog.extra_data?.kups_class">
                    <span class="font-medium">Kelas:</span>
                    {{ selectedLog.extra_data?.kups_class }}
                  </p>
                  <p v-if="selectedLog.extra_data?.kups_contact">
                    <span class="font-medium">Kontak:</span>
                    {{ selectedLog.extra_data?.kups_contact }}
                  </p>
                </div>
              </div>

              <!-- User/Mitra Info -->
              <div
                v-if="selectedLog.extra_data?.user_name"
                class="border-b border-gray-100 pb-3"
              >
                <label class="block text-xs font-medium text-gray-500 mb-2"
                  >Informasi Mitra</label
                >
                <div class="space-y-1 text-sm text-gray-900">
                  <p>
                    <span class="font-medium">Nama:</span>
                    {{ selectedLog.extra_data?.user_name }}
                  </p>
                  <p v-if="selectedLog.extra_data?.user_email">
                    <span class="font-medium">Email:</span>
                    {{ selectedLog.extra_data?.user_email }}
                  </p>
                  <p v-if="selectedLog.extra_data?.user_phone">
                    <span class="font-medium">Telepon:</span>
                    {{ selectedLog.extra_data?.user_phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end"
          >
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import Pagination from "~/components/ui/pagination/Pagination.vue";
  import Loader from "~/components/base/Loader.vue";
  import { formatDateTimeIndonesian } from "~/utils/format-date";

  interface ActivityLog {
    id: string | number;
    created_at?: string;
    createdAt?: string;
    event_type?: string;
    entity_type?: string;
    entity_id?: number;
    extra_data?: Record<string, any>;
    [key: string]: any;
  }

  interface Props {
    logs?: ActivityLog[];
    isLoading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    logs: () => [],
    isLoading: false,
  });

  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const showDetailModal = ref(false);
  const selectedLog = ref<ActivityLog | null>(null);

  const openDetailModal = (log: ActivityLog) => {
    selectedLog.value = log;
    showDetailModal.value = true;
  };

  const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedLog.value = null;
  };

  const totalItems = computed(() => props.logs.length);
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return props.logs.slice(start, end);
  });

  const startItem = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value;
  });

  const getActivity = (log: ActivityLog): string => {
    const eventType = log.event_type || "";
    const entityType = log.entity_type || "";
    const action = log.extra_data?.action || "";

    // Map event types to Indonesian
    const eventTypeMap: Record<string, string> = {
      view: "Melihat",
      click: "Mengklik",
      download: "Mengunduh",
      share: "Membagikan",
      contact: "Menghubungi",
      create: "Membuat",
      update: "Memperbarui",
      delete: "Menghapus",
    };

    const entityTypeMap: Record<string, string> = {
      product: "Produk",
      user: "Pengguna",
      catalog: "Katalog",
      profile: "Profil",
    };

    // Map action types to Indonesian
    const actionTypeMap: Record<string, string> = {
      collaboration_request: "Mengajukan Penawaran",
      whatsapp_contact: "Kontak WhatsApp",
      phone_contact: "Kontak Telepon",
      email_contact: "Kontak Email",
    };

    const eventText =
      eventTypeMap[eventType.toLowerCase()] || eventType || "Aktivitas";
    const entityText =
      entityTypeMap[entityType.toLowerCase()] || entityType || "";
    const actionText = action ? actionTypeMap[action] || action : "";

    // Priority: action > event + entity
    if (actionText) {
      return actionText;
    }

    return entityText ? `${eventText} ${entityText}` : eventText;
  };

  const getProductName = (log: ActivityLog): string => {
    return log.extra_data?.product_name || "-";
  };

  const getKupsContact = (log: ActivityLog): string => {
    return log.extra_data?.kups_contact || "-";
  };

  const getMitraName = (log: ActivityLog): string => {
    return log.extra_data?.user_name || "-";
  };

  const getMitraContact = (log: ActivityLog): string => {
    const phone = log.extra_data?.user_phone;
    const email = log.extra_data?.user_email;

    if (phone && email) {
      return `${phone} / ${email}`;
    }
    return phone || email || "-";
  };
</script>
