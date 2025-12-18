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

type ExtendedProduct = ProductWithRelations & {
  social_forestry_business_group?: {
    contact?: {
      chief_contact: string;
    };
    location?: {
      province: string;
    };
    name?: string;
    class_group?: string;
  };
  social_forestry_group?: {
    name?: string;
  };
};

const { data, isLoading } = useProducts({
  page: 1,
  limit: 3,
  populate: ["social_forestry_business_group.contact", "social_forestry_group"],
  fields: [
    "id",
    "name",
    "description",
    "price",
    "unit",
    "product_usage",
    "product_category",
    "thumbnails",
  ],
  filters: {
    social_forestry_business_group: {
      class_group: {
        $eq: "PLATINUM",
      },
    },
    product_category: {
      $ne: "JASLING",
    },
  },
  sort: "thumbnails:desc",
});

const products = computed(() => {
  const productsData = data.value?.data;
  if (Array.isArray(productsData)) {
    return productsData as unknown as ExtendedProduct[];
  }
  return [] as ExtendedProduct[];
});

const title = "Produk Premium Perhutanan Sosial";
const description =
  "Temukan pilihan produk berkualitas tinggi yang dihasilkan langsung oleh kelompok masyarakat pengelola hutan. Setiap produk tidak hanya bernilai ekonomi, tetapi juga menjaga kelestarian alam dan budaya.";
const link = "/katalog";
const linkText = "Lihat Semua Produk Premium";
const label = "Katalog Produk";
const detailLinkText = "Lihat Detail Produk";
</script>
