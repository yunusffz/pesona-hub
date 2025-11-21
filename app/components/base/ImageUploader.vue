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
  import { useApi } from "~/composables/useApi";
  import { mapErrorMessage } from "~/utils/error-mapper";

  interface Props {
    /** optional preview from parent (URL or base64) */
    modelValue?: string | null;
    /** label placeholder text */
    label?: string;
    additionalIcon?: string;
    /** disable auto-upload, just emit file */
    disableAutoUpload?: boolean;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    "update:modelValue": [value: string | null];
    file: [file: File];
    uploaded: [fileUrl: string];
    error: [error: string];
  }>();

  const client = useApi();
  const fileInput = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const loading = ref(false);

  // Helper function to construct preview URL from object_name
  const getPreviewUrl = (value: string | null): string | null => {
    if (!value) return null;
    // If it's already a full URL (starts with http:// or https:// or data:), use as-is
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:")
    ) {
      return value;
    }
    // Otherwise, construct URL from object_name
    const config = useRuntimeConfig();
    const baseUrl = config.public.NUXT_PUBLIC_PESONA_API_URL;
    return `${baseUrl}/files/${value}`;
  };

  const preview = ref<string | null>(getPreviewUrl(props.modelValue));

  watch(
    () => props.modelValue,
    (val) => {
      preview.value = getPreviewUrl(val);
    }
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

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data, error } = await client.POST("/files", {
        body: formData,
      });

      if (error) {
        const mappedError = mapErrorMessage(error);
        emit("error", mappedError);
        return null;
      }

      // Extract file URL from response
      if (data && typeof data === "object" && "data" in data) {
        const fileData = data.data as any;
        if (fileData?.object_name) {
          return fileData.object_name;
        }
        if (fileData?.id) {
          return String(fileData.id);
        }
        // Try to find object_name or id in nested structure
        if (typeof fileData === "object") {
          const objName = fileData.object_name || fileData.id;
          if (objName) {
            return String(objName);
          }
        }
      }

      emit("error", "Failed to get file URL from response");
      return null;
    } catch (err: any) {
      const errorMessage =
        err?.message || mapErrorMessage(err) || "Failed to upload file";
      emit("error", errorMessage);
      return null;
    }
  };

  const handleFile = async (file: File) => {
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      preview.value = reader.result as string;
    };
    reader.readAsDataURL(file);

    emit("file", file);

    // Upload if auto-upload is enabled (default: true)
    if (!props.disableAutoUpload) {
      loading.value = true;
      try {
        const objectName = await uploadFile(file);
        if (objectName) {
          // Emit only the object_name (not the full URL)
          emit("update:modelValue", objectName);
          emit("uploaded", objectName);

          // Update preview to use the server URL
          const config = useRuntimeConfig();
          const baseUrl = config.public.NUXT_PUBLIC_PESONA_API_URL;
          preview.value = `${baseUrl}/files/${objectName}`;
        }
      } finally {
        loading.value = false;
      }
    } else {
      // If auto-upload is disabled, just emit base64 preview
      emit("update:modelValue", preview.value);
    }
  };
</script>
