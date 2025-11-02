<template>
  <div class="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
    <BigNumber
      number="1,108,74"
      title="Kapasitas Penyediaan"
      icon="uil:weight"
    />
    <BigNumber number="1,284" title="Jumlah Kelompok Tani/KUPS" />
    <BigNumber
      number="11"
      title="Jumlah Provinsi"
      description="Jumlah provinsi yang terintegrasi."
      icon="uil:map-marker-alt"
    />
    <BigNumber
      number="3,138,025,000"
      title="Nilai Transaksi Ekonomi"
      icon="uil:money-bill"
    />
  </div>
</template>
<script setup lang="ts">
  import BigNumber from "../big-number/BigNumber.vue";
</script>
