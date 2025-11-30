<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      class="sm:max-w-2xl sm:w-[600px] max-h-[80vh] overflow-y-auto"
    >
      <DialogHeader>
        <DialogTitle>Top 8 Komoditas</DialogTitle>
        <DialogDescription>
          Detail kapasitas penyediaan untuk 8 komoditas teratas
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div
          class="border border-[#174C3633] text-[#174C36] rounded-xl bg-[#F7FFF7] p-3.5 flex gap-6"
        >
          <div>
            <Box :size="16" />
          </div>
          <div class="text-sm flex flex-col gap-2.5 flex-1">
            <div class="font-semibold">Multiple Satuan:</div>
            <p>
              Komoditas dapat memiliki berbagai satuan (kg, liter, butir, unit)
              tergantung bentuk produk — bahan mentah, setengah jadi, atau bahan
              jadi.
            </p>
          </div>
        </div>

        <!-- Commodities Table -->
        <div class="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <!-- Table Header -->
          <div
            class="bg-[#F4F4F5] px-4 py-3 flex items-center border-b border-[#E4E4E7]"
          >
            <div class="w-6"></div>
            <div class="flex-1 text-xs font-semibold text-neutral-600">
              Komoditas
            </div>
            <div
              class="w-24 text-center text-xs font-semibold text-neutral-600"
            >
              Kapasitas
            </div>
            <div
              class="w-32 text-center text-xs font-semibold text-neutral-600"
            >
              Satuan
            </div>
            <div
              class="w-24 text-center text-xs font-semibold text-neutral-600"
            >
              Jumlah KUPS
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="py-8 text-center text-sm text-neutral-500"
          >
            Memuat data...
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="py-8 text-center text-sm text-red-500">
            Gagal memuat data komoditas
          </div>

          <!-- Table Rows -->
          <div v-else-if="commodities.length > 0">
            <CommodityRow
              v-for="commodity in commodities"
              :key="commodity.commodity"
              :commodity="commodity"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="py-8 text-center text-sm text-neutral-500">
            Tidak ada data komoditas
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="isOpen = false"> Tutup </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { Box } from "lucide-vue-next";
  import CommodityRow from "./CommodityRow.vue";
  import { useCommoditiesPriority } from "~/composables/useCommoditiesPriority";

  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "~/components/ui/dialog";
  import { Button } from "~/components/ui/button";

  interface Props {
    totalCount?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    totalCount: "0",
  });

  const isOpen = defineModel<boolean>("open", { default: false });

  const { commodities, isLoading, error } = useCommoditiesPriority();
</script>
