<template>
  <Dialog :open="showDialog" @update:open="onClose">
    <DialogContent class="max-w-sm bg-white overflow-hidden p-0">
      <div class="flex flex-col items-center justify-center gap-4 p-6">
        <div class="relative inline-flex items-center justify-center">
          <SvgIcon
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[56px] text-[#DFE0E2] pointer-events-none"
            name="pattern-dotted"
            size="150px"
          />
          <div
            class="bg-[#F3FFF2] rounded-full w-14 h-14 flex justify-center items-center relative z-10"
          >
            <Check class="text-primary" />
          </div>
        </div>
        <div class="z-10 flex flex-col gap-1.5 justify-center text-center">
          <div class="text-md font-medium text-neutral-1000">
            Akun Anda berhasil dibuat!
          </div>
          <div class="text-neutral-500 text-sm">
            Silakan login untuk mulai menjelajahi data, berita, dan kegiatan
            seputar kehutanan sosial.
          </div>
        </div>
      </div>
      <div class="border-t border-[#E8E8E8]">
        <div class="flex items-center justify-center gap-4 p-6">
          <BaseButton
            variant="secondary"
            size="lg"
            class="w-full"
            @click="
              () => {
                onClose();
                router.push('/');
              }
            "
          >
            kembali ke Beranda
          </BaseButton>
          <BaseButton
            variant="primary"
            size="lg"
            class="w-full"
            @click="
              () => {
                onClose();
                router.push('/login');
              }
            "
          >
            Masuk Sekarang
          </BaseButton>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { Dialog } from "@/components/ui/dialog";
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import { Check } from "lucide-vue-next";

  const router = useRouter();

  const props = defineProps<{
    isLoading?: boolean;
    showDialog?: boolean;
    onClose: () => void;
  }>();
</script>
