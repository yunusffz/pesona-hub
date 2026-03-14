<template>
  <div class="flex flex-col gap-8">
    <div class="flex justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-xl text-[#101828]">Data Produk & Wisata</h1>
        <p class="text-[#6A7282] text-sm">
          Kelola katalog produk dan paket wisata KUPS
        </p>
      </div>
      <BaseButton class="py-2 px-4 text-sm">
        <Plus class="w-5" /> Tambah Produk</BaseButton
      >
    </div>

    <Tabs v-model="activeTab" default-value="produk" class="gap-0">
      <div class="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
        <TabsList class="grid grid-cols-2 rounded-2xl w-[200px]">
          <TabsTrigger value="produk" class="rounded-xl"> Produk </TabsTrigger>
          <TabsTrigger value="ekowisata" class="rounded-xl"> Ekowisata </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="produk" class="mt-4">
        <div v-if="isLoading" class="py-8 text-center text-gray-400">Memuat data...</div>
        <div v-else-if="products.length === 0" class="py-8 text-center text-gray-400">Tidak ada data produk.</div>
        <table v-else class="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
          <thead class="bg-gray-50 text-[#6A7282]">
            <tr>
              <th class="px-4 py-3 text-left font-medium">Nama Produk</th>
              <th class="px-4 py-3 text-left font-medium">Kategori</th>
              <th class="px-4 py-3 text-left font-medium">Harga</th>
              <th class="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product.id"
              class="border-t border-gray-100 hover:bg-gray-50"
            >
              <td class="px-4 py-3 font-medium text-[#101828]">{{ product.name }}</td>
              <td class="px-4 py-3 text-[#6A7282]">{{ product.product_category ?? '-' }}</td>
              <td class="px-4 py-3 text-[#6A7282]">{{ product.price != null ? `Rp ${product.price.toLocaleString('id-ID')}` : '-' }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="product.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ product.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </TabsContent>

      <TabsContent value="ekowisata" class="mt-4">
        <div v-if="isLoading" class="py-8 text-center text-gray-400">Memuat data...</div>
        <div v-else-if="products.length === 0" class="py-8 text-center text-gray-400">Tidak ada data ekowisata.</div>
        <table v-else class="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
          <thead class="bg-gray-50 text-[#6A7282]">
            <tr>
              <th class="px-4 py-3 text-left font-medium">Nama Wisata</th>
              <th class="px-4 py-3 text-left font-medium">Kategori</th>
              <th class="px-4 py-3 text-left font-medium">Harga</th>
              <th class="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product.id"
              class="border-t border-gray-100 hover:bg-gray-50"
            >
              <td class="px-4 py-3 font-medium text-[#101828]">{{ product.name }}</td>
              <td class="px-4 py-3 text-[#6A7282]">{{ product.product_category ?? '-' }}</td>
              <td class="px-4 py-3 text-[#6A7282]">{{ product.price != null ? `Rp ${product.price.toLocaleString('id-ID')}` : '-' }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="product.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ product.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Plus } from "lucide-vue-next";
import BaseButton from "~/components/base/BaseButton.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { useProducts } from "~/queries/useProducts";

const activeTab = ref<"produk" | "ekowisata">("produk");

const { data, isLoading } = useProducts({
  filters: () => ({
    product_category: { $eq: activeTab.value === "produk" ? "PRODUK" : "EKOWISATA" },
  }),
});

const products = computed(() => {
  const list = (data.value as any)?.data;
  return Array.isArray(list) ? list : [];
});
</script>
