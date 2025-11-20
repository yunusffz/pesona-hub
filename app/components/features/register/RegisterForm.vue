<template>
  <section
    class="relative grid grid-cols-1 lg:grid-cols-2 h-screen w-full 2xl:max-w-[1536px] 2xl:mx-auto bg-white overflow-hidden"
  >
    <img
      src="/assets/images/login.avif"
      alt="Register Image"
      class="lg:hidden absolute inset-0 object-cover w-full h-full z-10"
      loading="lazy"
    />
    <div class="relative hidden lg:block overflow-hidden">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 z-10 register-gradient-overlay"></div>

      <!-- Background image -->
      <img
        src="/assets/images/login.avif"
        alt="Register Image"
        class="absolute inset-0 object-cover w-full h-full"
      />

      <!-- Logo -->
      <div
        class="absolute h-[130px] top-10 left-10 z-20 flex items-center justify-center text-white"
      >
        <SvgIcon name="logo" size="327px" class="shrink-0" />
      </div>
    </div>

    <!-- FORM SECTION -->
    <div
      class="relative z-20 flex items-center justify-center p-6 sm:p-8 xl:p-12 lg:bg-white overflow-y-auto"
    >
      <div
        class="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] bg-white lg:bg-transparent rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none p-6 sm:p-8 lg:p-0 lg:px-2 max-h-screen lg:py-12 pb-20"
      >
        <div class="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <!-- Header -->
          <div class="text-center flex flex-col gap-2 sm:gap-3 lg:gap-4">
            <h1 class="text-xl sm:text-2xl font-semibold leading-8">
              Buat Akun Pesona Hub Digi
            </h1>
            <p class="text-sm lg:text-base text-neutral-500">
              Untuk Akses Informasi & Kolaborasi
            </p>
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm"
          >
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage || registerError?.value"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
          >
            {{ errorMessage || registerError?.value?.message }}
          </div>

          <!-- FORM -->
          <form
            @submit.prevent="handleRegister"
            class="flex flex-col gap-3 sm:gap-4 lg:gap-5"
          >
            <!-- Name -->
            <div class="flex flex-col gap-2">
              <label
                for="name"
                class="text-sm lg:text-base font-medium text-left"
              >
                Nama Lengkap
              </label>
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Masukkan Nama Lengkap Anda"
                :class="[
                  'h-[55px] placeholder:text-sm lg:placeholder:text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  getFieldError('name') ? 'border-red-500' : '',
                ]"
              />
              <p v-if="getFieldError('name')" class="text-sm text-red-600">
                {{ getFieldError("name") }}
              </p>
            </div>

            <!-- Username -->
            <div class="flex flex-col gap-2">
              <label
                for="username"
                class="text-sm lg:text-base font-medium text-left"
              >
                Username
              </label>
              <Input
                id="username"
                v-model="form.username"
                type="text"
                required
                autocomplete="username"
                placeholder="Pilih Username Anda"
                :class="[
                  'h-[55px] placeholder:text-sm lg:placeholder:text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  getFieldError('username') ? 'border-red-500' : '',
                ]"
              />
              <p v-if="getFieldError('username')" class="text-sm text-red-600">
                {{ getFieldError("username") }}
              </p>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label
                for="email"
                class="text-sm lg:text-base font-medium text-left"
              >
                Email
              </label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="Masukkan Email Anda"
                :class="[
                  'h-[55px] placeholder:text-sm lg:placeholder:text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  getFieldError('email') ? 'border-red-500' : '',
                ]"
              />
              <p v-if="getFieldError('email')" class="text-sm text-red-600">
                {{ getFieldError("email") }}
              </p>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <label
                for="password"
                class="text-sm lg:text-base font-medium text-left"
              >
                Kata Sandi
              </label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="new-password"
                placeholder="Buat Kata Sandi"
                :class="[
                  'h-[55px] placeholder:text-sm lg:placeholder:text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  getFieldError('password') ? 'border-red-500' : '',
                ]"
              />
              <p class="text-sm text-neutral-500">
                Minimal 8 karakter, gunakan kombinasi huruf dan angka
              </p>

              <!-- Password Strength Indicator -->
              <div v-if="form.password" class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="{
                        'bg-red-500': passwordStrength.score <= 1,
                        'bg-yellow-500': passwordStrength.score === 2,
                        'bg-blue-500': passwordStrength.score === 3,
                        'bg-green-500': passwordStrength.score >= 4,
                      }"
                      :style="{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    :class="['text-xs font-medium', passwordStrength.color]"
                  >
                    {{ passwordStrength.label }}
                  </span>
                </div>
              </div>

              <p v-if="getFieldError('password')" class="text-sm text-red-600">
                {{ getFieldError("password") }}
              </p>
            </div>

            <!-- Confirm Password -->
            <div class="flex flex-col gap-2">
              <label
                for="confirmPassword"
                class="text-sm lg:text-base font-medium text-left"
              >
                Konfirmasi Kata Sandi
              </label>
              <Input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                placeholder="Konfirmasi Kata Sandi"
                :class="[
                  'h-[55px] placeholder:text-sm lg:placeholder:text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  passwordMismatch || getFieldError('confirmPassword')
                    ? 'border-red-500'
                    : '',
                ]"
              />
              <p class="text-sm text-neutral-500">
                Ketik ulang kata sandi Anda untuk memastikan kesesuaian
              </p>
              <p
                v-if="passwordMismatch || getFieldError('confirmPassword')"
                class="text-sm text-red-600"
              >
                {{
                  getFieldError("confirmPassword") || "Kata sandi tidak cocok"
                }}
              </p>
            </div>

            <!-- Submit -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :disabled="
                isRegistering?.value || passwordMismatch?.valueOf() || !isValid
              "
              class="h-11 lg:h-12 text-base lg:text-lg font-medium mt-2"
            >
              <span
                v-if="isRegistering?.value"
                class="flex items-center justify-center"
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0
                    0 5.373 0 12h4zm2
                    5.291A7.962 7.962 0 014
                    12H0c0 3.042 1.135 5.824 3
                    7.938l3-2.647z"
                  />
                </svg>
                Membuat akun...
              </span>
              <span v-else>Daftar Sekarang</span>
            </BaseButton>
          </form>

          <!-- Footer -->
          <p class="text-xs lg:text-sm text-neutral-500 text-center">
            Sudah memiliki akun?
            <NuxtLink
              to="/login"
              class="font-bold text-primary hover:text-primary-hover"
            >
              Masuk di sini
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
    <LoaderDialog :showDialog="!!isRegistering?.value" :onClose="() => {}" />

    <ConfirmDialog
      :showDialog="showConfirmDialog"
      :onClose="() => (showConfirmDialog = false)"
    />
  </section>
</template>

<script setup lang="ts">
  import type { components } from "~/types/pesona-hub-api";
  import { useAuth } from "~/composables/useAuth";
  import { useFormValidation } from "~/composables/useFormValidation";
  import { registerSchema, type RegisterFormData } from "~/schemas/auth";
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import Input from "~/components/base/BaseInput.vue";
  import ConfirmDialog from "~/components/features/register/ConfirmDialog.vue";
  import LoaderDialog from "~/components/features/register/LoaderDialog.vue";

  const showConfirmDialog = ref(false);

  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();

  // Form validation
  const {
    errors,
    isValid,
    validate,
    validateField,
    getFieldError,
    checkValidity,
    updateValidity,
  } = useFormValidation(registerSchema);

  const form = reactive<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "PARTNER",
  });

  const errorMessage = ref("");
  const successMessage = ref("");

  // Password strength indicator
  const passwordStrength = computed(() => {
    const password = form.password;
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    const strengthMap = {
      0: { label: "Sangat Lemah", color: "text-red-500" },
      1: { label: "Lemah", color: "text-red-400" },
      2: { label: "Cukup", color: "text-yellow-500" },
      3: { label: "Baik", color: "text-blue-500" },
      4: { label: "Kuat", color: "text-green-500" },
      5: { label: "Sangat Kuat", color: "text-green-600" },
    };

    return { score, ...strengthMap[score as keyof typeof strengthMap] };
  });

  // Watch for password changes and validate
  watch(
    () => form.password,
    (newPassword) => {
      if (newPassword) {
        validateField("password", newPassword);
      }
    }
  );

  // Watch for confirm password changes
  watch(
    () => form.confirmPassword,
    (newConfirmPassword) => {
      if (newConfirmPassword) {
        validateField("confirmPassword", newConfirmPassword);
      }
    }
  );

  // Watch for all form changes and validate entire form
  watch(
    () => form,
    () => {
      // Only validate if all required fields have values
      if (
        form.name &&
        form.username &&
        form.email &&
        form.password &&
        form.confirmPassword
      ) {
        const isFormValid = checkValidity(form);
        updateValidity(isFormValid);
      } else {
        updateValidity(false);
      }
    },
    { deep: true }
  );

  const passwordMismatch = computed(() => {
    return (
      form.password !== form.confirmPassword && form.confirmPassword.length > 0
    );
  });

  const handleRegister = async () => {
    try {
      errorMessage.value = "";
      successMessage.value = "";

      // Validate form with Zod
      const validation = validate(form);
      if (!validation.success) {
        errorMessage.value = "Silakan periksa form Anda";
        return;
      }

      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name || null,
        role: form.role,
      });

      // Show confirm dialog after successful registration
      showConfirmDialog.value = true;
    } catch (error: any) {
      errorMessage.value =
        error.message || "Pendaftaran gagal. Silakan coba lagi.";
    }
  };
</script>

<style scoped>
  .register-gradient-overlay {
    background: linear-gradient(
      189.82deg,
      rgba(0, 0, 0, 0) -6.47%,
      rgba(0, 0, 0, 0.43) 74.73%
    );
  }
</style>
