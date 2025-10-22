<template>
  <section
    class="grid grid-cols-1 lg:grid-cols-3 gap-[74px] px-4 2xl:px-20 lg:px-10 py-20 sm:py-[120px] lg:py-0"
  >
    <StatisticContent
      number="500+"
      title="Produk kehutanan sosial terdaftar"
      description="Madu, kopi, kayu, dan kerajinan dari berbagai KUPS di seluruh Indonesia."
    />
    <StatisticContent
      number="15+"
      title="Balai PS & KPH yang terlibat"
      description="Terhubung dengan lebih dari 15 Balai PS & KPH untuk validasi langsung dari lapangan."
    />
    <StatisticContent
      number="98%"
      title="Produk terverifikasi kualitasnya"
      description="Hampir semua produk telah lolos proses verifikasi standar mutu."
    />
  </section>
</template>

<script setup lang="ts">
  import StatisticContent from "./StatisticContent.vue";
</script>
