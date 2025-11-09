<template>
  <section>
    <div class="flex items-center justify-between">
      <SearchInput
        class="w-[290px] h-9"
        placeholder="Cari..."
        :onSearch="handleSearch"
      />
      <BaseButton
        variant="solid"
        class="pr-2 px-3 py-2 justify-between text-sm"
        @click="handleExportToExcel"
      >
        <Icon name="uil:file-export" class="w-4 h-4" />
        Export
      </BaseButton>
    </div>
    <div class="mt-4">
      <ActivityDataTable
        :logs="filteredLogs"
        :isLoading="isLoading"
        class="text-xs"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import SearchInput from "~/components/base/SearchInput.vue";
  import BaseButton from "~/components/base/BaseButton.vue";
  import ActivityDataTable from "./ActivityDataTable.vue";
  import { useActivityLogs } from "~/queries/useActivityLogs";
  import { computed, ref } from "vue";
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

  const { data, isLoading, refetch } = useActivityLogs({
    populate: ["product", "user", "product.social_forestry_business_group"],
    fields: [
      "id",
      "created_at",
      "event_type",
      "entity_type",
      "entity_id",
      "extra_data",
    ],
    sort: "created_at:desc",
  });

  const logs = computed(() => {
    const logsData = data.value?.data;
    if (Array.isArray(logsData)) {
      return logsData as unknown as ActivityLog[];
    }
    return [] as ActivityLog[];
  });

  const searchQuery = ref("");

  const handleSearch = (value: string) => {
    searchQuery.value = value.toLowerCase().trim();
  };

  const filteredLogs = computed(() => {
    if (!searchQuery.value) {
      return logs.value;
    }

    return logs.value.filter((log) => {
      const query = searchQuery.value;

      // Search in activity description
      const activityMatch = getActivity(log).toLowerCase().includes(query);

      // Search in product name
      const productMatch = getProductName(log).toLowerCase().includes(query);

      // Search in KUPS contact
      const kupsContactMatch = getKupsContact(log)
        .toLowerCase()
        .includes(query);

      // Search in partner name
      const mitraNameMatch = getMitraName(log).toLowerCase().includes(query);

      // Search in partner contact
      const mitraContactMatch = getMitraContact(log)
        .toLowerCase()
        .includes(query);

      return (
        activityMatch ||
        productMatch ||
        kupsContactMatch ||
        mitraNameMatch ||
        mitraContactMatch
      );
    });
  });

  // Helper functions (same as in ActivityDataTable)
  const getActivity = (log: ActivityLog): string => {
    const eventType = log.event_type || log.extra_data?.event_type || "";
    const entityType = log.entity_type || log.extra_data?.entity_type || "";

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

    const eventText =
      eventTypeMap[eventType.toLowerCase()] || eventType || "Aktivitas";
    const entityText =
      entityTypeMap[entityType.toLowerCase()] || entityType || "";

    return entityText ? `${eventText} ${entityText}` : eventText;
  };

  const getProductName = (log: ActivityLog): string => {
    const extraData = log.extra_data || {};
    const productName =
      extraData.product_name ||
      extraData.product?.name ||
      (log as any).product?.name ||
      "-";

    return productName || "-";
  };

  const getKupsContact = (log: ActivityLog): string => {
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

  // Export to Excel function
  const handleExportToExcel = async () => {
    try {
      // Dynamically import xlsx library
      const XLSX = await import("xlsx");

      // Limit to 100 logs
      const logsToExport = filteredLogs.value.slice(0, 100);

      // Prepare data for Excel
      const excelData = logsToExport.map((log) => {
        return {
          Waktu: formatDateTimeIndonesian(log.created_at || log.createdAt),
          Aktivitas: getActivity(log),
          "Nama Produk": getProductName(log),
          "Kontak KUPS": getKupsContact(log),
          Mitra: getMitraName(log),
          "Kontak Mitra": getMitraContact(log),
        };
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Log Aktivitas");

      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Waktu
        { wch: 25 }, // Aktivitas
        { wch: 30 }, // Nama Produk
        { wch: 25 }, // Kontak KUPS
        { wch: 30 }, // Mitra
        { wch: 25 }, // Kontak Mitra
      ];
      worksheet["!cols"] = columnWidths;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Log_Aktivitas_${timestamp}.xlsx`;

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
