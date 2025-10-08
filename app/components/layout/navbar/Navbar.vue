<template>
  <header
    class="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-20 py-4 text-white"
  >
    <div class="flex items-center space-x-2">
      <SvgIcon name="logo" size="68px" />
    </div>

    <!-- Menu -->
    <nav class="hidden md:flex items-center space-x-8 font-medium text-md">
      <NuxtLink to="/">Beranda</NuxtLink>
      <NuxtLink to="/tentang">Tentang Kami</NuxtLink>
      <NuxtLink to="/katalog">Katalog</NuxtLink>
      <NuxtLink to="/faq">FAQ</NuxtLink>
    </nav>

    <!-- CTA -->
    <NuxtLink
      to="/gabung"
      class="bg-white/20 backdrop-blur-sm px-5 py-[18px] rounded-full text-sm font-medium hover:bg-white/30"
    >
      Gabung Mitra
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/ui/SvgIcon.vue";
</script>
