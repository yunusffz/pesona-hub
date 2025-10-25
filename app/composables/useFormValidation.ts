import { z } from "zod";
import type { ZodSchema } from "zod";

export function useFormValidation<T>(schema: ZodSchema<T>) {
  const errors = ref<Record<string, string>>({});
  const isValid = ref(false);

  const validate = (data: unknown) => {
    try {
      schema.parse(data);
      errors.value = {};
      isValid.value = true;
      return { success: true, data: data as T };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });

        errors.value = newErrors;
        isValid.value = false;
        return { success: false, errors: newErrors };
      }

      throw error;
    }
  };

  // Helper function to check if form is valid without throwing
  const checkValidity = (data: unknown) => {
    try {
      schema.parse(data);
      return true;
    } catch {
      return false;
    }
  };

  const validateField = (fieldName: string, value: unknown) => {
    try {
      // For object schemas, try to validate the specific field
      if ("shape" in schema && typeof schema.shape === "object") {
        const fieldSchema = (schema.shape as any)[fieldName];
        if (fieldSchema) {
          fieldSchema.parse(value);
          // Remove error for this field if validation passes
          if (errors.value[fieldName]) {
            delete errors.value[fieldName];
          }
          return { success: true };
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((issue) =>
          issue.path.includes(fieldName)
        );
        if (fieldError) {
          errors.value[fieldName] = fieldError.message;
        }
        return { success: false, error: fieldError?.message };
      }
    }

    return { success: true };
  };

  const clearErrors = () => {
    errors.value = {};
    isValid.value = false;
  };

  const getFieldError = (fieldName: string) => {
    return errors.value[fieldName] || "";
  };

  const updateValidity = (valid: boolean) => {
    isValid.value = valid;
  };

  return {
    errors: readonly(errors),
    isValid: readonly(isValid),
    validate,
    validateField,
    clearErrors,
    getFieldError,
    checkValidity,
    updateValidity,
  };
}
