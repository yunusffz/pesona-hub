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
                class="bg-gray-50 px-6 rounded-tl-2xl py-3 text-left text-sm font-medium text-gray-700"
              >
                Waktu
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Aktivitas
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Nama Produk
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Kontak KUPS
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Mitra
              </th>
              <th
                class="bg-gray-50 px-6 py-3 rounded-tr-2xl text-left text-sm font-medium text-gray-700"
              >
                Kontak Mitra
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="log in paginatedData"
              :key="log.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  formatDateTimeIndonesian(log.created_at || log.createdAt)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  getActivity(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  getProductName(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  getKupsContact(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  getMitraName(log)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  getMitraContact(log)
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination -->
      <div class="px-6 py-4 border-t border-gray-200">
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
    const eventType = log.event_type || log.extra_data?.event_type || "";
    const entityType = log.entity_type || log.extra_data?.entity_type || "";
    
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

    const eventText = eventTypeMap[eventType.toLowerCase()] || eventType || "Aktivitas";
    const entityText = entityTypeMap[entityType.toLowerCase()] || entityType || "";

    return entityText ? `${eventText} ${entityText}` : eventText;
  };

  const getProductName = (log: ActivityLog): string => {
    // Try to get product name from extra_data or populated relations
    const extraData = log.extra_data || {};
    const productName =
      extraData.product_name ||
      extraData.product?.name ||
      (log as any).product?.name ||
      "-";

    return productName || "-";
  };

  const getKupsContact = (log: ActivityLog): string => {
    // Try to get KUPS contact from extra_data or populated relations
    const extraData = log.extra_data || {};
    const kupsContact =
      extraData.kups_contact ||
      extraData.kups?.contact ||
      extraData.social_forestry_business_group?.contact ||
      (log as any).social_forestry_business_group?.contact ||
      (log as any).kups?.contact ||
      "-";

    return kupsContact || "-";
  };

  const getMitraName = (log: ActivityLog): string => {
    // Try to get partner name from extra_data or populated relations
    const extraData = log.extra_data || {};
    const mitraName =
      extraData.mitra_name ||
      extraData.partner?.name ||
      extraData.user?.name ||
      (log as any).user?.name ||
      (log as any).partner?.name ||
      "-";

    return mitraName || "-";
  };

  const getMitraContact = (log: ActivityLog): string => {
    // Try to get partner contact from extra_data or populated relations
    const extraData = log.extra_data || {};
    const mitraContact =
      extraData.mitra_contact ||
      extraData.partner?.contact ||
      extraData.partner?.phone ||
      extraData.partner?.email ||
      extraData.user?.phone ||
      extraData.user?.email ||
      (log as any).user?.phone ||
      (log as any).user?.email ||
      (log as any).partner?.phone ||
      (log as any).partner?.email ||
      "-";

    return mitraContact || "-";
  };
</script>


