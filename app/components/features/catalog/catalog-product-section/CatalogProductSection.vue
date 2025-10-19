<template>
  <section
    class="relative -mx-[calc((100vw-1536px)/2)] px-[calc((100vw-1536px)/2)]"
  >
    <div class="bg-[#FAFAFA] absolute inset-0"></div>
    <div class="relative py-[60px] flex flex-col gap-10 px-20">
      <CatalogHeader
        :title="title"
        :description="description"
        descriptionClass="text-[#8E8E8E]"
      />
      <FilterSection />
      <ListProductSection />
    </div>
  </section>
</template>

<script setup lang="ts">
  import FilterSection from "./FilterSection.vue";
  import CatalogHeader from "~/components/common/catalog-section/CatalogHeader.vue";
  import ListProductSection from "./ListProductSection.vue";
  const title = "Semua Produk dan Wisata";
  const description =
    "Temukan beragam produk unggulan dan destinasi wisata dari masyarakat kehutanan sosial di seluruh Indonesia.";
</script>
