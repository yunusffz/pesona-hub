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
      <BaseButton class="py-0 px-4 text-sm h-9">Simpan Perubahan</BaseButton>
    </div>

    <HighlightTips />

    <Tabs v-model="activeTab" default-value="produk" class="gap-0 p-0">
      <div class="flex items-center justify-between rounded-xl p-1">
        <TabsList class="grid grid-cols-2 rounded-2xl w-[400px]">
          <TabsTrigger value="produk" class="rounded-xl"
            >Highlight Produk 0/3</TabsTrigger
          >
          <TabsTrigger value="ekowisata" class="rounded-xl"
            >Highlight Ekowisata 0/3</TabsTrigger
          >
        </TabsList>
      </div>

      <TabsContent value="produk" class="mt-4 flex gap-5">
        <draggable
          v-model="highlightedProducts"
          item-key="id"
          handle=".drag-handle"
          :animation="200"
          class="flex gap-5"
        >
          <template #item="{ element }">
            <HighlightProductCard
              :product="element"
              @remove="removeProduct(element.id!)"
            />
          </template>
        </draggable>
        <HighlightAddCard
          v-for="i in 3 - highlightedProducts.length"
          :key="'add-' + i"
          @click="isModalOpen = true"
        />
      </TabsContent>

      <TabsContent value="ekowisata" class="mt-4" />
    </Tabs>

    <AddProductModal
      v-model:open="isModalOpen"
      :category="activeTab === 'produk' ? 'PRODUK' : 'EKOWISATA'"
      @select="selectProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";
import BaseButton from "~/components/base/BaseButton.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import HighlightTips from "./HighlightTips.vue";
import HighlightAddCard from "./HighlightAddCard.vue";
import HighlightProductCard from "./HighlightProductCard.vue";
import AddProductModal from "./AddProductModal.vue";
import type { ProductWithRelations } from "~/types/product";

const activeTab = ref<"produk" | "ekowisata">("produk");
const isModalOpen = ref(false);
const highlightedProducts = ref<ProductWithRelations[]>([]);


const selectProduct = (product: ProductWithRelations) => {
  if (highlightedProducts.value.length >= 3) return;
  if (highlightedProducts.value.some((p) => p.id === product.id)) return;
  highlightedProducts.value.push(product);
};

const removeProduct = (id: number) => {
  highlightedProducts.value = highlightedProducts.value.filter((p) => p.id !== id);
};
</script>
