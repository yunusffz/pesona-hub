<template>
  <Dialog :open="open" @update:open="handleUpdateOpen">
    <DialogContent class="max-w-md py-4 px-4 rounded-xl w-full md:w-[444px]">
      <DialogHeader>
        <div class="flex flex-col gap-2 justify-center items-center mb-4">
          <div class="rounded-full bg-[#FEF3C6] p-3 mb-6">
            <CircleAlert class="w-6 h-6 text-[#E17100]"></CircleAlert>
          </div>
          <span class="font-semibold text-base md:text-[18px] text-neutral-1000 text-center">
            {{ title }}
          </span>
          <p class="text-[#717182] text-center text-xs md:text-sm">
            {{ description }}
          </p>
        </div>
      </DialogHeader>
      <DialogFooter class="gap-2 flex flex-col sm:flex-row !justify-center text-center items-center">
        <BaseButton
          variant="secondary"
          @click="handleCancel"
          size="sm"
          class="w-full sm:w-auto"
        >
          {{ cancelText }}
        </BaseButton>
        <NuxtLink to="/profil" class="w-full sm:w-auto">
          <BaseButton
            variant="primary"
            @click="handleConfirm"
            size="sm"
            class="w-full"
          >
            {{ confirmText }}
          </BaseButton>
        </NuxtLink>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { CircleAlert } from "lucide-vue-next";
  import BaseButton from "~/components/base/BaseButton.vue";
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
  } from "@/components/ui/dialog";

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    title: "Lengkapi Data Profil Terlebih Dahulu",
    description: "Untuk mengakses fitur ini, Anda perlu melengkapi profil organisasi dan informasi kebutuhan Anda terlebih dahulu.",
    confirmText: "Lengkapi Data Sekarang",
    cancelText: "Nanti Saja",
  });

  const emit = defineEmits<{
    "update:open": [value: boolean];
    confirm: [];
    cancel: [];
  }>();

  const handleUpdateOpen = (value: boolean) => {
    emit("update:open", value);
  };

  const handleConfirm = () => {
    emit("confirm");
    emit("update:open", false);
  };

  const handleCancel = () => {
    emit("cancel");
    emit("update:open", false);
  };
</script>
