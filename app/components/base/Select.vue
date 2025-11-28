<script setup lang="ts">
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
  import { ChevronsUpDown } from "lucide-vue-next";
</script>

<template>
  <div class="relative w-full">
    <!-- Trigger -->
    <Select>
      <SelectTrigger
        class="w-full h-11 px-4 pr-10 rounded-xl border border-gray-300 bg-white text-gray-700"
      >
        <SelectValue placeholder="Pilih jenis bahan" />

        <!-- Icon -->
        <ChevronsUpDown
          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
        />
      </SelectTrigger>

      <!-- Dropdown -->
      <SelectContent class="rounded-xl shadow-md">
        <SelectItem value="kayu">Kayu</SelectItem>
        <SelectItem value="bambu">Bambu</SelectItem>
        <SelectItem value="rotan">Rotan</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
