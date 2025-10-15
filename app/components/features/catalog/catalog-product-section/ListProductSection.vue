<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <template v-for="product in products" :key="product.title">
        <CatalogCard :product="product" v-if="product" :linkText="linkText" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CatalogCard from "~/components/common/catalog-section/CatalogCard.vue";
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
      image: "/assets/images/product-3.png",
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
      image: "/assets/images/product-3.png",
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
      image: "/assets/images/product-3.png",
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
      image: "/assets/images/product-3.png",
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
  ]);
  const linkText = "Lihat Detail";
</script>
