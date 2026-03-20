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
import { useHighlights } from "~/queries/useHighlights";
import type { ProductWithRelations } from "~/types/product";

const { data: highlightsData, isLoading } = useHighlights();

const products = computed((): ProductWithRelations[] => {
  if (!highlightsData.value) return [];
  return highlightsData.value
    .filter((h) => (h.product as any)?.product_category === "PRODUK")
    .sort((a, b) => a.order - b.order)
    .map((h) => h.product as ProductWithRelations)
    .filter(Boolean);
});

const title = "Produk Premium Perhutanan Sosial";
const description =
  "Temukan pilihan produk berkualitas tinggi yang dihasilkan langsung oleh kelompok masyarakat pengelola hutan. Setiap produk tidak hanya bernilai ekonomi, tetapi juga menjaga kelestarian alam dan budaya.";
const link = "/katalog";
const linkText = "Lihat Semua Produk Premium";
const label = "Katalog Produk";
const detailLinkText = "Lihat Detail Produk";
</script>
