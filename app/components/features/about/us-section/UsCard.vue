<template>
  <div :class="cardClasses">
    <div class="rounded-[10px] h-[100px] w-[90px]">
      <NuxtImg
        :src="imageSrc"
        :alt="imageAlt"
        class="rounded-[10px] h-full w-full object-cover"
      />
    </div>

    <div class="flex flex-col gap-3">
      <h3 :class="titleClasses">{{ title }}</h3>
      <p :class="descriptionClasses">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    variant?: "default" | "primary" | "secondary" | "accent";
    title?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    title: "Inovasi Efektif",
    description:
      "Kami menghadirkan solusi digital yang mempermudah promosi, distribusi, dan kolaborasi antar mitra Perhutanan sosial.",
    imageSrc: "/assets/images/about-1.png",
    imageAlt: "About 1",
  });

  const cardClasses = computed(() => {
    const baseClasses =
      "h-[298px] rounded-[10px] p-5 flex flex-col gap-[50px] justify-between";

    switch (props.variant) {
      case "primary":
        return `${baseClasses} bg-primary`;
      case "secondary":
        return `${baseClasses} bg-black`;
      default:
        return `${baseClasses} bg-[#FAFAFA]`;
    }
  });

  const titleClasses = computed(() => {
    const baseClasses = "text-[20px] font-semibold leading-[24px]";

    switch (props.variant) {
      case "primary":
        return `${baseClasses} text-white`;
      case "secondary":
        return `${baseClasses} text-white`;
      default:
        return `${baseClasses} text-gray-900`;
    }
  });

  const descriptionClasses = computed(() => {
    const baseClasses = "text-md";

    switch (props.variant) {
      case "primary":
        return `${baseClasses} text-white`;
      case "secondary":
        return `${baseClasses} text-white`;
      default:
        return `${baseClasses} text-[#585858]`;
    }
  });
</script>
