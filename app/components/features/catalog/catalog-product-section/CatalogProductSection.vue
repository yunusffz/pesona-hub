<template>
  <section class="p-20 bg-[#FAFAFA] flex flex-col gap-[60px]">
    <div class="py-[60px] flex flex-col gap-10">
      <CatalogHeader
        :title="title"
        :description="description"
        descriptionClass="text-[#8E8E8E]"
      />
      <FilterSection />
    </div>
  </section>
</template>

<script setup lang="ts">
  import FilterSection from "./FilterSection.vue";
  import CatalogHeader from "~/components/common/catalog-section/CatalogHeader.vue";
  const title = "Semua Produk dan Wisata";
  const description =
    "Temukan beragam produk unggulan dan destinasi wisata dari masyarakat kehutanan sosial di seluruh Indonesia.";
</script>
