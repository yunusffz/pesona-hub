<template>
  <div class="rounded-2xl border border-neutral-200">
    <div class="relative">
      <Badge class="absolute top-3 left-6" variant="info">New</Badge>
      <Badge class="absolute top-3 right-6" variant="white">Produk</Badge>
      <img
        src="/assets/images/product-2.png"
        alt="Product Image"
        class="w-full h-[308px] object-cover rounded-t-2xl"
      />
    </div>
    <div class="flex flex-col px-5 py-4 gap-3">
      <div class="flex items-start justify-between gap-3">
        <div class="flex flex-col gap-3 flex-1 min-w-0 truncate">
          <h1 class="font-semibold text-[20px] truncate">
            Pupuk Cair Organik KUPS Agroforestri Danau Raya
          </h1>
          <p class="truncate">
            Berikan yang terbaik untuk tanaman Anda dengan pupuk ramah
            lingkungan dari Nagari Danau Raya.
          </p>
        </div>
        <div
          class="bg-[#F4F4F4] rounded-full px-[6px] border border-neutral-200 font-medium"
        >
          Madu
        </div>
      </div>
      <div class="text-neutral-700 text-xs flex flex-col gap-1">
        <div>KPS : LPHN Limo Koto</div>
        <div>KUPS : KUPS Agroforestri Danau Raya</div>
      </div>
      <div>
        <button
          class="border border-neutral-200 rounded-full px-[6px] py-1 text-xs bg-[#F4F4F4] text-neutral-800 font-medium"
        >
          500ml
        </button>
      </div>
      <div class="py-2 flex gap-4">
        <div class="flex flex-col gap-1">
          <div class="text-lg font-bold">Rp xxx.xxx</div>
          <div class="text-neutral-500 text-xs italic">
            Login untuk melihat harga & kontak supplier
          </div>
        </div>
        <div>
          <button
            class="border border-neutral-200 rounded-full px-[6px] py-1 text-md bg-white text-neutral-800 font-medium"
          >
            Lihat Detail Produk
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Badge from "~/components/ui/badge/Badge.vue";
</script>
