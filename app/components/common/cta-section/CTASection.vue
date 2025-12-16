<template>
  <section class="2xl:px-20 lg:px-10 py-10 px-4">
    <div
      class="rounded-[10px] background-cta py-[60px] px-3 md:px-10 lg:px-[60px] flex flex-col lg:flex-row gap-10 2xl:grid 2xl:grid-cols-2"
    >
      <div class="min-w-[300px]">
        <IconBadge label="Kontak Kami" icon="plant" variant="white" />
      </div>
      <div class="flex-1">
        <h1 class="text-5xl md:text-[62px] font-medium md:leading-[77px]">
          Mari tumbuh bersama untuk masa depan yang hijau.
        </h1>
        <p class="mt-6 text-md text-[#585858]">
          Kami percaya pertumbuhan berkelanjutan dimulai dari kolaborasi. Pesona
          Hub Digi siap terhubung dengan Anda — dari pelaku usaha, penggerak
          komunitas, hingga mitra yang peduli pada keberlanjutan alam Indonesia.
        </p>

        <div class="mt-[42px]">
          <NuxtLink to="mailto:pupspskl.klhk@gmail.com" target="_blank">
            <BaseButton>Hubungi Kami</BaseButton>
          </NuxtLink>
        </div>
        <div class="mt-10">
          <div>Atau hubungi whatsapp kami :</div>
          <div class="flex gap-3 mt-[14px]">
            <NuxtLink
              to="https://wa.me/6281907540184"
              target="_blank"
              class="flex items-center text-primary gap-1 hover:underline"
            >
              <SvgIcon name="whatsapp" class="text-primary" /> +62 819-0754-0184
            </NuxtLink>
            <NuxtLink
              to="https://wa.me/6281380063303"
              target="_blank"
              class="flex items-center text-primary gap-1 hover:underline"
            >
              <SvgIcon name="whatsapp" class="text-primary" /> +62 813-8006-3303
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import BaseButton from "~/components/base/BaseButton.vue";
import IconBadge from "~/components/base/IconBadge.vue";
import SvgIcon from "~/components/base/SvgIcon.vue";
</script>
<style scoped>
.background-cta {
  background: linear-gradient(
    285.94deg,
    #eecbaa 0%,
    #ffff7e 49.88%,
    #eecbaa 100%
  );
}
</style>
