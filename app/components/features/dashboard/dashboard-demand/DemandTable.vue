<template>
  <section>
    <div class="flex items-center justify-between">
      <SearchInput
        class="w-[290px] h-9"
        placeholder="Cari..."
        :onSearch="handleSearch"
      />
      <div class="flex items-center gap-2">
        <FilterSheet ref="filterSheetRef">
          <template #trigger>
            <BaseButton
              variant="secondary"
              class="pr-2 px-3 py-2 justify-between text-sm relative"
            >
              <Icon name="uil:filter" class="w-4 h-4" />
              Filter
              <Badge
                v-if="activeFiltersCount > 0"
                class="ml-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                >{{ activeFiltersCount }}</Badge
              >
            </BaseButton>
          </template>
        </FilterSheet>
        <BaseButton
          variant="solid"
          class="pr-2 px-3 py-2 justify-between text-sm"
          @click="handleExportToExcel"
        >
          <Icon name="uil:file-export" class="w-4 h-4" />
          Export
        </BaseButton>
      </div>
    </div>
    <div class="mt-4">
      <PartnerDataTable :partners="filteredPartners" :isLoading="isLoading" />
    </div>
  </section>
</template>
<script setup lang="ts">
  import SearchInput from "~/components/base/SearchInput.vue";
  import BaseButton from "~/components/base/BaseButton.vue";
  import PartnerDataTable from "./PartnerDataTable.vue";
  import FilterSheet from "./FilterSheet.vue";
  import { Badge } from "~/components/ui/badge";
  import { useUsers } from "~/queries/useUsers";
  import { useDemandStore } from "~/stores/useDemandStore";
  import { useCommodities } from "~/queries/useCommodities";
  import { useCollaborations } from "~/queries/useCollaborations";
  import type { components } from "~/types/pesona-hub-api";
  import { computed, ref, watch } from "vue";

  type UserResponse = components["schemas"]["UserResponse"];

  const demandStore = useDemandStore();
  const filterSheetRef = ref();

  // Create reactive computed values for query options
  const searchQueryComputed = computed(() => demandStore.searchQuery);
  const filtersComputed = computed(() => {
    const filters = demandStore.filters;
    return filters;
  });
  const sortComputed = computed(() => {
    const sortValue = demandStore.sortBy;
    return sortValue || undefined;
  });

  const { data, isLoading, refetch } = useUsers({
    get search() {
      return searchQueryComputed.value;
    },
    get filters() {
      const filters = filtersComputed.value;
      return filters;
    },
    get sort() {
      return sortComputed.value;
    },
    populate: ["details"],
    fields: ["id", "name", "username", "email", "phone", "thumbnail", "role"],
  });

  // Watch for filter changes and refetch
  watch(
    [filtersComputed, sortComputed, searchQueryComputed],
    () => {
      refetch();
    },
    { deep: true, flush: "post" }
  );

  const partners = computed(() => {
    const partnersData = data.value?.data;
    if (Array.isArray(partnersData)) {
      return partnersData as unknown as UserResponse[];
    }
    return [] as UserResponse[];
  });

  const searchQuery = ref("");

  const handleSearch = (value: string) => {
    searchQuery.value = value.toLowerCase().trim();
    demandStore.setSearchQuery(value);
  };

  const filteredPartners = computed(() => {
    if (!searchQuery.value) {
      return partners.value;
    }

    return partners.value.filter((partner) => {
      const query = searchQuery.value;

      // Search in partner name
      const nameMatch = partner.name?.toLowerCase().includes(query);

      // Search in institution name
      const institutionMatch = partner.details?.institution_name
        ?.toLowerCase()
        .includes(query);

      // Search in email
      const emailMatch = partner.email?.toLowerCase().includes(query);

      // Search in phone
      const phoneMatch =
        partner.phone?.toLowerCase().includes(query) ||
        partner.details?.contact_phone?.toLowerCase().includes(query);

      // Search in location
      const provinceMatch = partner.details?.province
        ?.toLowerCase()
        .includes(query);
      const regencyMatch = partner.details?.regency
        ?.toLowerCase()
        .includes(query);

      return (
        nameMatch ||
        institutionMatch ||
        emailMatch ||
        phoneMatch ||
        provinceMatch ||
        regencyMatch
      );
    });
  });

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (demandStore.selectedCommodities.length > 0) count++;
    if (demandStore.selectedLocations.length > 0) count++;
    if (demandStore.sortBy) count++;
    return count;
  });

  // Fetch commodities and collaborations for export
  const { data: commoditiesData } = useCommodities();
  const { data: collaborationsData } = useCollaborations();

  // Create maps for quick lookup
  const commoditiesMap = computed(() => {
    const map = new Map<number, string>();
    if (
      commoditiesData.value?.data &&
      Array.isArray(commoditiesData.value.data)
    ) {
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
    const data =
      collaborationsData.value && "data" in collaborationsData.value
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

  // Helper functions for export
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

  // Export to Excel function
  const handleExportToExcel = async () => {
    try {
      // Dynamically import xlsx library
      // Note: Suppress potential type error if types are missing (runtime use only)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const XLSX = await import("xlsx");

      // Limit to 100 partners
      const partnersToExport = filteredPartners.value.slice(0, 100);

      // Prepare data for Excel
      const excelData = partnersToExport.map((partner) => {
        return {
          "Nama Mitra": partner.name || "-",
          "Komoditas Minat": getCommodities(partner),
          "Bentuk Kerjasama": getCollaborations(partner),
          "Lokasi Target": getLocation(partner),
          "Kontak Mitra": getContact(partner),
          "Nomor WA Mitra": getWhatsAppNumber(partner) || "-",
        };
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Mitra");

      // Set column widths
      const columnWidths = [
        { wch: 30 }, // Nama Mitra
        { wch: 20 }, // Komoditas Minat
        { wch: 20 }, // Bentuk Kerjasama
        { wch: 20 }, // Lokasi Target
        { wch: 25 }, // Kontak Mitra
        { wch: 20 }, // Nomor WA Mitra
      ];
      worksheet["!cols"] = columnWidths;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Data_Mitra_${timestamp}.xlsx`;

      // Export file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert(
        "Failed to export to Excel. Please make sure the xlsx library is installed."
      );
    }
  };
</script>
