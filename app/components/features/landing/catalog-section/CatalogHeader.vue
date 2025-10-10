<template>
  <section class="gap-10 flex flex-col">
    <div>
      <IconBadge label="Katalog Produk" icon="plant" />
    </div>
    <div class="flex justify-between items-center gap-64">
      <div>
        <h1 class="font-medium text-[40px]">
          Produk Premium Perhutanan Sosial
        </h1>
        <p class="text-md text-[#585858] mt-[21px]">
          Temukan pilihan produk berkualitas tinggi yang dihasilkan langsung
          oleh kelompok masyarakat pengelola hutan. Setiap produk tidak hanya
          bernilai ekonomi, tetapi juga menjaga kelestarian alam dan budaya.
        </p>
      </div>
      <BaseButton class="whitespace-nowrap"
        >Lihat Semua Produk Premium</BaseButton
      >
    </div>
  </section>
</template>

<script setup lang="ts">
  import IconBadge from "~/components/ui/IconBadge.vue";
  import SvgIcon from "~/components/ui/SvgIcon.vue";
  import BaseButton from "~/components/ui/BaseButton.vue";
</script>
