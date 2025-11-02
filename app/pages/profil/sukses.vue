<template>
  <div class="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
    <div
      class="content-stretch flex flex-col gap-[28px] items-center relative w-full max-w-[500px]"
    >
      <!-- Success Icon -->
      <div
        class="flex items-center justify-center w-20 h-20 rounded-full bg-[#035925] mb-4"
      >
        <Check class="w-10 h-10 text-white" />
      </div>

      <!-- Success Message -->
      <div class="text-center">
        <h1
          class="text-2xl font-semibold text-neutral-950 mb-2"
        >
          Profil Berhasil Diperbarui!
        </h1>
        <p class="text-sm text-gray-500 mb-6">
          Data profil mitra Anda telah berhasil disimpan.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3 w-full">
        <button
          @click="navigateTo('/profil')"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#174c36] hover:bg-[#035925] text-white transition-colors"
        >
          <span class="text-sm font-medium">Lihat Profil</span>
        </button>
        
        <button
          @click="navigateTo('/')"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-[#d9d9d9] bg-white hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <span class="text-sm font-medium">Kembali ke Beranda</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Check } from "lucide-vue-next";

  // Set page title
  useSeoMeta({
    title: "Profil Berhasil Diperbarui - PeSoNa Hub",
  });
</script>
