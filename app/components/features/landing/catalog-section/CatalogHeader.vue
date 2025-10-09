<template>
  <section class="gap-10 flex flex-col">
    <div>
      <button
        class="flex items-center space-x-2 font-medium text-md px-3 py-1 border border-[#EBEBEB] rounded-full"
      >
        <SvgIcon name="plant" class="text-primary" size="18px" />
        <span>Katalog Produk</span>
      </button>
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
  import SvgIcon from "~/components/ui/SvgIcon.vue";
  import BaseButton from "~/components/ui/BaseButton.vue";
</script>
