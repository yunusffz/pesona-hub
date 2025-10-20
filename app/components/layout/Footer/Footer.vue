<template>
  <footer
    class="bg-white px-4 sm:px-6 lg:px-10 2xl:px-20 flex flex-col gap-6 sm:gap-8 lg:gap-10 py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-[140px]"
  >
    <!-- Main footer content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Logo and description section -->
      <div class="flex flex-col items-center lg:items-start">
        <NuxtImg
          src="/assets/images/logo.png"
          alt="Logo Footer"
          class="w-full max-w-[280px] sm:max-w-[327px] mb-3 sm:mb-1.5"
        />
        <div
          class="text-lg sm:text-xl lg:text-2xl font-semibold text-center lg:text-left text-neutral-1000 max-w-[319px]"
        >
          Menghubungkan Alam, Usaha, dan Masyarakat
        </div>
      </div>

      <!-- Navigation sections -->
      <div class="flex justify-center lg:justify-end">
        <div
          class="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-[70px] w-full max-w-2xl lg:max-w-none"
        >
          <div class="flex flex-col gap-3 sm:gap-[18px]">
            <h3 class="text-sm sm:text-md font-medium">Beranda</h3>
            <ul
              class="text-sm sm:text-base text-[#585858] gap-2 sm:gap-3 flex flex-col"
            >
              <li>Beranda</li>
            </ul>
          </div>
          <div class="flex flex-col gap-3 sm:gap-[18px]">
            <h3 class="text-sm sm:text-md font-medium">Tentang Kami</h3>
            <ul
              class="text-sm sm:text-base text-[#585858] gap-2 sm:gap-3 flex flex-col"
            >
              <li>Tentang Kami</li>
            </ul>
          </div>
          <div class="flex flex-col gap-3 sm:gap-[18px]">
            <h3 class="text-sm sm:text-md font-medium">Katalog</h3>
            <ul
              class="text-sm sm:text-base text-[#585858] gap-2 sm:gap-3 flex flex-col"
            >
              <li>Produk</li>
              <li>Wisata</li>
            </ul>
          </div>
          <div class="flex flex-col gap-3 sm:gap-[18px]">
            <h3 class="text-sm sm:text-md font-medium">FAQ</h3>
            <ul
              class="text-sm sm:text-base text-[#585858] gap-2 sm:gap-3 flex flex-col"
            >
              <li>FAQ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Social media icons -->
    <div class="flex justify-center lg:justify-start gap-1 sm:gap-2">
      <IconBadge label="Instagram" icon="instagram" />
      <IconBadge label="Youtube" icon="youtube" />
      <IconBadge label="Facebook" icon="facebook" />
    </div>

    <!-- Copyright -->
    <p
      class="text-center lg:text-left text-sm sm:text-base text-[#585858] border-t border-[#EBEBEB] py-4 sm:py-5"
    >
      &copy; Pesona Hub. All rights reserved.
    </p>
  </footer>
</template>
<script setup lang="ts">
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import IconBadge from "~/components/base/IconBadge.vue";
</script>
