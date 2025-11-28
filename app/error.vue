<!-- app/error.vue -->
<template>
  <section
    class="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6"
  >
    <div v-if="error.statusCode === 404">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p class="text-lg text-gray-600 mb-8">
        Halaman yang kamu cari tidak ditemukan.
      </p>
      <NuxtLink
        to="/"
        class="inline-block bg-primary text-white font-medium px-5 py-2 rounded-lg hover:bg-primary/80 transition"
      >
        Kembali ke Beranda
      </NuxtLink>
    </div>

    <div v-else>
      <h1 class="text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
      <p class="text-lg text-gray-600 mb-8">
        {{ "Terjadi kesalahan tidak terduga." }}
      </p>
      <NuxtLink
        to="/"
        class="inline-block bg-gray-800 text-white font-medium px-5 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Kembali ke Beranda
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
  const props = defineProps<{
    error: { statusCode?: number; message?: string };
  }>();

  // Reset error ketika user navigasi ulang
  const handleError = () => clearError({ redirect: "/" });
</script>
