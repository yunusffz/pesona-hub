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
                class="bg-gray-50 px-6 rounded-tl-2xl py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Nama Mitra
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Komoditas Minat
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Bentuk Kerja Sama
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Lokasi Target
              </th>
              <th
                class="bg-gray-50 px-6 py-3 rounded-tr-2xl text-left text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Kontak Mitra
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="paginatedData.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                Tidak ada data mitra
              </td>
            </tr>
            <tr
              v-for="user in paginatedData"
              :key="user.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-medium text-gray-900">
                    {{ user.name || "-" }}
                  </span>
                  <span
                    v-if="user.details?.institution_name"
                    class="text-xs text-gray-500"
                  >
                    {{ user.details.institution_name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ getCommodities(user) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ getCollaborations(user) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ getLocation(user) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ getContact(user) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer with Pagination -->
    <div class="py-4 border-t border-gray-200 flex justify-end">
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Pagination from "~/components/ui/pagination/Pagination.vue";
import Loader from "~/components/base/Loader.vue";
import type { components } from "~/types/pesona-hub-api";
import { useCommodities } from "~/queries/useCommodities";
import { useCollaborations } from "~/queries/useCollaborations";

type UserResponse = components["schemas"]["UserResponse"];

interface Props {
  users?: UserResponse[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  users: () => [],
  isLoading: false,
});

const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalItems = computed(() => props.users.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.users.slice(start, end);
});

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const { data: commoditiesData } = useCommodities();
const { data: collaborationsData } = useCollaborations();

const commoditiesMap = computed(() => {
  const map = new Map<number, string>();
  if (commoditiesData.value?.data && Array.isArray(commoditiesData.value.data)) {
    (commoditiesData.value.data as any[]).forEach((c: any) => {
      if (c.id && c.name) map.set(c.id, c.name);
    });
  }
  return map;
});

const collaborationsMap = computed(() => {
  const map = new Map<number, string>();
  const data =
    collaborationsData.value && "data" in collaborationsData.value
      ? collaborationsData.value.data
      : collaborationsData.value;

  if (Array.isArray(data)) {
    data.forEach((c: any) => {
      if (c.id && c.name) map.set(c.id, c.name);
    });
  }
  return map;
});

const getCommodities = (user: UserResponse): string => {
  if (!user.details?.collaboration_commodities) return "-";
  const ids: number[] = [];
  if (Array.isArray(user.details.collaboration_commodities)) {
    user.details.collaboration_commodities.forEach((id: any) => {
      if (!isNaN(id) && !ids.includes(id)) ids.push(id);
    });
  }
  if (ids.length > 0) {
    const names = ids
      .map((id) => commoditiesMap.value.get(id))
      .filter((n): n is string => !!n);
    return names.length > 0 ? names.join(", ") : `${ids.length} komoditas`;
  }
  return "-";
};

const getCollaborations = (user: UserResponse): string => {
  if (!user.details?.collaboration_ids) return "-";
  const ids = user.details.collaboration_ids;
  if (Array.isArray(ids) && ids.length > 0) {
    const names = ids
      .map((id: number) => collaborationsMap.value.get(id))
      .filter((n): n is string => !!n);
    return names.length > 0 ? names.join(", ") : `${ids.length} bentuk kerjasama`;
  }
  return "-";
};

const getLocation = (user: UserResponse): string => {
  const details = user.details;
  if (!details) return "-";
  const parts: string[] = [];
  if (details.province) parts.push(details.province);
  if (details.regency) parts.push(details.regency);
  return parts.length > 0 ? parts.join(", ") : "-";
};

const getContact = (user: UserResponse): string => {
  if (user.details?.contact_phone) return user.details.contact_phone;
  if (user.phone) return user.phone;
  if (user.details?.contact_email) return user.details.contact_email;
  if (user.email) return user.email;
  return "-";
};
</script>
