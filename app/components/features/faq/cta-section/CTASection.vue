<template>
  <section class="2xl:px-20 lg:px-10 py-10">
    <div class="rounded-[10px] background-cta p-[60px] grid grid-cols-2 gap-10">
      <div>
        <IconBadge label="Kontak Kami" icon="plant" variant="white" />
      </div>
      <div>
        <h1 class="text-[62px] font-medium leading-[77px]">
          Mari tumbuh bersama untuk masa depan yang hijau.
        </h1>
        <p class="mt-6 text-md text-[#585858]">
          Bergabunglah dengan kami dalam membangun ekonomi hijau yang
          berkelanjutan.
        </p>

        <div class="mt-[42px]">
          <BaseButton>Kontak Kami</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import BaseButton from "~/components/base/BaseButton.vue";
  import IconBadge from "~/components/base/IconBadge.vue";
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
