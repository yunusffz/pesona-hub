<template>
  <div class="relative flex flex-col gap-6 w-full lg:w-[430px] lg:pr-20">
    <h2 class="text-[40px] font-medium text-rich-black leading-[48px]">
      Dampak Sosial & Lingkungan yang Nyata
    </h2>

    <p class="text-md text-gray-600">
      Melalui Pesona Hub Digi, setiap produk yang terhubung ke pasar membawa
      manfaat langsung bagi masyarakat dan kelestarian hutan.
    </p>

    <!-- <NuxtLink>
      <BaseButton>Lihat Dampak</BaseButton>
    </NuxtLink> -->

    <!-- Mask Divider integrated into header -->
    <div
      class="hidden lg:block absolute -right-[100px] top-0 bottom-0 w-[150px] z-10 bg-white backdrop-blur-[20px]"
      style="
        -webkit-mask-image: url('/assets/images/white-divider.png');
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 150px 472px;
        -webkit-mask-position: center center;
        -webkit-mask-mode: alpha;
        mask-image: url('/assets/images/white-divider.png');
        mask-repeat: no-repeat;
        mask-size: 150px 472px;
        mask-position: center center;
        mask-mode: alpha;
      "
    ></div>
  </div>
</template>

<script setup lang="ts">
  import BaseButton from "~/components/base/BaseButton.vue";
  import IconBadge from "~/components/base/IconBadge.vue";
</script>
