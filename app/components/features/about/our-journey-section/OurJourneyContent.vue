<template>
  <div class="flex flex-col gap-10">
    <div class="mx-auto">
      <BaseTabs :tabs="tabs" v-model:value="selected" />
    </div>

    <div v-if="selected === '2015'" class="grid grid-cols-2 gap-5">
      <div
        class="flex flex-col gap-6 bg-[#FAFAFA] pt-10 pl-10 pr-[60px] pb-[90px]"
      >
        <SvgIcon name="plant" size="18px" class="text-primary" />
        <h2 class="font-medium text-[28px]">Digitalisasi Perhutanan Sosial</h2>
        <p class="text-md text-[#585858] leading-6">
          Pesona Hub Digi lahir dari semangat transformasi digital dalam program
          Perhutanan Sosial. Inisiatif ini dimulai sebagai upaya memperkenalkan
          potensi produk hutan masyarakat melalui media daring, dengan tujuan
          memperluas akses pasar dan memperkuat ekonomi lokal.
        </p>
      </div>
      <div class="rounded-[10px] h-[350px] overflow-hidden">
        <NuxtImg
          src="/assets/images/our-journey-1.png"
          alt="Our Journey 1"
          class="w-full object-cover"
        />
      </div>
    </div>

    <div v-else-if="selected === '2018'" class="grid grid-cols-2 gap-5">
      <div
        class="flex flex-col gap-6 bg-[#FAFAFA] pt-10 pl-10 pr-[60px] pb-[90px]"
      >
        <SvgIcon name="plant" size="18px" class="text-primary" />
        <h2 class="font-medium text-[28px]">
          Ekspansi Wilayah & Dampak Sosial
        </h2>
        <p class="text-md text-[#585858] leading-6">
          Pada 2018, program mulai menjangkau lebih banyak KUPS dan memperluas
          jangkauan produk. Platform digital membantu menumbuhkan kolaborasi
          antara masyarakat dan mitra bisnis lokal.
        </p>
      </div>
      <div class="rounded-[10px] h-[350px] overflow-hidden">
        <NuxtImg
          src="/assets/images/our-journey-2.png"
          alt="Our Journey 2"
          class="w-full object-cover"
        />
      </div>
    </div>

    <!-- Add more years -->
  </div>
</template>

<script setup lang="ts">
  import BaseTabs from "@/components/base/Tabs.vue";

  const selected = ref("2015");
  const tabs = [
    { value: "2015", label: "2015" },
    { value: "2018", label: "2018" },
    { value: "2022", label: "2022" },
    { value: "2025", label: "2025" },
  ];
</script>
