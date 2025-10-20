<template>
  <NuxtLink to="/katalog" class="w-full">
    <BaseButton
      variant="solid"
      size="sm"
      class="w-full lg:w-auto justify-center lg:justify-start"
    >
      <div>Lihat Katalog Produk</div>
      <div class="lg:ml-auto h-6">
        <Icon name="uil:arrow-right" size="24px" /></div
    ></BaseButton>
  </NuxtLink>
</template>

<script setup lang="ts">
  import BaseButton from "~/components/base/BaseButton.vue";
</script>
