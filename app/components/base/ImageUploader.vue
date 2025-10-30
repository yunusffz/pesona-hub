<template>
  <label
    class="relative flex flex-col items-center justify-center w-[112px] h-[112px] rounded-[14px] border-2 border-[#e7efea] cursor-pointer overflow-hidden transition hover:bg-gray-50"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
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
  import { ref, watch } from "vue";
  import { Upload, Loader2 } from "lucide-vue-next";

  interface Props {
    /** optional preview from parent (URL or base64) */
    modelValue?: string | null;
    /** show spinner overlay */
    loading?: boolean;
    /** label placeholder text */
    label?: string;

    additionalIcon?: string;
  }
  const props = defineProps<Props>();
  const emit = defineEmits(["update:modelValue", "file"]);

  const fileInput = ref<HTMLInputElement | null>(null);
  const preview = ref<string | null>(props.modelValue || null);
  const isDragging = ref(false);

  watch(
    () => props.modelValue,
    (val) => (preview.value = val || null)
  );

  const onFileSelect = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      preview.value = reader.result as string;
      emit("update:modelValue", reader.result as string);
      emit("file", file);
    };
    reader.readAsDataURL(file);
  };
</script>
