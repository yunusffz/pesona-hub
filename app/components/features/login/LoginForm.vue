<template>
  <section>
    <div class="grid grid-cols-2 overflow-hidden rounded-xl w-[1180px] mx-auto">
      <div class="relative flex justify-between">
        <div
          class="absolute top-10 left-10 z-10 h-[62px] overflow-hidden flex items-center justify-center text-white"
        >
          <SvgIcon name="logo" size="327px" class="shrink-0" />
        </div>

        <!-- Linear gradient overlay -->
        <div class="absolute inset-0 z-10 login-gradient-overlay"></div>

        <NuxtImg
          src="/assets/images/login.png"
          alt="Login Image"
          class="max-h-[690px] object-cover w-full relative z-0"
          style="transform: rotate(0deg)"
        />
      </div>
      <div class="bg-white">
        <div
          class="w-[350px] h-full mx-auto flex gap-10 flex-col justify-center items-center"
        >
          <div
            class="text-center flex flex-col gap-4 justify-center items-center"
          >
            <h1 class="text-2xl font-semibold w-[283px] text-center leading-8">
              Masuk ke Akun Mitra Pesona Hub Digi
            </h1>
            <p class="text-sm leading-5 text-muted-foreground text-center">
              Akses sistem promosi, laporan, dan kolaborasi Anda secara langsung
              dengan masyarakat, mitra usaha, dan kementerian.
            </p>
          </div>

          <div class="flex flex-col gap-4 w-full">
            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-sm leading-5 text-left"
                >Username/Email Mitra</label
              >
              <Input
                id="email"
                type="email"
                class="placeholder:text-sm placeholder:text-muted-foreground"
                placeholder="Masukkan Email Terdaftar Anda"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="password" class="text-sm leading-5 text-left"
                >Kata Sandi</label
              >
              <Input
                id="password"
                type="password"
                class="placeholder:text-sm placeholder:text-muted-foreground"
                placeholder="Masukkan Kata Sandi"
              />
            </div>
            <BaseButton variant="primary" size="lg">Masuk Sekarang</BaseButton>
          </div>

          <p class="text-sm leading-5 text-muted-foreground text-center">
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
