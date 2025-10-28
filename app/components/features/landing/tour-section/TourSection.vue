<template>
  <section>
    <CatalogHeader
      :title="title"
      :description="description"
      :link="link"
      :linkText="linkText"
      :label="label"
    />
    <CatalogContent
      :products="products"
      :linkText="detailLinkText"
      :isLoading="isLoading"
    />
  </section>
</template>

<script setup lang="ts">
  import CatalogContent from "~/components/common/catalog-section/CatalogContent.vue";
  import CatalogHeader from "~/components/common/catalog-section/CatalogHeader.vue";
  import { useProducts } from "~/queries";
  import type { ProductWithRelations } from "~/types/product";
  const { data, isLoading } = useProducts({
    page: 2,
    limit: 3,
    populate: [
      "social_forestry_business_group.contact",
      "social_forestry_group",
    ],
    fields: [
      "id",
      "name",
      "description",
      "price",
      "unit",
      "product_usage",
      "thumbnails",
    ],
  });

  const products = computed(() => {
    const productsData = data.value?.data;
    if (Array.isArray(productsData)) {
      return productsData as unknown as ProductWithRelations[];
    }
    return [] as ProductWithRelations[];
  });

  const title = "Ekowisata Berbasis Masyarakat";
  const description =
    "Nikmati pengalaman wisata berkelanjutan yang dikelola langsung oleh komunitas lokal untuk mendukung pelestarian alam dan ekonomi masyarakat.";
  const link = "/katalog";
  const linkText = "Lihat Semua Ekowisata";
  const label = "Katalog Wisata";
  const detailLinkText = "Lihat Potensi Kemitraan";
</script>
