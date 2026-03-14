<template>
  <section class="min-h-screen bg-gray-50 flex">
    <Sidebar />

    <div class="flex flex-col flex-1 min-w-0">
      <CmsHeader />

    <!-- Content -->
    <main class="max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
      <!-- Welcome Banner -->
      <div class="bg-primary rounded-2xl p-6 sm:p-8 text-white flex flex-col gap-2">
        <h1 class="text-xl sm:text-2xl font-semibold">Dashboard CMS</h1>
        <p class="text-sm sm:text-base opacity-80">
          Kelola konten Pesona Hub Digi dari sini.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100"
        >
          <div class="bg-primary/10 rounded-xl p-3">
            <component :is="stat.icon" class="h-6 w-6 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-neutral-800">{{ stat.value }}</p>
            <p class="text-sm text-neutral-500">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Placeholder Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-semibold text-neutral-800">Konten Terbaru</h2>
          <span class="text-xs text-neutral-400 bg-gray-100 rounded-full px-3 py-1">Test data</span>
        </div>
        <div class="divide-y divide-gray-50">
          <div
            v-for="item in mockContent"
            :key="item.id"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div class="flex flex-col gap-0.5">
              <p class="text-sm font-medium text-neutral-800">{{ item.title }}</p>
              <p class="text-xs text-neutral-400">{{ item.date }}</p>
            </div>
            <span
              class="text-xs rounded-full px-3 py-1 font-medium"
              :class="item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
            >
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileText, Image, Users } from "lucide-vue-next";
import Sidebar from "~/components/features/cms/sidebar/Sidebar.vue";
import CmsHeader from "~/components/features/cms/header/Header.vue";

const stats = [
  { label: "Total Artikel", value: 24, icon: FileText },
  { label: "Total Media", value: 138, icon: Image },
  { label: "Pengguna", value: 5, icon: Users },
];

const mockContent = [
  { id: 1, title: "Wisata Alam Pesona Nusantara", date: "14 Mar 2026", status: "Published" },
  { id: 2, title: "Kuliner Khas Daerah", date: "13 Mar 2026", status: "Draft" },
  { id: 3, title: "Festival Budaya 2026", date: "12 Mar 2026", status: "Published" },
  { id: 4, title: "Panduan Wisata Aman", date: "11 Mar 2026", status: "Draft" },
];
</script>
