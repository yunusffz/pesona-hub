<template>
  <section
    class="relative grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full 2xl:max-w-[1536px] 2xl:mx-auto bg-white overflow-hidden"
  >
    <img
      src="/assets/images/login.avif"
      alt="Login Image"
      class="lg:hidden absolute inset-0 object-cover w-full h-full z-10"
    />
    <div class="relative hidden lg:block overflow-hidden">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 z-10 login-gradient-overlay"></div>

      <!-- Background image -->
      <img
        src="/assets/images/login.avif"
        alt="Login Image"
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
      class="relative z-20 flex items-center justify-center p-6 sm:p-8 xl:p-12 lg:bg-white"
    >
      <div
        class="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] bg-white lg:bg-transparent rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none p-6 sm:p-8 lg:p-0 lg:px-2 max-h-screen overflow-y-auto lg:py-12"
      >
        <div class="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <!-- Header -->
          <div class="text-center flex flex-col gap-2 sm:gap-3 lg:gap-4">
            <h1 class="text-xl sm:text-2xl font-semibold leading-8">
              Masuk ke Akun Pesona Hub Digi
            </h1>
            <p class="text-sm lg:text-base text-neutral-500">
              Akses Informasi & Kolaborasi
            </p>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage || loginError?.value"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
          >
            {{ errorMessage || loginError?.value?.message }}
          </div>

          <!-- FORM -->
          <form
            @submit.prevent="handleLogin"
            class="flex flex-col gap-3 sm:gap-4 lg:gap-5"
          >
            <!-- Username/Email -->
            <div class="flex flex-col gap-2">
              <label
                for="username"
                class="text-sm lg:text-base font-medium text-left"
              >
                Username/Email
              </label>
              <Input
                id="username"
                v-model="form.username"
                type="text"
                required
                autocomplete="username"
                placeholder="Masukkan Username/Email Anda"
                :class="[
                  'h-[55px] placeholder:text-sm lg:placeholder:text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  getFieldError('username') ? 'border-red-500' : '',
                ]"
              />
              <p v-if="getFieldError('username')" class="text-sm text-red-600">
                {{ getFieldError("username") }}
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
                autocomplete="current-password"
                placeholder="Masukkan Kata Sandi"
                :class="[
                  'h-[55px] placeholder:text-sm lg:placeholder:text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  getFieldError('password') ? 'border-red-500' : '',
                ]"
              />
              <p v-if="getFieldError('password')" class="text-sm text-red-600">
                {{ getFieldError("password") }}
              </p>
            </div>

            <!-- Submit -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :disabled="isLoggingIn?.value || !isValid"
              class="h-11 lg:h-12 text-base lg:text-lg font-medium mt-2"
            >
              <span
                v-if="isLoggingIn?.value"
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
                Memproses...
              </span>
              <span v-else>Masuk Sekarang</span>
            </BaseButton>
          </form>

          <!-- Footer -->
          <p class="text-xs lg:text-sm text-neutral-500 text-center">
            Belum memiliki akun?
            <NuxtLink
              to="/register"
              class="font-bold text-primary hover:text-primary-hover"
            >
              Daftar di sini
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useAuth } from "~/composables/useAuth";
  import { useFormValidation } from "~/composables/useFormValidation";
  import { loginSchema, type LoginFormData } from "~/schemas/auth";
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import Input from "~/components/base/BaseInput.vue";
  import BaseButton from "~/components/base/BaseButton.vue";

  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();

  // Form validation
  const {
    errors,
    isValid,
    validate,
    validateField,
    getFieldError,
    checkValidity,
    updateValidity,
  } = useFormValidation(loginSchema);

  const form = reactive<LoginFormData>({
    username: "",
    password: "",
  });

  const errorMessage = ref("");

  // Watch for all form changes and validate entire form
  watch(
    () => form,
    () => {
      // Only validate if all required fields have values
      if (form.username && form.password) {
        const isFormValid = checkValidity(form);
        updateValidity(isFormValid);
      } else {
        updateValidity(false);
      }
    },
    { deep: true }
  );

  const handleLogin = async () => {
    try {
      errorMessage.value = "";

      // Validate form with Zod
      const validation = validate(form);
      if (!validation.success) {
        errorMessage.value = "Silakan periksa form Anda";
        return;
      }

      await login({
        username: form.username,
        password: form.password,
      });

      // Redirect to dashboard or home page after successful login
      await navigateTo("/");
    } catch (error: any) {
      errorMessage.value =
        error.message ||
        "Login gagal. Periksa kembali username dan password Anda.";
    }
  };
</script>

<style scoped>
  .login-gradient-overlay {
    background: linear-gradient(
      189.82deg,
      rgba(0, 0, 0, 0) -6.47%,
      rgba(0, 0, 0, 0.43) 74.73%
    );
  }
</style>
