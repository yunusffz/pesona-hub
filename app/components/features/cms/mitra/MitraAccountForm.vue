<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-gray-800"
        >Username <span class="text-red-500">*</span></label
      >
      <input
        v-model="form.username"
        type="text"
        required
        placeholder="Pilih username"
        class="h-9 px-3 rounded-2xl border border-transparent bg-[#f8faf8] text-sm focus:outline-none focus:ring-1 focus:ring-[#035925]/30 placeholder:text-[#717182] placeholder:font-normal w-full"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-800"
          >Kata Sandi <span class="text-red-500">*</span></label
        >
        <input
          v-model="form.password"
          type="password"
          required
          placeholder="Min. 8 karakter"
          class="h-9 px-3 rounded-2xl border border-transparent bg-[#f8faf8] text-sm focus:outline-none focus:ring-1 focus:ring-[#035925]/30 placeholder:text-[#717182] placeholder:font-normal w-full"
          :class="{ 'border-red-400': passwordMismatch }"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-800"
          >Konfirmasi Kata Sandi <span class="text-red-500">*</span></label
        >
        <input
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="Ulangi kata sandi"
          class="h-9 px-3 rounded-2xl border border-transparent bg-[#f8faf8] text-sm focus:outline-none focus:ring-1 focus:ring-[#035925]/30 placeholder:text-[#717182] placeholder:font-normal w-full"
          :class="{ 'border-red-400': passwordMismatch }"
        />
      </div>
    </div>
    <p v-if="passwordMismatch" class="text-xs text-red-600 -mt-2">
      Kata sandi tidak cocok
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { AccountFormData } from "~/components/features/cms/mitra/types";

const form = defineModel<AccountFormData>({ required: true });

const passwordMismatch = computed(
  () =>
    form.value.password !== form.value.confirmPassword &&
    form.value.confirmPassword.length > 0
);
</script>
