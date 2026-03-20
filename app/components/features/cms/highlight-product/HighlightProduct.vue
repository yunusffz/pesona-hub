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
      <BaseButton
        class="py-0 px-4 text-sm h-9"
        :disabled="isSaving"
        @click="saveChanges"
      >
        <LoaderCircle v-if="isSaving" class="animate-spin h-4 w-4" />
        {{ isSaving ? "Menyimpan Perubahan..." : "Simpan Perubahan" }}
      </BaseButton>
    </div>

    <HighlightTips />

    <Tabs v-model="activeTab" default-value="produk" class="gap-0 p-0">
      <div class="flex items-center justify-between rounded-xl p-1">
        <TabsList class="grid grid-cols-2 rounded-2xl w-[400px]">
          <TabsTrigger value="produk" class="rounded-xl"
            >Highlight Produk {{ highlightedProducts.length }}/3</TabsTrigger
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
          <div class="h-5 w-5 shrink-0 rounded-full flex items-center justify-center" style="background-color: #035925">
              <Check class="h-3 w-3 text-white" :stroke-width="3" />
            </div>
          <span class="text-sm font-medium" style="color: #035925">
            Perubahan berhasil disimpan
          </span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { LoaderCircle, Check } from "lucide-vue-next";
import draggable from "vuedraggable";
import BaseButton from "~/components/base/BaseButton.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import HighlightTips from "./HighlightTips.vue";
import HighlightAddCard from "./HighlightAddCard.vue";
import HighlightProductCard from "./HighlightProductCard.vue";
import AddProductModal from "./AddProductModal.vue";
import type { ProductWithRelations } from "~/types/product";
import {
  useHighlights,
  useCreateHighlight,
  useDeleteHighlight,
} from "~/queries/useHighlights";

const activeTab = ref<"produk" | "ekowisata">("produk");
const isModalOpen = ref(false);
const highlightedProducts = ref<ProductWithRelations[]>([]);
const isSaving = ref(false);
const showToast = ref(false);

const { data: highlightsData } = useHighlights();
const { mutateAsync: createHighlight } = useCreateHighlight();
const { mutateAsync: deleteHighlight } = useDeleteHighlight();

watch(
  highlightsData,
  (highlights) => {
    if (!highlights) return;
    highlightedProducts.value = highlights
      .sort((a, b) => a.order - b.order)
      .map((h) => h.product as ProductWithRelations)
      .filter(Boolean);
  },
  { immediate: true }
);

const selectProduct = (product: ProductWithRelations) => {
  if (highlightedProducts.value.length >= 3) return;
  if (highlightedProducts.value.some((p) => p.id === product.id)) return;
  highlightedProducts.value.push(product);
};

const removeProduct = (id: number) => {
  highlightedProducts.value = highlightedProducts.value.filter(
    (p) => p.id !== id
  );
};

const saveChanges = async () => {
  isSaving.value = true;
  try {
    const currentHighlights = highlightsData.value ?? [];
    await Promise.all(currentHighlights.map((h) => deleteHighlight(h.id)));
    await Promise.all(
      highlightedProducts.value.map((product, index) =>
        createHighlight({ product_id: product.id!, order: index + 1 })
      )
    );
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  } finally {
    isSaving.value = false;
  }
};
</script>
