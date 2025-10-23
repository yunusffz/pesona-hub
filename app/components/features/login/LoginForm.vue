<template>
  <section
    class="relative overflow-hidden h-screen w-full 2xl:max-w-[1536px] 2xl:max-h-[960px] 2xl:mx-auto 2xl:shadow-lg"
  >
    <!-- Background Image (Mobile & Tablet) -->
    <div class="absolute inset-0 lg:hidden">
      <!-- Linear gradient overlay -->
      <div class="absolute inset-0 z-10 login-gradient-overlay"></div>

      <NuxtImg
        src="/assets/images/login.png"
        alt="Login Image"
        class="absolute inset-0 object-cover w-full h-full"
      />

      <!-- Logo on top of background -->
      <div
        class="absolute top-6 h-[40px] left-6 z-20 flex items-center justify-center text-white"
      >
        <SvgIcon name="logo" size="327px" class="shrink-0" />
      </div>
    </div>

    <!-- Desktop Layout: Side by Side -->
    <div class="hidden lg:flex lg:flex-row h-full">
      <!-- Image Section (Desktop) -->
      <div class="relative flex-1 overflow-hidden">
        <div
          class="absolute left-6 top-10 h-[100px] z-20 flex items-center justify-center text-white"
        >
          <SvgIcon name="logo" size="327px" class="shrink-0" />
        </div>

        <!-- Linear gradient overlay -->
        <div class="absolute inset-0 z-10 login-gradient-overlay"></div>

        <NuxtImg
          src="/assets/images/login.png"
          alt="Login Image"
          class="absolute inset-0 object-cover w-full h-full"
        />
      </div>

      <!-- Form Section (Desktop) -->
      <div class="flex-1 flex items-center justify-center bg-white p-8 xl:p-12">
        <div class="w-full max-w-[400px] xl:max-w-[440px]">
          <div class="flex flex-col gap-6 lg:gap-8">
            <!-- Header -->
            <div class="text-center flex flex-col gap-3 lg:gap-4">
              <h1
                class="text-xl sm:text-2xl lg:text-3xl font-semibold leading-7 sm:leading-8 lg:leading-9"
              >
                Masuk ke Akun Mitra Pesona Hub Digi
              </h1>
              <p
                class="text-sm lg:text-base leading-5 lg:leading-6 text-muted-foreground"
              >
                Akses sistem promosi, laporan, dan kolaborasi Anda secara
                langsung dengan masyarakat, mitra usaha, dan kementerian.
              </p>
            </div>

            <!-- Error Message -->
            <div
              v-if="errors.general"
              class="bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <p class="text-sm text-red-600">{{ errors.general }}</p>
            </div>

            <!-- Form Fields -->
            <form
              @submit.prevent="handleSubmit"
              class="flex flex-col gap-4 lg:gap-5"
            >
              <div class="flex flex-col gap-2">
                <label
                  for="email-desktop"
                  class="text-sm lg:text-base leading-5 lg:leading-6 text-left font-medium"
                >
                  Username/Email Mitra
                </label>
                <Input
                  id="email-desktop"
                  v-model="formData.username"
                  type="email"
                  class="placeholder:text-sm lg:placeholder:text-base placeholder:text-muted-foreground h-11 lg:h-12"
                  :class="{ 'border-red-500': errors.username }"
                  placeholder="Masukkan Email Terdaftar Anda"
                  @input="clearErrors"
                />
                <p v-if="errors.username" class="text-sm text-red-600">
                  {{ errors.username }}
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <label
                  for="password-desktop"
                  class="text-sm lg:text-base leading-5 lg:leading-6 text-left font-medium"
                >
                  Kata Sandi
                </label>
                <Input
                  id="password-desktop"
                  v-model="formData.password"
                  type="password"
                  class="placeholder:text-sm lg:placeholder:text-base placeholder:text-muted-foreground h-11 lg:h-12"
                  :class="{ 'border-red-500': errors.password }"
                  placeholder="Masukkan Kata Sandi"
                  @input="clearErrors"
                />
                <p v-if="errors.password" class="text-sm text-red-600">
                  {{ errors.password }}
                </p>
              </div>

              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                class="h-11 lg:h-12 text-base lg:text-lg font-medium mt-2"
                :disabled="isLoggingIn"
              >
                <span v-if="isLoggingIn">Memproses...</span>
                <span v-else>Masuk Sekarang</span>
              </BaseButton>
            </form>

            <!-- Footer Text -->
            <p
              class="text-xs lg:text-sm leading-4 lg:leading-5 text-muted-foreground text-center"
            >
              Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan
              Kebijakan Privasi Pesona Hub Digi.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile/Tablet Layout: Form over background -->
    <div
      class="lg:hidden relative z-30 h-full flex items-center justify-center p-6"
    >
      <div
        class="w-full max-w-[380px] bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
      >
        <div class="flex flex-col gap-6">
          <!-- Header -->
          <div class="text-center flex flex-col gap-3">
            <h1
              class="text-xl sm:text-2xl font-semibold leading-7 sm:leading-8"
            >
              Masuk ke Akun Mitra Pesona Hub Digi
            </h1>
            <p class="text-sm leading-5 text-muted-foreground">
              Akses sistem promosi, laporan, dan kolaborasi Anda secara langsung
              dengan masyarakat, mitra usaha, dan kementerian.
            </p>
          </div>

          <!-- Error Message -->
          <div
            v-if="errors.general"
            class="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p class="text-sm text-red-600">{{ errors.general }}</p>
          </div>

          <!-- Form Fields -->
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label
                for="email-mobile"
                class="text-sm leading-5 text-left font-medium"
              >
                Username/Email Mitra
              </label>
              <Input
                id="email-mobile"
                v-model="formData.username"
                type="email"
                class="placeholder:text-sm placeholder:text-muted-foreground h-11"
                :class="{ 'border-red-500': errors.username }"
                placeholder="Masukkan Email Terdaftar Anda"
                @input="clearErrors"
              />
              <p v-if="errors.username" class="text-sm text-red-600">
                {{ errors.username }}
              </p>
            </div>

            <div class="flex flex-col gap-2">
              <label
                for="password-mobile"
                class="text-sm leading-5 text-left font-medium"
              >
                Kata Sandi
              </label>
              <Input
                id="password-mobile"
                v-model="formData.password"
                type="password"
                class="placeholder:text-sm placeholder:text-muted-foreground h-11"
                :class="{ 'border-red-500': errors.password }"
                placeholder="Masukkan Kata Sandi"
                @input="clearErrors"
              />
              <p v-if="errors.password" class="text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>

            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              class="h-11 text-base font-medium mt-2"
              :disabled="isLoggingIn"
            >
              <span v-if="isLoggingIn">Memproses...</span>
              <span v-else>Masuk Sekarang</span>
            </BaseButton>
          </form>

          <!-- Footer Text -->
          <p class="text-xs leading-4 text-muted-foreground text-center">
            Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan
            Privasi Pesona Hub Digi.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import Input from "~/components/base/BaseInput.vue";
  import BaseButton from "~/components/base/BaseButton.vue";

  // Form data
  const formData = reactive({
    username: "",
    password: "",
  });

  // Form validation
  const errors = reactive({
    username: "",
    password: "",
    general: "",
  });

  // Auth composable
  const { login, isLoggingIn, loginError } = useAuth();

  // Form validation
  const validateForm = () => {
    errors.username = "";
    errors.password = "";
    errors.general = "";

    if (!formData.username.trim()) {
      errors.username = "Username/Email harus diisi";
      return false;
    }

    if (!formData.password.trim()) {
      errors.password = "Kata sandi harus diisi";
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await login({
        username: formData.username,
        password: formData.password,
      });

      // Redirect to dashboard or home page after successful login
      await navigateTo("/");
    } catch (error) {
      console.error("Login error:", error);
      errors.general =
        "Login gagal. Periksa kembali username dan password Anda.";
    }
  };

  // Clear errors when user types
  const clearErrors = () => {
    errors.general = "";
  };

  // Watch for login errors
  watch(loginError, (error) => {
    if (error) {
      errors.general = "Username atau password salah";
    }
  });
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
