<template>
  <footer class="bg-white px-20 flex flex-col gap-10">
    <div class="grid grid-cols-2">
      <div>
        <SvgIcon name="logo-footer" size="190px" />
        <div class="text-2xl font-semibold w-[319px] text-neutral-1000">
          Menghubungkan Alam, Usaha, dan Masyarakat
        </div>
      </div>
      <div class="flex justify-end">
        <div class="grid grid-cols-4 gap-[70px]">
          <div class="flex flex-col gap-[18px]">
            <h3 class="text-md font-medium">Beranda</h3>
            <ul class="text-[#585858] gap-3 flex flex-col">
              <li>Beranda</li>
            </ul>
          </div>
          <div class="flex flex-col gap-[18px]">
            <h3 class="text-md font-medium">Tentang Kami</h3>
            <ul class="text-[#585858] gap-3 flex flex-col">
              <li>Tentang Kami</li>
            </ul>
          </div>
          <div class="flex flex-col gap-[18px]">
            <h3 class="text-md font-medium">Katalog</h3>
            <ul class="text-[#585858] gap-3 flex flex-col">
              <li>Produk</li>
              <li>Wisata</li>
            </ul>
          </div>
          <div class="flex flex-col gap-[18px]">
            <h3 class="text-md font-medium">FAQ</h3>
            <ul class="text-[#585858] gap-3 flex flex-col">
              <li>FAQ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-1">
      <IconBadge label="Instagram" icon="instagram" />
      <IconBadge label="Youtube" icon="youtube" />
      <IconBadge label="Facebook" icon="facebook" />
    </div>

    <p class="text-left text-[#585858] border-t border-[#EBEBEB] py-5">
      &copy; 2025 Pesona Hub. All rights reserved.
    </p>
  </footer>
</template>
<script setup lang="ts">
  import SvgIcon from "~/components/ui/SvgIcon.vue";
  import IconBadge from "~/components/ui/IconBadge.vue";
</script>
