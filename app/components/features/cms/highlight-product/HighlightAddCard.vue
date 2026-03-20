<template>
  <div
    class="w-[329px] h-[411px] border-2 border-dashed rounded-xl border-[#D1D5DC] flex flex-col justify-center items-center gap-3 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
    @click="$emit('click')"
  >
    <div
      class="rounded-full bg-[#F3F4F6] w-14 h-14 flex flex-col justify-center items-center text-[#4A5565]"
    >
      <Plus :size="24" />
    </div>
    <div class="text-[#4A5565] text-base font-medium">Tambah Produk</div>
    <div class="text-[#4A5565] text-xs">tambah produk yang ingin disorot</div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";

defineEmits<{ click: [] }>();
</script>
