<template>
  <div
    class="text-[52px] md:text-[64px] font-medium leading-[62px] max-w-[538px] w-full text-center lg:text-left"
  >
    <h1>{{ data?.title || "Meningkatkan Standar Ekonomi Hijau Nasional." }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useAboutUs } from "~/queries/useAboutUs";

const { data } = useAboutUs();
</script>
