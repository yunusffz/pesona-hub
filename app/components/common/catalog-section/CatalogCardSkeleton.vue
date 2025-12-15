<template>
  <div class="rounded-2xl border border-neutral-200 flex flex-col h-full animate-pulse">
    <!-- Image Skeleton -->
    <div class="relative">
      <div class="w-full h-[308px] bg-neutral-200 rounded-t-2xl"></div>
    </div>

    <!-- Content Skeleton -->
    <div class="flex flex-col flex-1 px-5 py-4 gap-3">
      <div class="flex items-start justify-between 2xl:gap-3 gap-6 2xl:flex-row flex-col">
        <div class="flex flex-col gap-3 2xl:flex-1 min-w-0 w-full 2xl:w-auto">
          <!-- Title Skeleton -->
          <div class="h-6 bg-neutral-200 rounded w-3/4"></div>
          <!-- Description Skeleton -->
          <div class="space-y-2">
            <div class="h-4 bg-neutral-200 rounded w-full"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6"></div>
          </div>
        </div>
        <!-- Badge Skeleton -->
        <div class="h-6 w-20 bg-neutral-200 rounded"></div>
      </div>

      <!-- Additional Info Skeleton -->
      <div class="text-neutral-700 text-xs flex flex-col gap-1 mt-2">
        <div class="h-4 bg-neutral-200 rounded w-2/3"></div>
        <div class="h-4 bg-neutral-200 rounded w-1/2"></div>
      </div>

      <!-- Footer Skeleton -->
      <div class="py-2 mt-auto">
        <!-- Unit Badge Skeleton -->
        <div class="py-2">
          <div class="h-6 w-16 bg-neutral-200 rounded"></div>
        </div>

        <div class="flex 2xl:flex-row flex-col gap-4 items-center">
          <div class="flex flex-col gap-1 flex-1">
            <!-- Price Skeleton -->
            <div class="h-6 bg-neutral-200 rounded w-32"></div>
          </div>
          <!-- Button Skeleton -->
          <div class="h-10 w-full 2xl:w-32 bg-neutral-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
