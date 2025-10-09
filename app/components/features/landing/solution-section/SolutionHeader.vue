<template>
  <div class="relative flex flex-col gap-6 w-full lg:w-[330px]">
    <div
      class="flex items-center space-x-2.5 border border-[#EBEBEB] rounded-full px-4 py-2 max-w-fit"
    >
      <SvgIcon name="diamond" size="10px" class="text-forest-green" />
      <span class="text-md font-medium text-rich-black">Our Solutions</span>
    </div>

    <h2 class="text-[40px] font-medium text-rich-black leading-[48px]">
      Dampak Sosial & Lingkungan yang Nyata
    </h2>

    <p class="text-md text-gray-600">
      Melalui Pesona Hub Digi, setiap produk yang terhubung ke pasar membawa
      manfaat langsung bagi masyarakat dan kelestarian hutan.
    </p>

    <NuxtLink>
      <button
        class="text-md font-medium text-white bg-forest-green rounded-full px-5 py-[18px] text-md hover:bg-forest-green/80"
      >
        Lihat Dampak
      </button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/ui/SvgIcon.vue";
</script>
