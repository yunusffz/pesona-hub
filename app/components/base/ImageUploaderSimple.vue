<template>
  <label
    class="relative flex flex-col items-center justify-center w-[112px] h-[112px] rounded-[14px] border-2 border-[#e7efea] cursor-pointer overflow-hidden transition hover:bg-gray-50"
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
    />

    <!-- Preview -->
    <img
      v-if="preview"
      :src="preview"
      alt="preview"
      class="w-full h-full object-cover rounded-[14px]"
    />

    <!-- Placeholder -->
    <div
      v-else
      class="flex flex-col items-center justify-center text-gray-500 text-sm select-none"
      :class="{ 'opacity-70': isDragging }"
    >
      <Icon
        v-if="additionalIcon"
        :name="additionalIcon"
        class="w-7 h-7 mb-1 text-[#6B7280]"
      />
      <Upload class="w-4 h-4 mb-1 text-primary" />
      <span>{{ label }}</span>
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
</template>

<script setup lang="ts">
import { Loader2, Upload } from "lucide-vue-next";
import { useImageUpload } from "~/composables/useImageUpload";

interface Props {
  modelValue?: string | null;
  label?: string;
  additionalIcon?: string;
  disableAutoUpload?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  file: [file: File];
  uploaded: [fileUrl: string];
  error: [error: string];
}>();

const { preview, isDragging, loading, onFileSelect, handleDrop } =
  useImageUpload(() => props.modelValue, emit);
</script>
