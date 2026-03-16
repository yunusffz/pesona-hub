<template>
  <div class="flex flex-col gap-8">
    <!-- Edit Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="p-0 border-none shadow-none bg-transparent max-w-fit [&>button:last-child]:hidden">
        <EditProduct :product="selectedProduct" @cancel="showEditModal = false" @submit="showEditModal = false" />
      </DialogContent>
    </Dialog>

    <div class="flex justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">Data Produk & Wisata</h1>
        <p class="text-[#6A7282] text-sm">
          Kelola katalog produk dan paket wisata KUPS
        </p>
      </div>
      <BaseButton class="py-2 px-4 text-sm">
        <Plus class="w-5" /> Tambah Produk
      </BaseButton>
    </div>

    <Tabs
      v-model="activeTab"
      default-value="produk"
      class="gap-0 bg-white rounded-xl"
    >
      <div
        class="flex items-center justify-between p-4 border border-[#E4E4E7] rounded-t-xl"
      >
        <TabsList class="grid grid-cols-2 rounded-2xl w-[200px]">
          <TabsTrigger value="produk" class="rounded-xl">Produk</TabsTrigger>
          <TabsTrigger value="ekowisata" class="rounded-xl"
            >Ekowisata</TabsTrigger
          >
        </TabsList>

        <FilterSheet>
          <SheetTrigger as-child>
            <BaseButton variant="solid" class="px-4 py-2">
              <Icon name="uil:filter" class="w-4 h-4" />
              Filter
            </BaseButton>
          </SheetTrigger>
        </FilterSheet>
      </div>

      <TabsContent
        value="produk"
        class="p-8 border border-[#E4E4E7] rounded-b-xl border-t-0"
      >
        <section>
          <div class="flex items-center justify-between">
            <SearchInput
              class="w-[290px] h-12"
              placeholder="Cari..."
              :onSearch="handleSearch"
            />
            <div class="flex items-center gap-2">
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
            <CmsDataTable :products="filteredProducts" :isLoading="isLoading" @edit="openEditModal" />
          </div>
        </section>
      </TabsContent>

      <TabsContent
        value="ekowisata"
        class="p-8 border border-[#E4E4E7] rounded-b-xl border-t-0"
      >
        <section>
          <div class="flex items-center justify-between">
            <SearchInput
              class="w-[290px] h-12"
              placeholder="Cari..."
              :onSearch="handleSearch"
            />
            <div class="flex items-center gap-2">
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
            <CmsDataTable :products="filteredProducts" :isLoading="isLoading" @edit="openEditModal" />
          </div>
        </section>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Plus } from "lucide-vue-next";
import BaseButton from "~/components/base/BaseButton.vue";
import SearchInput from "~/components/base/SearchInput.vue";
import CmsDataTable from "~/components/features/cms/product/DataTable.vue";
import EditProduct from "~/components/features/cms/product/EditProduct.vue";
import FilterSheet from "~/components/features/dashboard/filter/FilterSheet.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { SheetTrigger } from "~/components/ui/sheet";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useProducts } from "~/queries/useProducts";
import { useCatalogStore } from "~/stores/useCatalogStore";
import type { ProductWithRelations } from "~/types/product";

const activeTab = ref<"produk" | "ekowisata">("produk");
const searchQuery = ref("");
const showEditModal = ref(false);
const selectedProduct = ref<ProductWithRelations | null>(null);

const openEditModal = (product: ProductWithRelations) => {
  selectedProduct.value = product;
  showEditModal.value = true;
};

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
    "product_category",
    "description",
    "product_usage",
    "price",
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
