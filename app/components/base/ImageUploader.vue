<template>
  <div class="flex flex-col gap-1">
  <label
    class="relative flex flex-col items-center justify-center w-[138px] h-[138px] rounded-[14px] border-2 cursor-pointer overflow-hidden transition hover:bg-gray-50 bg-[#F9FAFB]"
    :class="validationError ? 'border-red-400' : 'border-[#D1D5DC]'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="(e) => handleDrop(e, props.disableAutoUpload)"
  >
    <!-- File Input -->
    <input
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileSelect"
      ref="fileInput"
    />

    <!-- Preview -->
    <img
      v-if="preview"
      :src="preview"
      alt="preview"
      class="w-full h-full object-cover rounded-xl"
    />

    <!-- Placeholder -->
    <div
      v-else
      class="flex flex-col p-3.5 gap-1 items-center justify-center text-gray-500 text-sm select-none"
      :class="{ 'opacity-70': isDragging }"
    >
      <Icon
        v-if="additionalIcon"
        :name="additionalIcon"
        class="w-7 h-7 mb-1 text-[#6B7280]"
      />
      <BaseSvgIcon
        name="image-placeholder"
        :size="'48px'"
        :preserve-original-colors="true"
      />

      <span class="text-sm font-medium text-[#364153]">{{ label }}</span>
      <span class="text-xs w-[110px] text-center">{{ hint }}</span>
    </div>

    <!-- Overlay saat drag -->
    <div
      v-if="isDragging"
      class="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-[14px] pointer-events-none"
    ></div>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/60 rounded-[14px]"
    >
      <Loader2 class="w-5 h-5 animate-spin text-[#035925]" />
    </div>
  </label>

  <!-- Validation error -->
  <p v-if="validationError" class="text-xs text-red-500 w-[138px] text-center">
    {{ validationError }}
  </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Loader2 } from "lucide-vue-next";
import { useImageUpload } from "~/composables/useImageUpload";

interface Props {
  modelValue?: string | null;
  label?: string;
  additionalIcon?: string;
  disableAutoUpload?: boolean;
  /** accepted file types, e.g. ['PNG', 'JPG'] */
  accept?: string[];
  /** max file size in MB */
  maxSizeMb?: number;
}
const props = withDefaults(defineProps<Props>(), {
  accept: () => ["PNG", "JPG"],
  maxSizeMb: 10,
});

const hint = computed(() => {
  const types = props.accept.join(", ");
  return `${types} (Max ${props.maxSizeMb}MB)`;
});
const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  file: [file: File];
  uploaded: [fileUrl: string];
  error: [error: string];
}>();

const validationError = ref<string | null>(null);
let errorTimer: ReturnType<typeof setTimeout>;

const emitWithValidation = new Proxy(emit, {
  apply(target, _, args) {
    if (args[0] === "error") {
      validationError.value = args[1];
      clearTimeout(errorTimer);
      errorTimer = setTimeout(() => (validationError.value = null), 3000);
    }
    return Reflect.apply(target as any, _, args);
  },
}) as typeof emit;

const { preview, isDragging, loading, onFileSelect, handleDrop } =
  useImageUpload(() => props.modelValue, emitWithValidation, {
    accept: props.accept,
    maxSizeMb: props.maxSizeMb,
  });
</script>
