<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-6">
        <NuxtImg
          src="/assets/images/logo-sumbar.png"
          alt="Sumbar"
          class="w-20 h-20 object-cover"
        />
        <span class="text-xl font-semibold text-[#0D0D0E]">
          Sumatera Barat</span
        >
      </div>
      <p class="text-[#585858]">
        Madu, kopi, kayu, dan kerajinan dari berbagai KUPS telah terhubung
        melalui sistem verifikasi dan promosi Pesona Hub Digi.
      </p>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-6">
        <div class="w-20 h-20">
          <NuxtImg
            src="/assets/images/logo-jatim.png"
            alt="Sumbar"
            class="w-full h-full object-contain"
          />
        </div>
        <span class="text-xl font-semibold text-[#0D0D0E]"> Jawa Timur</span>
      </div>
      <p class="text-[#585858]">
        Terhubung dengan lebih dari 15 Balai PS & KPH aktif untuk validasi
        produk, pendampingan, dan distribusi langsung dari lapangan.
      </p>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-6">
        <div class="relative w-20 h-20">
          <NuxtImg
            src="/assets/images/logo-jabar.png"
            alt="Sumbar"
            class="w-full h-full object-contain"
          />
        </div>
        <span class="text-xl font-semibold text-[#0D0D0E]"> Jawa Barat</span>
      </div>
      <p class="text-[#585858]">
        Sebagian besar produk telah lolos proses verifikasi mutu dan siap
        memperluas pasar hijau melalui kolaborasi kemitraan.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
