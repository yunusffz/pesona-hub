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
        class="h-9 px-3 rounded-2xl border bg-[#f8faf8] text-sm focus:outline-none focus:ring-1 focus:ring-[#035925]/30 placeholder:text-[#717182] placeholder:font-normal w-full"
        :class="fieldErrors.username ? 'border-red-400' : 'border-transparent'"
      />
      <p v-if="fieldErrors.username" class="text-xs text-red-600">
        {{ fieldErrors.username }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-gray-800"
        >Kata Sandi <span class="text-red-500">*</span></label
      >
      <input
        v-model="form.password"
        type="password"
        required
        placeholder="Min. 8 karakter"
        class="h-9 px-3 rounded-2xl border bg-[#f8faf8] text-sm focus:outline-none focus:ring-1 focus:ring-[#035925]/30 placeholder:text-[#717182] placeholder:font-normal w-full"
        :class="(showErrors && !isPasswordValid) || passwordMismatch ? 'border-red-400' : 'border-transparent'"
      />
      <!-- Live password rules checklist -->
      <div v-if="form.password.length > 0 || showErrors" class="flex flex-col gap-1 mt-0.5">
        <div
          v-for="rule in passwordRules"
          :key="rule.label"
          class="flex items-center gap-1.5 text-xs"
          :class="rule.valid ? 'text-[#035925]' : showErrors ? 'text-red-600' : 'text-gray-400'"
        >
          <span class="shrink-0">{{ rule.valid ? "✓" : "✗" }}</span>
          {{ rule.label }}
        </div>
      </div>
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
        class="h-9 px-3 rounded-2xl border bg-[#f8faf8] text-sm focus:outline-none focus:ring-1 focus:ring-[#035925]/30 placeholder:text-[#717182] placeholder:font-normal w-full"
        :class="fieldErrors.confirmPassword ? 'border-red-400' : 'border-transparent'"
      />
      <p v-if="fieldErrors.confirmPassword" class="text-xs text-red-600">
        {{ fieldErrors.confirmPassword }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { AccountFormData } from "~/components/features/cms/mitra/types";
import { PASSWORD_RULES, mitraAccountSchema } from "~/schemas/mitra";

const form = defineModel<AccountFormData>({ required: true });

const props = defineProps<{ showErrors?: boolean }>();

const passwordRules = computed(() =>
  PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    valid: rule.test(form.value.password),
  }))
);

const isPasswordValid = computed(() => passwordRules.value.every((r) => r.valid));

const fieldErrors = computed(() => {
  if (!props.showErrors) return {};
  const result = mitraAccountSchema.safeParse(form.value);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path.join("."), issue.message])
  );
});

const passwordMismatch = computed(
  () =>
    form.value.password !== form.value.confirmPassword &&
    form.value.confirmPassword.length > 0
);
</script>
