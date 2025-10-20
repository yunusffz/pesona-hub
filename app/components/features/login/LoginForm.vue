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
        <div
          class="absolute inset-0 z-10"
          style="
            background: linear-gradient(
              189.82deg,
              rgba(0, 0, 0, 0) -6.47%,
              rgba(0, 0, 0, 0.43) 74.73%
            );
          "
        ></div>

        <NuxtImg
          src="/assets/images/login.png"
          alt="Login Image"
          class="max-h-[690px] object-cover w-full relative z-0"
          style="transform: rotate(0deg)"
        />
      </div>
      <div class="bg-white flex flex-col gap-10">
        <div
          class="w-[350px] text-center h-full mx-auto flex flex-col justify-center items-center"
        >
          <div class="text-center flex flex-col gap-4">
            <h1 class="text-2xl font-semibold w-[283px] text-center leading-8">
              Masuk ke Akun Mitra Pesona Hub Digi
            </h1>
            <p
              class="text-sm leading-5 text-muted-foreground w-[283px] text-center"
            >
              Akses sistem promosi, laporan, dan kolaborasi Anda secara langsung
              dengan masyarakat, mitra usaha, dan kementerian.
            </p>
          </div>

          <div class="flex flex-col gap-6">
            <label for="email" class="text-sm leading-5 text-muted-foreground"
              >Emailaaaaa</label
            >
            <Input type="email" placeholder="Email" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/ui/SvgIcon.vue";
</script>
