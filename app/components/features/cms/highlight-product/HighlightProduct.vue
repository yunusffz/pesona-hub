<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">Pengaturan Highlight</h1>
        <p class="text-[#6A7282] text-sm">
          Pilih maksimal 3 produk dan 3 wisata untuk ditampilkan di halaman
          utama
        </p>
      </div>
      <BaseButton class="py-0 px-4 text-sm h-9">Simpan Perubahan </BaseButton>
    </div>

    <div
      class="border border-[#C1C1C133] bg-[#EFF6FF80] p-4 flex gap-3 rounded-lg"
    >
      <div>
        <img
          src="/assets/images/highlight.svg"
          alt="highlight"
          width="40"
          height="40"
        />
      </div>
      <div class="flex flex-col gap-1">
        <h5 class="text-base font-semibold">Tips Highlight Produk</h5>
        <p class="text-[#4A5565] text-sm">
          Pilih produk unggulan dengan gambar menarik. Urutan dapat diatur
          dengan drag & drop. Produk yang di-highlight akan muncul di bagian
          atas homepage .
        </p>
      </div>
    </div>

    <Tabs v-model="activeTab" default-value="produk" class="gap-0 p-0">
      <div
        class="flex items-center justify-between border border-gray-100 rounded-xl"
      >
        <TabsList class="grid grid-cols-2 rounded-2xl w-[400px]">
          <TabsTrigger value="produk" class="rounded-xl"
            >Highlight Produk</TabsTrigger
          >
          <TabsTrigger value="ekowisata" class="rounded-xl"
            >Highlight Ekowisata</TabsTrigger
          >
        </TabsList>
      </div>

      <TabsContent value="produk" class="mt-4">
        <section>
          <div class="flex items-center justify-between">
            <SearchInput
              class="w-[290px] h-12"
              placeholder="Cari..."
              :onSearch="handleSearch"
            />
            <div class="flex items-center gap-2">
              <FilterSheet>
                <SheetTrigger as-child>
                  <BaseButton variant="solid" class="px-4 py-2">
                    <Icon name="uil:filter" class="w-4 h-4" />
                    Filter
                  </BaseButton>
                </SheetTrigger>
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
            <DataTable :products="filteredProducts" :isLoading="isLoading" />
          </div>
        </section>
      </TabsContent>

      <TabsContent value="ekowisata" class="mt-4">
        <section>
          <div class="grid grid-cols-3 gap-6 w-full">
            <div
              v-for="i in 3"
              :key="i"
              class="relative flex flex-col items-center justify-center gap-3 h-[411px] rounded-2xl border-2 border-dashed border-[#d1d5dc] p-0.5"
            >
              <div class="bg-[#f3f4f6] rounded-full size-12 flex items-center justify-center shrink-0">
                <svg class="size-6" fill="none" viewBox="0 0 24 24">
                  <path d="M5 12H19" stroke="#4A5565" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  <path d="M12 5V19" stroke="#4A5565" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="flex flex-col gap-1 items-center text-center">
                <p class="text-[#4a5565] text-base font-medium">Tambah Produk</p>
                <p class="text-[#4a5565] text-xs">tambah produk yang ingin disorot</p>
              </div>
            </div>
          </div>
        </section>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import SearchInput from "~/components/base/SearchInput.vue";
import DataTable from "~/components/features/dashboard/data-table/DataTable.vue";
import FilterSheet from "~/components/features/dashboard/filter/FilterSheet.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { SheetTrigger } from "~/components/ui/sheet";
import { useProducts } from "~/queries/useProducts";
import { useCatalogStore } from "~/stores/useCatalogStore";
import type { ProductWithRelations } from "~/types/product";

const activeTab = ref<"produk" | "ekowisata">("produk");
const searchQuery = ref("");

const catalogStore = useCatalogStore();

const filtersComputed = computed(() => catalogStore.filters);
const sortComputed = computed(() => (catalogStore as any).sortBy || undefined);

const { data, isLoading, refetch } = useProducts({
  get filters() {
    return {
      ...filtersComputed.value,
      product_category: {
        $eq: activeTab.value === "produk" ? "PRODUK" : "EKOWISATA",
      },
    };
  },
  get sort() {
    return sortComputed.value;
  },
  populate: [
    "commodity",
    "social_forestry_business_group",
    "social_forestry_business_group.location",
  ],
  fields: [
    "id",
    "name",
    "value_chain",
    "metadatas",
    "thumbnails",
    "capacity",
    "unit",
    "status",
  ],
});

watch(
  [filtersComputed, sortComputed, activeTab],
  () => {
    refetch();
  },
  { deep: true, flush: "post" }
);

watch(activeTab, () => {
  searchQuery.value = "";
});

const products = computed(() => {
  const list = (data.value as any)?.data;
  return Array.isArray(list) ? (list as unknown as ProductWithRelations[]) : [];
});

const handleSearch = (value: string) => {
  searchQuery.value = value.toLowerCase().trim();
};

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;

  const query = searchQuery.value;
  return products.value.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(query);
    const commodityMatch = (product as any).commodity?.name
      ?.toLowerCase()
      .includes(query);
    const valueChainMatch = product.value_chain?.toLowerCase().includes(query);
    const businessGroup = product.social_forestry_business_group as any;
    const regionMatch = businessGroup?.location?.province
      ?.toLowerCase()
      .includes(query);
    const kupsMatch = businessGroup?.name?.toLowerCase().includes(query);
    return (
      nameMatch || commodityMatch || valueChainMatch || regionMatch || kupsMatch
    );
  });
});

const handleExportToExcel = async () => {
  try {
    const XLSX = await import("xlsx");
    const excelData = filteredProducts.value.map((product) => {
      const businessGroup = product.social_forestry_business_group as any;
      return {
        "Nama Brand/Produk": product.name || "-",
        Komoditas: (product as any).commodity?.name || "-",
        "Kapasitas Penyediaan": product.capacity,
        Satuan: product.unit || "-",
        "Jenis Bahan": product.value_chain || "-",
        Wilayah: businessGroup?.location?.province || "-",
        "Nama KUPS": businessGroup?.name || "-",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    const sheetLabel = activeTab.value === "produk" ? "Produk" : "Ekowisata";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetLabel);
    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
    ];

    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Data_${sheetLabel}_${timestamp}.xlsx`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};
</script>
