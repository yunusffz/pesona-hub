<template>
  <Card class="shadow-none border-none rounded-[10.5px]">
    <CardHeader class="pb-0">
      <CardTitle class="text-[#1a1a1a] text-sm">Selamat!</CardTitle>
      <CardDescription class="text-gray-500 text-sm">
        Registrasi dan profil Anda telah lengkap
      </CardDescription>
    </CardHeader>

    <CardContent class="pt-6">
      <div class="flex flex-col items-center gap-4 py-7">
        <!-- Success Icon -->
        <SvgIcon name="circle-check" size="100px" preserveOriginalColors />

        <!-- Content -->
        <div class="flex flex-col items-center gap-3 w-full max-w-[544px]">
          <h2 class="text-[#1a1a1a] text-center text-[17.5px] font-medium">
            Profil Anda Berhasil Diperbarui
          </h2>
          <p class="text-gray-500 text-center text-sm max-w-[372px]">
            Data Anda telah tersimpan. Sekarang Anda dapat melanjutkan pengajuan
            penawaran langsung ke pengelola KUPS melalui WhatsApp.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5 justify-center pt-3.5">
          <Button
            variant="outline"
            class="rounded-full h-auto px-[15px] py-2 bg-[#f8faf8] border-[#d9d9d9] text-[#1a1a1a] text-[12.25px]"
            @click="onBackToHome"
          >
            Kembali ke Beranda
          </Button>

          <Button
            class="rounded-full h-auto px-[14px] py-[7px] bg-[#174c36] hover:bg-[#0f3827] text-white text-[12.25px]"
            @click="onVisitDashboard"
          >
            Kunjungi Dashboard
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
  import SvgIcon from "@/components/base/SvgIcon.vue";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "~/components/ui/card";
  import { Button } from "@/components/ui/button";

  const props = defineProps<{
    onBackToHome?: () => void;
    onVisitDashboard?: () => void;
  }>();
</script>
