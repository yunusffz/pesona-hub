<template>
  <section
    class="relative grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full 2xl:max-w-[1536px] 2xl:mx-auto bg-white overflow-hidden"
  >
    <NuxtImg
      src="/assets/images/login.png"
      alt="Register Image"
      class="absolute inset-0 object-cover w-full h-full z-10"
    />
    <!-- IMAGE SECTION -->
    <div class="relative hidden lg:block overflow-hidden">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 z-10 register-gradient-overlay"></div>

      <!-- Background image -->
      <NuxtImg
        src="/assets/images/login.png"
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
      class="relative z-20 flex items-center justify-center p-6 sm:p-8 xl:p-12 lg:bg-white"
    >
      <div
        class="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] bg-white lg:bg-transparent rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none p-6 sm:p-8 lg:p-0 max-h-screen overflow-y-auto lg:py-12"
      >
        <div class="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <!-- Header -->
          <div class="text-center flex flex-col gap-2 sm:gap-3 lg:gap-4">
            <h1 class="text-xl sm:text-2xl font-semibold leading-8">
              Buat Akun Pesona Hub Digi
            </h1>
            <p class="text-sm lg:text-base text-muted-foreground">
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
                class="h-11 lg:h-12 placeholder:text-sm lg:placeholder:text-base placeholder:text-muted-foreground"
              />
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
                class="h-11 lg:h-12 placeholder:text-sm lg:placeholder:text-base placeholder:text-muted-foreground"
              />
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
                class="h-11 lg:h-12 placeholder:text-sm lg:placeholder:text-base placeholder:text-muted-foreground"
              />
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
                class="h-11 lg:h-12 placeholder:text-sm lg:placeholder:text-base placeholder:text-muted-foreground"
              />
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
                  'h-11 lg:h-12 placeholder:text-sm lg:placeholder:text-base placeholder:text-muted-foreground',
                  passwordMismatch ? 'border-red-500' : '',
                ]"
              />
              <p v-if="passwordMismatch" class="text-sm text-red-600">
                Kata sandi tidak cocok
              </p>
            </div>

            <!-- Submit -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :disabled="isRegistering?.value || passwordMismatch?.valueOf()"
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
          <p class="text-xs lg:text-sm text-muted-foreground text-center">
            Sudah memiliki akun?
            <NuxtLink
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Masuk di sini
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { components } from "~/types/pesona-hub-api";
  import { useAuth } from "~/composables/useAuth";
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import Input from "~/components/base/BaseInput.vue";

  definePageMeta({
    middleware: ["guest"] as any,
    layout: "auth",
  });

  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();

  type Roles = components["schemas"]["Roles"];

  const form = reactive({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "PARTNER" as Roles,
  });

  const errorMessage = ref("");
  const successMessage = ref("");

  const passwordMismatch = computed(() => {
    return (
      form.password !== form.confirmPassword && form.confirmPassword.length > 0
    );
  });

  const handleRegister = async () => {
    try {
      errorMessage.value = "";
      successMessage.value = "";

      if (passwordMismatch.value) {
        errorMessage.value = "Kata sandi tidak cocok";
        return;
      }

      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name || null,
        role: form.role,
      });

      successMessage.value = "Akun berhasil dibuat! Silakan masuk.";
      setTimeout(() => router.push("/login"), 2000);
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
