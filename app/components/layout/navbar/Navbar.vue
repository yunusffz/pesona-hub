<template>
  <header
    :class="[
      'top-0 left-0 w-full z-20 flex items-center justify-between 2xl:px-20 lg:px-10 py-4 transition-colors duration-300 px-4',
      positionClass,
      headerClasses,
    ]"
  >
    <!-- Logo -->
    <div class="!h-[62px] overflow-hidden flex items-center justify-center">
      <SvgIcon
        name="logo"
        size="157px"
        class="shrink-0"
        :class="
          currentVariant === 'transparent' ? 'text-white' : 'text-neutral-900'
        "
      />
    </div>

    <!-- Menu -->
    <nav
      :class="[
        'hidden md:flex items-center space-x-8 font-medium text-md',
        navClasses,
      ]"
    >
      <NuxtLink to="/">Beranda</NuxtLink>
      <NuxtLink to="/tentang">Tentang Kami</NuxtLink>
      <NuxtLink to="/katalog">Katalog</NuxtLink>
      <NuxtLink to="/faq">FAQ</NuxtLink>
    </nav>
    <BaseButton variant="primary"
      ><NuxtLink to="/gabung">Gabung Mitra</NuxtLink></BaseButton
    >
  </header>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  import { computed } from "vue";
  import SvgIcon from "~/components/base/SvgIcon.vue";

  interface Props {
    variant?: "light" | "transparent";
    ctaText?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "light",
    ctaText: "Gabung Mitra",
  });

  const route = useRoute();

  // Determine current variant dynamically based on route
  const currentVariant = computed(() => {
    const path = route.path;

    // Check for exact homepage match first
    if (path === "/") return "transparent";
    if (path === "/katalog") return "transparent";

    // Check for katalog detail pages (e.g., /katalog/some-slug)
    if (path.startsWith("/katalog/") && path !== "/katalog/") return "light";
    if (path.startsWith("/tentang")) return "light";
    if (path.startsWith("/faq")) return "light";
    if (path.startsWith("/gabung")) return "light";

    // Fallback to prop
    return props.variant;
  });

  // Position class based on variant
  const positionClass = computed(() => {
    return currentVariant.value === "light" ? "relative" : "absolute";
  });

  // Header background and text color classes
  const headerClasses = computed(() => {
    switch (currentVariant.value) {
      case "transparent":
        return "text-white bg-transparent";
      case "light":
      default:
        return "text-neutral-900 bg-white ";
    }
  });

  // Navigation text color classes
  const navClasses = computed(() => {
    switch (currentVariant.value) {
      case "transparent":
        return "text-white";
      case "light":
      default:
        return "text-neutral-900";
    }
  });

  // CTA button classes
  const ctaClasses = computed(() => {
    return "bg-primary text-white hover:bg-primary/90";
  });
</script>
