<template>
  <div class="relative">
    <input
      v-model="modelValue"
      :placeholder="placeholder"
      :type="showPassword ? 'text' : type"
      :disabled="disabled"
      :class="
        cn(
          'rounded-full border border-blur-10 focus-within:ring-0 transition-all duration-200 bg-[#F9F9F933] backdrop-blur-[10px] h-[60px] w-full px-6 text-neutral-1000 placeholder:text-neutral-1000 font-medium text-md focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          type === 'password' ? 'pr-16' : '',
          props.class
        )
      "
    />
    <button
      v-if="type === 'password'"
      type="button"
      @click="togglePassword"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-1000 hover:text-neutral-800 transition-colors"
    >
      <Eye v-if="!showPassword" class="w-5 h-5" />
      <EyeOff v-else class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { HTMLAttributes } from "vue";
  import { useVModel } from "@vueuse/core";
  import { cn } from "@/lib/utils";
  import { Eye, EyeOff } from "lucide-vue-next";
  import { ref } from "vue";

  interface Props {
    defaultValue?: string | number;
    modelValue?: string | number;
    placeholder?: string;
    type?: "text" | "email" | "password" | "search" | "tel" | "url";
    disabled?: boolean;
    class?: HTMLAttributes["class"];
  }

  const props = withDefaults(defineProps<Props>(), {
    type: "text",
    disabled: false,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", payload: string | number): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });

  const showPassword = ref(false);

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
</script>

<style scoped>
  /* Make password bullets bigger */
  input[type="password"] {
    font-size: 1.5em;
    line-height: 1;
  }
</style>
