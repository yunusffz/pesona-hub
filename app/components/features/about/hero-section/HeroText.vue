<template>
  <p class="flex items-center text-md leading-6 text-[#585858] max-w-[443px]">
    {{
      data?.description ||
      "Pesona Hub Digi hadir sebagai platform digital yang menjembatani Kelompok Usaha Perhutanan Sosial (KUPS) dengan mitra bisnis, CSR, dan lembaga pendanaan. Kami berkomitmen membangun rantai nilai Perhutanan sosial yang inklusif, transparan, dan berkelanjutan di seluruh Indonesia."
    }}
  </p>
</template>

<script setup lang="ts">
import { useAboutUs } from "~/queries/useAboutUs";

const { data } = useAboutUs();
</script>
