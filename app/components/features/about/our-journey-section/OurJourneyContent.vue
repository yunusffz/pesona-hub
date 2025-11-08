<template>
  <div class="flex flex-col gap-10">
    <div class="mx-auto">
      <BaseTabs :tabs="tabs" v-model:value="selected" />
    </div>

    <Transition :name="transitionName" mode="out-in">
      <div v-if="selected === '2015'" key="2015" class="grid grid-cols-2 gap-5">
        <div
          class="flex flex-col gap-6 bg-[#FAFAFA] pt-10 pl-10 pr-[60px] pb-[90px]"
        >
          <SvgIcon name="plant" size="18px" class="text-primary" />
          <h2 class="font-medium text-[28px]">
            Digitalisasi Perhutanan Sosial
          </h2>
          <p class="text-md text-[#585858] leading-6">
            Pesona Hub Digi lahir dari semangat transformasi digital dalam
            program Perhutanan Sosial. Inisiatif ini dimulai sebagai upaya
            memperkenalkan potensi produk hutan masyarakat melalui media daring,
            dengan tujuan memperluas akses pasar dan memperkuat ekonomi lokal.
          </p>
        </div>
        <div class="rounded-[10px] h-[350px] overflow-hidden">
          <NuxtImg
            src="/assets/images/journey-2015.png"
            alt="Our Journey 2015"
            class="w-full object-cover"
          />
        </div>
      </div>

      <div
        v-else-if="selected === '2018'"
        key="2018"
        class="grid grid-cols-2 gap-5"
      >
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
            src="/assets/images/journey-2018.png"
            alt="Our Journey 2018"
            class="w-full object-cover"
          />
        </div>
      </div>

      <div
        v-else-if="selected === '2022'"
        key="2022"
        class="grid grid-cols-2 gap-5"
      >
        <div
          class="flex flex-col gap-6 bg-[#FAFAFA] pt-10 pl-10 pr-[60px] pb-[90px]"
        >
          <SvgIcon name="plant" size="18px" class="text-primary" />
          <h2 class="font-medium text-[28px]">
            Inovasi Platform & Kemitraan Strategis
          </h2>
          <p class="text-md text-[#585858] leading-6">
            Di tahun 2022, Pesona Hub Digi mengembangkan platform marketplace
            yang lebih terintegrasi. Kemitraan dengan berbagai stakeholder
            diperkuat untuk meningkatkan kualitas produk dan akses pasar yang
            lebih luas bagi produk perhutanan sosial.
          </p>
        </div>
        <div class="rounded-[10px] h-[350px] overflow-hidden">
          <NuxtImg
            src="/assets/images/journey-2022.png"
            alt="Our Journey 2022"
            class="w-full object-cover"
          />
        </div>
      </div>

      <div
        v-else-if="selected === '2025'"
        key="2025"
        class="grid grid-cols-2 gap-5"
      >
        <div
          class="flex flex-col gap-6 bg-[#FAFAFA] pt-10 pl-10 pr-[60px] pb-[90px]"
        >
          <SvgIcon name="plant" size="18px" class="text-primary" />
          <h2 class="font-medium text-[28px]">
            Era Baru Ekonomi Hijau Digital
          </h2>
          <p class="text-md text-[#585858] leading-6">
            Pesona Hub Digi bertransformasi menjadi ekosistem digital terdepan
            untuk perhutanan sosial Indonesia. Dengan teknologi AI dan data
            analytics, kami terus berinovasi untuk memberdayakan KUPS dan
            menghadirkan produk berkelanjutan ke pasar global.
          </p>
        </div>
        <div class="rounded-[10px] h-[350px] overflow-hidden">
          <NuxtImg
            src="/assets/images/journey-2025.png"
            alt="Our Journey 2025"
            class="w-full object-cover"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import BaseTabs from "@/components/base/Tabs.vue";
  import SvgIcon from "~/components/base/SvgIcon.vue";

  const selected = ref("2015");
  const previousSelected = ref("2015");

  const tabs = [
    { value: "2015", label: "2015" },
    { value: "2018", label: "2018" },
    { value: "2022", label: "2022" },
    { value: "2025", label: "2025" },
  ];

  const transitionName = computed(() => {
    const currentIndex = tabs.findIndex((tab) => tab.value === selected.value);
    const previousIndex = tabs.findIndex(
      (tab) => tab.value === previousSelected.value
    );
    return currentIndex > previousIndex ? "slide-left" : "slide-right";
  });

  watch(selected, (newVal, oldVal) => {
    previousSelected.value = oldVal;
  });
</script>

<style scoped>
  /* Slide left transitions (moving forward) */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }

  .slide-left-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-left-leave-from {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }

  /* Slide right transitions (moving backward) */
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }

  .slide-right-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-right-leave-from {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-right-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
