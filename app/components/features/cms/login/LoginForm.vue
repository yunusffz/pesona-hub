<template>
  <section
    class="relative min-h-screen w-full 2xl:max-w-[1536px] 2xl:mx-auto bg-white overflow-hidden"
  >
    <img
      src="/assets/images/login.avif"
      alt="Login Image"
      class="lg:hidden absolute inset-0 object-cover w-full h-full z-10"
    />
    <!-- FORM SECTION -->
    <div
      class="relative z-20 flex items-center justify-center min-h-screen p-6 sm:p-8 xl:p-12 lg:bg-white"
    >
      <div
        class="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] bg-white lg:bg-transparent rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none p-6 sm:p-8 lg:p-0 lg:px-2 max-h-screen overflow-y-auto lg:py-12"
      >
        <div class="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <!-- Header -->
          <div
            class="text-center flex justify-center flex-col gap-2 sm:gap-3 lg:gap-4"
          >
            <img
              src="/assets/images/logo.png"
              alt="Pesona Hub Logo"
              class="h-8 sm:h-9 lg:h-10 w-auto mx-auto"
            />
            <h1
              class="text-2xl sm:text-2xltext-center font-semibold leading-8 w-[279px] mx-auto"
            >
              Masuk ke Admin Pesona Hub Digi
            </h1>
            <p class="text-sm lg:text-base text-neutral-500">
              Akses Content Management System Pesona Hub Digi untuk mengelola
              konten di Pesona Hub Digi
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
                Username
              </label>
              <Input
                id="username"
                v-model="form.username"
                type="text"
                required
                autocomplete="username"
                placeholder="Masukkan Username Anda"
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
                class="flex items-center justify-center gap-2"
              >
                <Loader2 class="animate-spin h-5 w-5" />
                Memproses...
              </span>
              <span v-else>Masuk ke Admin</span>
            </BaseButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
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
    await navigateTo("/cms");
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
