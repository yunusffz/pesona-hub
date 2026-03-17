<template>
  <section class="min-h-screen bg-gray-50 flex items-stretch overflow-hidden">
    <!-- Mobile overlay backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/30 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <Sidebar :mobile-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex flex-col flex-1 min-w-0">
      <CmsHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="w-full p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import Sidebar from "~/components/features/cms/sidebar/Sidebar.vue";
import CmsHeader from "~/components/features/cms/header/Header.vue";

const sidebarOpen = ref(false);
</script>
