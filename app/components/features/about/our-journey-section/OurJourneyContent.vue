<template>
  <div class="flex flex-col gap-10">
    <div v-if="tabs.length > 0" class="mx-auto">
      <BaseTabs :tabs="tabs" v-model:value="selected" />
    </div>

    <Transition :name="transitionName" mode="out-in">
      <div v-if="selectedVisi" :key="selectedVisi.id" class="grid grid-cols-2 gap-5">
        <div
          class="flex flex-col gap-6 bg-[#FAFAFA] pt-10 pl-10 pr-[60px] pb-[90px]"
        >
          <SvgIcon name="plant" size="18px" class="text-primary" />
          <h2 class="font-medium text-[28px]">{{ selectedVisi.title || selectedVisi.year }}</h2>
          <p class="text-md text-[#585858] leading-6">{{ selectedVisi.description }}</p>
        </div>
        <div class="rounded-[10px] h-[350px] overflow-hidden">
          <NuxtImg
            v-if="selectedVisi.image_object_name"
            :src="`${config.public.pesonaApiUrl}/files/${selectedVisi.image_object_name}`"
            :alt="`Visi ${selectedVisi.year}`"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseTabs from "@/components/base/Tabs.vue";
import SvgIcon from "~/components/base/SvgIcon.vue";
import { useAboutUs } from "~/queries/useAboutUs";

const config = useRuntimeConfig();
const { data } = useAboutUs();

const visiItems = computed(() =>
  [...(data.value?.visi ?? [])].sort((a, b) => a.year - b.year)
);

const tabs = computed(() =>
  visiItems.value.map((v) => ({ value: String(v.year), label: String(v.year) }))
);

const selected = ref("");
const previousSelected = ref("");

watch(
  visiItems,
  (items) => {
    if (items.length > 0 && !selected.value) {
      selected.value = String(items[0].year);
      previousSelected.value = String(items[0].year);
    }
  },
  { immediate: true }
);

const selectedVisi = computed(() =>
  visiItems.value.find((v) => String(v.year) === selected.value)
);

const transitionName = computed(() => {
  const currentIndex = tabs.value.findIndex((tab) => tab.value === selected.value);
  const previousIndex = tabs.value.findIndex((tab) => tab.value === previousSelected.value);
  return currentIndex > previousIndex ? "slide-left" : "slide-right";
});

watch(selected, (newVal, oldVal) => {
  previousSelected.value = oldVal;
});
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
