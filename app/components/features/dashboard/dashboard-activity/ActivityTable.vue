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
  import { createStrapiFilters } from "~/utils/strapi";

  interface Props {
    startDate?: string;
    endDate?: string;
  }

  const props = defineProps<Props>();

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

  // Create computed filters based on date range
  const dateFilters = computed(() => {
    if (!props.startDate && !props.endDate) {
      console.log("No filters applied");
      return undefined;
    }

    const filter: any = {
      created_at: {},
    };

    if (props.startDate) {
      filter.created_at.$gte = props.startDate;
    }

    if (props.endDate) {
      filter.created_at.$lte = props.endDate;
    }

    return filter;
  });
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
    filters: () => dateFilters.value,
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
    const eventType = log.event_type || "";
    const entityType = log.entity_type || "";
    const action = log.extra_data?.action || "";

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

  // Export to Excel function
  const handleExportToExcel = async () => {
    try {
      // Dynamically import xlsx library
      const XLSX = await import("xlsx");

      // Limit to 100 logs
      const logsToExport = filteredLogs.value.slice(0, 100);

      // Prepare data for Excel with all attributes split into columns
      const excelData = logsToExport.map((log) => {
        return {
          Waktu: formatDateTimeIndonesian(log.created_at || log.createdAt),
          Aktivitas: getActivity(log),
          "Nama Produk": log.extra_data?.product_name || "-",
          "Deskripsi Produk": log.extra_data?.product_description || "-",
          "Kategori Produk": log.extra_data?.product_category || "-",
          "Kegunaan Produk": log.extra_data?.product_usage || "-",
          "Harga Produk": log.extra_data?.product_price || "-",
          "Satuan Produk": log.extra_data?.product_unit || "-",
          "Jumlah Produk": log.extra_data?.product_quantity || "-",
          "Total Harga": log.extra_data?.total_price || "-",
          "ID Produk": log.extra_data?.product_id || "-",
          "Nama Komoditas": log.extra_data?.commodity_name || "-",
          "Nama KUPS": log.extra_data?.kups_name || "-",
          "Kelas KUPS": log.extra_data?.kups_class || "-",
          "Kontak KUPS": log.extra_data?.kups_contact || "-",
          "Nama Mitra": log.extra_data?.user_name || "-",
          "Email Mitra": log.extra_data?.user_email || "-",
          "Telepon Mitra": log.extra_data?.user_phone || "-",
        };
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Log Aktivitas");

      // Set column widths for all columns
      const columnWidths = [
        { wch: 20 }, // Waktu
        { wch: 25 }, // Aktivitas
        { wch: 35 }, // Pesan
        { wch: 15 }, // Tipe Event
        { wch: 15 }, // Tipe Entitas
        { wch: 15 }, // Tipe Akses
        { wch: 10 }, // Entity ID
        { wch: 15 }, // Entity Slug
        { wch: 40 }, // Nama Produk
        { wch: 50 }, // Deskripsi Produk
        { wch: 20 }, // Kategori Produk
        { wch: 25 }, // Kegunaan Produk
        { wch: 15 }, // Harga Produk
        { wch: 12 }, // Satuan Produk
        { wch: 15 }, // Jumlah Produk
        { wch: 15 }, // Total Harga
        { wch: 10 }, // ID Produk
        { wch: 20 }, // Nama Komoditas
        { wch: 12 }, // ID Komoditas
        { wch: 30 }, // Nama KUPS
        { wch: 12 }, // Kelas KUPS
        { wch: 20 }, // Kontak KUPS
        { wch: 10 }, // ID KUPS
        { wch: 30 }, // Nama Mitra
        { wch: 25 }, // Email Mitra
        { wch: 20 }, // Telepon Mitra
        { wch: 10 }, // ID Mitra
        { wch: 10 }, // User ID
        { wch: 15 }, // IP Address
        { wch: 60 }, // User Agent
        { wch: 10 }, // Method
        { wch: 25 }, // Endpoint
        { wch: 40 }, // Referer
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
