<template>
  <section class="min-h-screen bg-gray-50 flex items-stretch pb-18">
    <Sidebar />
    <div class="flex flex-col flex-1 min-w-0">
      <CmsHeader />
      <main class="w-full p-6">
        <slot />
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import Sidebar from "~/components/features/cms/sidebar/Sidebar.vue";
import CmsHeader from "~/components/features/cms/header/Header.vue";
</script>
