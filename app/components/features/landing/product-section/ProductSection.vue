<template>
  <section>
    <CatalogHeader
      :title="title"
      :description="description"
      :link="link"
      :linkText="linkText"
      :label="label"
    />
    <CatalogContent :products="products" :linkText="detailLinkText" />
  </section>
</template>

<script setup lang="ts">
  import CatalogContent from "~/components/common/catalog-section/CatalogContent.vue";
  import CatalogHeader from "~/components/common/catalog-section/CatalogHeader.vue";
  import type { Product } from "~/types/product";
  const products = ref<Product[]>([
    {
      image: "/assets/images/product-1.png",
      title: "Pupuk Cair Organik KUPS Agroforestri Danau Raya",
      description:
        "Berikan yang terbaik untuk tanaman Anda dengan pupuk ramah lingkungan dari Nagari Danau Raya.",
      price: "100000",
      contact: "081234567890",
      catalogType: "Produk",
      kps: "LPHN Limo Koto",
      kups: "KUPS Agroforestri Danau Raya",
      productType: "Madu",
      link: "/produk-1",
      isNew: true,
    },
    {
      image: "/assets/images/product-2.png",
      title: "Produk 2",
      description: "Deskripsi produk 2",
      price: "200000",
      contact: "081234567890",
      catalogType: "Produk 2",
      kps: "100000",
      kups: "100000",
      productType: "Produk 2",
      link: "/produk-2",
      isNew: true,
    },
    {
      image: "/assets/images/product-3.png",
      title: "Produk 3",
      description: "Deskripsi produk 3",
      price: "300000",
      contact: "081234567890",
      catalogType: "Produk 3",
      kps: "100000",
      kups: "100000",
      productType: "Produk 3",
      link: "/produk-3",
      isNew: true,
    },
  ]);
  const title = "Produk Premium Perhutanan Sosial";
  const description =
    "Temukan pilihan produk berkualitas tinggi yang dihasilkan langsung oleh kelompok masyarakat pengelola hutan. Setiap produk tidak hanya bernilai ekonomi, tetapi juga menjaga kelestarian alam dan budaya.";
  const link = "/katalog";
  const linkText = "Lihat Semua Produk Premium";
  const label = "Katalog Produk";
  const detailLinkText = "Lihat Detail Produk";
</script>
