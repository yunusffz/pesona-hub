import { ref, watch } from "vue";
import { useApi } from "~/composables/useApi";
import { mapErrorMessage } from "~/utils/error-mapper";

const EXTENSION_TO_MIME: Record<string, string> = {
  JPG: "image/jpeg",
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp",
  GIF: "image/gif",
  SVG: "image/svg+xml",
  AVIF: "image/avif",
};

export interface UseImageUploadOptions {
  accept?: string[];
  maxSizeMb?: number;
}

export function useImageUpload(
  modelValue: () => string | null | undefined,
  emit: {
    (e: "update:modelValue", value: string | null): void;
    (e: "file", file: File): void;
    (e: "uploaded", fileUrl: string): void;
    (e: "error", error: string): void;
  },
  options: UseImageUploadOptions = {}
) {
  const client = useApi();
  const isDragging = ref(false);
  const loading = ref(false);

  const getPreviewUrl = (value: string | null | undefined): string | null => {
    if (!value) return null;
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:")
    ) {
      return value;
    }
    const config = useRuntimeConfig();
    const baseUrl = config.public.pesonaApiUrl;
    return `${baseUrl}/files/${value}`;
  };

  const preview = ref<string | null>(getPreviewUrl(modelValue()));

  watch(modelValue, (val) => {
    preview.value = getPreviewUrl(val);
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data, error } = await client.POST("/files", {
        body: formData,
      });

      if (error) {
        emit("error", mapErrorMessage(error));
        return null;
      }

      if (data && typeof data === "object" && "data" in data) {
        const fileData = data.data as any;
        const objName = fileData?.object_name || fileData?.id;
        if (objName) return String(objName);
      }

      emit("error", "Failed to get file URL from response");
      return null;
    } catch (err: any) {
      emit("error", err?.message || mapErrorMessage(err) || "Failed to upload file");
      return null;
    }
  };

  const validateFile = (file: File): string | null => {
    if (options.accept?.length) {
      const allowed = options.accept.map((ext) => EXTENSION_TO_MIME[ext.toUpperCase()]).filter(Boolean);
      if (!allowed.includes(file.type)) {
        return `File type not allowed. Accepted: ${options.accept.join(", ")}`;
      }
    }
    if (options.maxSizeMb) {
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > options.maxSizeMb) {
        return `File too large. Max size: ${options.maxSizeMb}MB`;
      }
    }
    return null;
  };

  const handleFile = async (file: File, disableAutoUpload = false) => {
    const validationError = validateFile(file);
    if (validationError) {
      emit("error", validationError);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      preview.value = reader.result as string;
    };
    reader.readAsDataURL(file);

    emit("file", file);

    if (!disableAutoUpload) {
      loading.value = true;
      try {
        const objectName = await uploadFile(file);
        if (objectName) {
          emit("update:modelValue", objectName);
          emit("uploaded", objectName);

          const config = useRuntimeConfig();
          const baseUrl = config.public.pesonaApiUrl;
          preview.value = `${baseUrl}/files/${objectName}`;
        }
      } finally {
        loading.value = false;
      }
    } else {
      emit("update:modelValue", preview.value);
    }
  };

  const onFileSelect = (e: Event, disableAutoUpload = false) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) handleFile(file, disableAutoUpload);
  };

  const handleDrop = (e: DragEvent, disableAutoUpload = false) => {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file, disableAutoUpload);
  };

  return {
    preview,
    isDragging,
    loading,
    onFileSelect,
    handleDrop,
    handleFile,
    getPreviewUrl,
  };
}
