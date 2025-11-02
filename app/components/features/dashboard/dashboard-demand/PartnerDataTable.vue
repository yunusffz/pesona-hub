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
                Nama Mitra
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Komoditas Minat
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Bentuk Kerjasama
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Lokasi Target
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Kontak Mitra
              </th>
              <th
                class="bg-gray-50 px-6 py-3 rounded-tr-2xl text-left text-sm font-medium text-gray-700"
              >
                Nomor WA Mitra
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="partner in paginatedData"
              :key="partner.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      :src="getImageSrc(partner)"
                      :alt="partner.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError($event, partner)"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-900">{{
                      partner.name || "-"
                    }}</span>
                    <span v-if="partner.details?.institution_name" class="text-xs text-gray-500">
                      {{ partner.details.institution_name }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{
                  getCommodities(partner)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{
                  getCollaborations(partner)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{
                  getLocation(partner)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{
                  getContact(partner)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <a
                  v-if="getWhatsAppNumber(partner)"
                  :href="`https://wa.me/${getWhatsAppNumber(partner)?.replace(/[^0-9]/g, '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-green-600 hover:text-green-700 hover:underline flex items-center gap-1"
                >
                  <Icon name="uil:whatsapp" class="w-4 h-4" />
                  {{ getWhatsAppNumber(partner) }}
                </a>
                <span v-else class="text-sm text-gray-500">-</span>
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
  import type { components } from "~/types/pesona-hub-api";
  import { useCommodities } from "~/queries/useCommodities";
  import { useCollaborations } from "~/queries/useCollaborations";

  type UserResponse = components["schemas"]["UserResponse"];

  interface Props {
    partners?: UserResponse[];
    isLoading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    partners: () => [],
    isLoading: false,
  });

  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const totalItems = computed(() => props.partners.length);
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return props.partners.slice(start, end);
  });

  const startItem = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value;
  });

  // Fetch commodities and collaborations for name mapping
  const { data: commoditiesData } = useCommodities();
  const { data: collaborationsData } = useCollaborations();

  // Create maps for quick lookup
  const commoditiesMap = computed(() => {
    const map = new Map<number, string>();
    if (commoditiesData.value?.data && Array.isArray(commoditiesData.value.data)) {
      (commoditiesData.value.data as any[]).forEach((commodity: any) => {
        if (commodity.id && commodity.name) {
          map.set(commodity.id, commodity.name);
        }
      });
    }
    return map;
  });

  const collaborationsMap = computed(() => {
    const map = new Map<number, string>();
    const data = collaborationsData.value && "data" in collaborationsData.value
      ? collaborationsData.value.data
      : collaborationsData.value;
    
    if (Array.isArray(data)) {
      data.forEach((collab: any) => {
        if (collab.id && collab.name) {
          map.set(collab.id, collab.name);
        }
      });
    } else if (data && typeof data === "object" && (data as any).id) {
      const collab = data as any;
      if (collab.id && collab.name) {
        map.set(collab.id, collab.name);
      }
    }
    return map;
  });

  // Array of placeholder images
  const placeholderImages = [
    "/assets/images/product-1.png",
    "/assets/images/product-2.png",
    "/assets/images/product-3.png",
  ];

  const getRandomPlaceholderImage = (
    partnerId: string | number | undefined
  ): string => {
    if (partnerId === undefined) {
      const randomIndex = Math.floor(Math.random() * placeholderImages.length);
      return placeholderImages[randomIndex] ?? placeholderImages[0];
    }
    const id = typeof partnerId === "string" ? parseInt(partnerId) || 0 : partnerId;
    const index = id % placeholderImages.length;
    return placeholderImages[index] ?? placeholderImages[0];
  };

  const failedImages = ref<Map<string | number, boolean>>(new Map());

  const getImageSrc = (partner: UserResponse): string => {
    if (failedImages.value.get(partner.id)) {
      return getRandomPlaceholderImage(partner.id);
    }

    if (partner.thumbnail && partner.thumbnail.trim() !== "") {
      return partner.thumbnail.trim();
    }

    return getRandomPlaceholderImage(partner.id);
  };

  const handleImageError = (event: Event, partner: UserResponse): void => {
    const img = event.target as HTMLImageElement;
    failedImages.value.set(partner.id, true);
    img.src = getRandomPlaceholderImage(partner.id);
  };

  const getCommodities = (partner: UserResponse): string => {
    if (!partner.details?.collaboration_commodity_ids) return "-";
    const ids = partner.details.collaboration_commodity_ids;
    if (Array.isArray(ids) && ids.length > 0) {
      const names = ids
        .map((id: number) => commoditiesMap.value.get(id))
        .filter((name): name is string => !!name);
      
      if (names.length > 0) {
        return names.join(", ");
      }
      return `${ids.length} komoditas`;
    }
    return "-";
  };

  const getCollaborations = (partner: UserResponse): string => {
    if (!partner.details?.collaboration_ids) return "-";
    const ids = partner.details.collaboration_ids;
    if (Array.isArray(ids) && ids.length > 0) {
      const names = ids
        .map((id: number) => collaborationsMap.value.get(id))
        .filter((name): name is string => !!name);
      
      if (names.length > 0) {
        return names.join(", ");
      }
      return `${ids.length} bentuk kerjasama`;
    }
    return "-";
  };

  const getLocation = (partner: UserResponse): string => {
    const details = partner.details;
    if (!details) return "-";
    
    const locationParts: string[] = [];
    if (details.province) locationParts.push(details.province);
    if (details.regency) locationParts.push(details.regency);
    
    return locationParts.length > 0 ? locationParts.join(", ") : "-";
  };

  const getContact = (partner: UserResponse): string => {
    // Try contact_phone from details first, then phone from user
    if (partner.details?.contact_phone) {
      return partner.details.contact_phone;
    }
    if (partner.phone) {
      return partner.phone;
    }
    if (partner.details?.contact_email) {
      return partner.details.contact_email;
    }
    if (partner.email) {
      return partner.email;
    }
    return "-";
  };

  const getWhatsAppNumber = (partner: UserResponse): string | null => {
    // Prioritize contact_phone from details, then phone from user
    if (partner.details?.contact_phone) {
      return partner.details.contact_phone;
    }
    if (partner.phone) {
      return partner.phone;
    }
    return null;
  };
</script>

