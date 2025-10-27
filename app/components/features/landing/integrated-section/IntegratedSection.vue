<template>
  <section class="flex flex-col xl:gap-20 gap-10">
    <CatalogHeader :title="title" :description="description" :label="label" />
    <IntegratedList />
  </section>
</template>

<script setup lang="ts">
  import CatalogHeader from "~/components/common/catalog-section/CatalogHeader.vue";
  import IntegratedList from "./IntegratedList.vue";

  const title = "Wilayah & Sistem yang Terintegrasi";
  const description =
    "Pesona Hub Digi terhubung langsung dengan berbagai platform dan pemerintah daerah untuk memastikan verifikasi, pendampingan, serta validasi produk Perhutanan sosial di seluruh Indonesia.";

  const label = "Terintegrasi";
</script>
