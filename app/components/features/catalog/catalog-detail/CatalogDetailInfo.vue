<script setup lang="ts">
  import BaseLinkButton from "~/components/base/BaseLinkButton.vue";
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-neutral-700 whitespace-nowrap">
        Informasi tambahan
      </span>
      <div class="flex-1 border-t border-neutral-200"></div>
    </div>
    <div class="flex flex-col gap-8 mt-12">
      <div class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Wilayah:
        </span>
        <span class="text-md font-semibold text-neutral-900 whitespace-nowrap">
          LPHN Limo Koto
        </span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-md font-semibold text-neutral-700 whitespace-nowrap">
          Komoditas:
        </span>
        <span class="text-md font-semibold text-neutral-900 whitespace-nowrap">
          KUPS Madu Lambah Sighabungan
        </span>
      </div>

      <!-- <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-neutral-700 whitespace-nowrap">
          Kontak Supplier
        </span>
        <div class="flex-1 border-t border-neutral-200"></div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-6">
          <BaseButton variant="solid" size="sm"> Telepon </BaseButton>
          <BaseButton size="sm"
            ><Icon name="uil:whatsapp" class="w-4 h-4" /> Whatsapp</BaseButton
          >
        </div>
        <div class="flex items-center gap-2">
          <SvgIcon name="approve" size="17px" />
          <span class="text-sm text-neutral-500 italic whitespace-nowrap">
            Nomor resmi supplier yang telah diverifikasi oleh Balai PS setempat.
          </span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
  import BaseButton from "~/components/base/BaseButton.vue";
  import SvgIcon from "~/components/base/SvgIcon.vue";
</script>
