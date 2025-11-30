<template>
  <div class="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
    <BigNumber
      :number="formatStatNumber(statistics.productsCount.value)"
      title="Jumlah Produk/Wisata"
      icon="uil:weight"
      :loading="statistics.isLoadingProducts.value"
      clickable
      @click="openProductDetailModal"
    />
    <BigNumber
      :number="formatStatNumber(statistics.kupsCount.value)"
      title="Jumlah Kelompok Tani/KUPS"
      :loading="statistics.isLoadingKups.value"
    />
    <BigNumber
      :number="formatStatNumber(statistics.provincesCount.value)"
      title="Jumlah Provinsi"
      description="Jumlah provinsi yang terintegrasi."
      icon="uil:map-marker-alt"
      :loading="statistics.isLoadingLocations.value"
    />
    <BigNumber
      number="3,138,025,000"
      title="Nilai Transaksi Ekonomi"
      icon="uil:money-bill"
      :loading="economicStats.isLoading.value"
    />
  </div>

  <ProductDetailModal
    v-model:open="isProductDetailModalOpen"
    :total-count="formatStatNumber(statistics.productsCount.value)"
  />
</template>
<script setup lang="ts">
  import BigNumber from "../big-number/BigNumber.vue";
  import ProductDetailModal from "./ProductDetailModal.vue";
  import {
    useStatistics,
    useEconomicStatistics,
    formatStatNumber,
  } from "~/composables/useStatistics";

  const statistics = useStatistics();
  const economicStats = useEconomicStatistics();

  const isProductDetailModalOpen = ref(false);

  const openProductDetailModal = () => {
    isProductDetailModalOpen.value = true;
  };
</script>
