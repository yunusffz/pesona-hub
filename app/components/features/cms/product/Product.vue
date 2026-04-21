<template>
  <div class="flex flex-col gap-8">
    <!-- Add Modal -->
    <Dialog v-model:open="showAddModal">
      <DialogContent
        class="p-0 border-none shadow-none bg-transparent max-w-fit [&>button:last-child]:hidden"
      >
        <EditProduct
          @cancel="showAddModal = false"
          @submit="onSubmit('add')"
        />
      </DialogContent>
    </Dialog>

    <!-- Edit Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent
        class="p-0 border-none shadow-none bg-transparent max-w-fit [&>button:last-child]:hidden"
      >
        <EditProduct
          :product="selectedProduct"
          @cancel="showEditModal = false"
          @submit="onSubmit('edit')"
        />
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Modal -->
    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="max-w-sm [&>button:last-child]:hidden">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="font-semibold text-lg text-[#1e1e1e]">Hapus Produk</h2>
            <p class="text-sm text-[#6a7282]">
              Apakah Anda yakin ingin menghapus produk
              <span class="font-medium text-[#1e1e1e]">{{ selectedProduct?.name }}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="flex justify-end gap-3">
            <BaseButton
              variant="secondary"
              class="h-9 px-4 rounded-2xl text-sm border border-[#e7efea] text-[#1e1e1e]"
              @click="showDeleteModal = false"
            >
              Batal
            </BaseButton>
            <BaseButton
              class="h-9 px-4 rounded-2xl text-sm bg-red-600 hover:bg-red-700 text-white"
              :disabled="isDeletePending"
              @click="handleDelete"
            >
              {{ isDeletePending ? "Menghapus..." : "Hapus" }}
            </BaseButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>


    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">Data Produk & Wisata</h1>
        <p class="text-[#6A7282] text-sm">
          Kelola katalog produk dan paket wisata KUPS
        </p>
      </div>
      <BaseButton
        v-if="appConfig.cms.product.canCreate"
        class="py-2 px-4 text-sm w-full sm:w-auto"
        @click="showAddModal = true"
      >
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
        class="p-4 lg:p-8 border border-[#E4E4E7] rounded-b-xl border-t-0"
      >
        <section>
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <SearchInput
              class="w-full sm:w-[290px] h-12"
              placeholder="Cari..."
              :onSearch="handleSearch"
            />
            <div class="flex items-center gap-2">
              <BaseButton
                variant="solid"
                class="px-3 py-2 text-sm w-full sm:w-auto"
                @click="handleExportToExcel"
              >
                <Icon name="uil:file-export" class="w-4 h-4" />
                Export
              </BaseButton>
            </div>
          </div>
          <div class="mt-4">
            <CmsDataTable
              :products="filteredProducts"
              :isLoading="isLoading"
              @edit="openEditModal"
              @delete="openDeleteModal"
            />
          </div>
        </section>
      </TabsContent>

      <TabsContent
        value="ekowisata"
        class="p-4 lg:p-8 border border-[#E4E4E7] rounded-b-xl border-t-0"
      >
        <section>
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <SearchInput
              class="w-full sm:w-[290px] h-12"
              placeholder="Cari..."
              :onSearch="handleSearch"
            />
            <div class="flex items-center gap-2">
              <BaseButton
                variant="solid"
                class="px-3 py-2 text-sm w-full sm:w-auto"
                @click="handleExportToExcel"
              >
                <Icon name="uil:file-export" class="w-4 h-4" />
                Export
              </BaseButton>
            </div>
          </div>
          <div class="mt-4">
            <CmsDataTable
              :products="filteredProducts"
              :isLoading="isLoading"
              @edit="openEditModal"
              @delete="openDeleteModal"
            />
          </div>
        </section>
      </TabsContent>
    </Tabs>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-4 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-4 opacity-0"
      >
        <div
          v-if="showToast"
          class="fixed top-5 right-5 z-[9999] flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg"
          style="background-color: #e8f5ee"
        >
          <div
            class="h-5 w-5 shrink-0 rounded-full flex items-center justify-center"
            style="background-color: #035925"
          >
            <Check class="h-3 w-3 text-white" :stroke-width="3" />
          </div>
          <span class="text-sm font-medium" style="color: #035925">
            {{ toastMessage }}
          </span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Plus, Check } from "lucide-vue-next";
import { useCmsToast } from "~/composables/useCmsToast";
import BaseButton from "~/components/base/BaseButton.vue";
import SearchInput from "~/components/base/SearchInput.vue";
import CmsDataTable from "~/components/features/cms/product/DataTable.vue";
import EditProduct from "~/components/features/cms/product/EditProduct.vue";
import FilterSheet from "~/components/features/dashboard/filter/FilterSheet.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { SheetTrigger } from "~/components/ui/sheet";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useProducts, useDeleteProduct } from "~/queries/useProducts";
import { useCatalogStore } from "~/stores/useCatalogStore";
import type { ProductWithRelations } from "~/types/product";

const appConfig = useAppConfig();

const activeTab = ref<"produk" | "ekowisata">("produk");
const searchQuery = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedProduct = ref<ProductWithRelations | null>(null);
const { showToast, toastMessage, show: showCmsToast } = useCmsToast();

const onSubmit = (type: "add" | "edit") => {
  if (type === "add") showAddModal.value = false;
  else showEditModal.value = false;
  showCmsToast(type === "add" ? "Produk berhasil ditambahkan" : "Produk berhasil diperbarui");
};

const openEditModal = (product: ProductWithRelations) => {
  selectedProduct.value = product;
  showEditModal.value = true;
};

const openDeleteModal = (product: ProductWithRelations) => {
  selectedProduct.value = product;
  showDeleteModal.value = true;
};

const { mutateAsync: deleteProduct, isPending: isDeletePending } = useDeleteProduct();

const handleDelete = async () => {
  if (!selectedProduct.value?.id) return;
  await deleteProduct(selectedProduct.value.id);
  showDeleteModal.value = false;
  showCmsToast("Produk berhasil dihapus");
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
