<template>
  <header
    :class="[
      ' w-full  z-20 py-4 transition-colors duration-300',
      positionClass,
      headerClasses,
    ]"
  >
    <div
      class="2xl:max-w-[1536px] flex items-center justify-between mx-auto 2xl:px-20 lg:px-10 px-4"
    >
      <!-- Logo -->
      <a href="/">
        <div class="!h-[62px] overflow-hidden flex items-center justify-center">
          <SvgIcon
            name="logo"
            size="157px"
            class="shrink-0"
            :class="
              currentVariant === 'transparent'
                ? 'text-white'
                : 'text-neutral-900'
            "
          />
        </div>
      </a>

      <!-- Desktop Menu -->
      <nav
        :class="[
          'hidden lg:flex items-center space-x-8 font-medium text-md',
          navClasses,
        ]"
      >
        <NuxtLink
          to="/"
          :class="[
            'relative pb-1 transition-colors hover:opacity-80',
            isActiveRoute('/')
              ? currentVariant === 'transparent'
                ? 'border-b-2 border-white'
                : 'border-b-2 border-primary-600'
              : currentVariant === 'transparent'
              ? 'hover:border-b-2 hover:border-white/50'
              : 'hover:border-b-2 hover:border-primary-600/50',
          ]"
        >
          Beranda
        </NuxtLink>
        <NuxtLink
          to="/tentang"
          :class="[
            'relative pb-1 transition-colors hover:opacity-80',
            isActiveRoute('/tentang')
              ? currentVariant === 'transparent'
                ? 'border-b-2 border-white'
                : 'border-b-2 border-primary-600'
              : currentVariant === 'transparent'
              ? 'hover:border-b-2 hover:border-white/50'
              : 'hover:border-b-2 hover:border-primary-600/50',
          ]"
        >
          Tentang Kami
        </NuxtLink>
        <NuxtLink
          to="/katalog"
          :class="[
            'relative pb-1 transition-colors hover:opacity-80',
            isActiveRoute('/katalog')
              ? currentVariant === 'transparent'
                ? 'border-b-2 border-white'
                : 'border-b-2 border-primary-600'
              : currentVariant === 'transparent'
              ? 'hover:border-b-2 hover:border-white/50'
              : 'hover:border-b-2 hover:border-primary-600/50',
          ]"
        >
          Katalog
        </NuxtLink>
        <NuxtLink
          to="/faq"
          :class="[
            'relative pb-1 transition-colors hover:opacity-80',
            isActiveRoute('/faq')
              ? currentVariant === 'transparent'
                ? 'border-b-2 border-white'
                : 'border-b-2 border-primary-600'
              : currentVariant === 'transparent'
              ? 'hover:border-b-2 hover:border-white/50'
              : 'hover:border-b-2 hover:border-primary-600/50',
          ]"
        >
          FAQ
        </NuxtLink>
      </nav>

      <!-- Desktop CTA Button -->
      <div class="hidden lg:block">
        <!-- Show UserProfileDropdown if authenticated, otherwise show Gabung Mitra button -->
        <UserProfileDropdown
          v-if="isAuthenticated"
          :current-variant="currentVariant"
        />
        <NuxtLink v-else to="/login">
          <BaseButton variant="primary"> Gabung Mitra </BaseButton>
        </NuxtLink>
      </div>

      <!-- Mobile Menu Button -->
      <Dialog v-model:open="isMobileMenuOpen">
        <DialogTrigger as-child>
          <button
            class="lg:hidden p-2 rounded-md transition-colors"
            :class="
              currentVariant === 'transparent'
                ? 'text-white hover:bg-white/10'
                : 'text-neutral-900 hover:bg-neutral-100'
            "
            aria-label="Open mobile menu"
          >
            <SvgIcon name="mobile-nav" size="30px" />
          </button>
        </DialogTrigger>

        <!-- Mobile Menu Drawer -->
        <Teleport to="body">
          <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50">
            <!-- Backdrop -->
            <div
              class="fixed inset-0 bg-black/50"
              @click="closeMobileMenu"
            ></div>

            <!-- Drawer -->
            <div
              class="fixed top-0 right-0 bottom-0 h-screen w-80 max-w-[85vw] bg-white shadow-xl border-l"
            >
              <div class="flex flex-col h-screen bg-white overflow-hidden">
                <!-- Mobile Menu Header -->
                <div
                  class="flex items-center justify-between p-4 border-b flex-shrink-0"
                >
                  <div class="flex items-center space-x-3 h-8">
                    <SvgIcon
                      name="logo"
                      size="150px"
                      class="text-neutral-900"
                    />
                  </div>
                  <button
                    class="p-2 rounded-md hover:bg-neutral-100 transition-colors"
                    aria-label="Close mobile menu"
                    @click="closeMobileMenu"
                  >
                    <SvgIcon
                      name="mobile-nav"
                      size="24px"
                      class="text-neutral-600"
                    />
                  </button>
                </div>

                <!-- Mobile Menu Navigation - Scrollable -->
                <nav class="flex-1 px-4 py-6 overflow-y-auto">
                  <div class="space-y-4">
                    <NuxtLink
                      to="/"
                      :class="[
                        'block text-lg font-medium transition-colors py-2 relative',
                        isActiveRoute('/')
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-neutral-900 hover:text-primary-600',
                      ]"
                      @click="closeMobileMenu"
                    >
                      Beranda
                    </NuxtLink>
                    <NuxtLink
                      to="/tentang"
                      :class="[
                        'block text-lg font-medium transition-colors py-2 relative',
                        isActiveRoute('/tentang')
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-neutral-900 hover:text-primary-600',
                      ]"
                      @click="closeMobileMenu"
                    >
                      Tentang Kami
                    </NuxtLink>
                    <NuxtLink
                      to="/katalog"
                      :class="[
                        'block text-lg font-medium transition-colors py-2 relative',
                        isActiveRoute('/katalog')
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-neutral-900 hover:text-primary-600',
                      ]"
                      @click="closeMobileMenu"
                    >
                      Katalog
                    </NuxtLink>
                    <NuxtLink
                      to="/faq"
                      :class="[
                        'block text-lg font-medium transition-colors py-2 relative',
                        isActiveRoute('/faq')
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-neutral-900 hover:text-primary-600',
                      ]"
                      @click="closeMobileMenu"
                    >
                      FAQ
                    </NuxtLink>
                  </div>
                </nav>

                <!-- Mobile CTA Section - Fixed at bottom -->
                <div class="p-4 border-t bg-neutral-50 flex-shrink-0">
                  <!-- Show user profile section if authenticated -->
                  <div v-if="isAuthenticated" class="space-y-3">
                    <!-- User Info -->
                    <div
                      class="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                    >
                      <Avatar
                        class="text-neutral-1000 flex items-center justify-center bg-neutral-100"
                      >
                        {{ userInitials }}
                      </Avatar>
                      <div class="flex-1">
                        <div class="font-medium text-neutral-900">
                          {{ user?.name || "User" }}
                        </div>
                        <div class="text-sm text-neutral-600">
                          {{ user?.email || "user@example.com" }}
                        </div>
                      </div>
                    </div>

                    <!-- Mobile Menu Actions -->
                    <div class="space-y-2">
                      <BaseButton
                        variant="secondary"
                        class="w-full justify-center text-base py-3"
                        @click="handleProfileClick"
                      >
                        <Icon name="uil:user" size="16px" class="mr-2" />
                        Profil Saya
                      </BaseButton>
                      <BaseButton
                        variant="secondary"
                        class="w-full justify-center text-base py-3"
                        @click="handleDashboardClick"
                      >
                        <Icon
                          name="mingcute:layout-line"
                          size="16px"
                          class="mr-2"
                        />
                        Dashboard
                      </BaseButton>
                      <BaseButton
                        variant="solid"
                        class="w-full justify-center text-base py-3"
                        @click="handleLogoutClick"
                      >
                        <Icon name="uil:signout" size="16px" class="mr-2" />
                        Keluar
                      </BaseButton>
                    </div>
                  </div>

                  <!-- Show Gabung Mitra button if not authenticated -->
                  <NuxtLink to="/register" class="w-full" v-else>
                    <BaseButton
                      variant="primary"
                      class="w-full justify-center text-base py-3"
                      @click="closeMobileMenu"
                    >
                      Gabung Mitra
                    </BaseButton>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </Dialog>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  import { computed, ref, watch, onUnmounted, Teleport } from "vue";
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import UserProfileDropdown from "./UserProfileDropdown.vue";
  import { useAuth } from "~/composables/useAuth";

  interface Props {
    variant?: "light" | "transparent";
    ctaText?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "light",
    ctaText: "Gabung Mitra",
  });

  const route = useRoute();

  // Authentication
  const { user, isAuthenticated, logout } = useAuth();

  // Mobile menu state
  const isMobileMenuOpen = ref(false);

  // User initials for avatar
  const userInitials = computed(() => {
    if (!user.value?.name) return "U";
    const names = user.value.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  });

  // Close mobile menu method
  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
  };

  // Mobile menu action handlers
  const handleProfileClick = () => {
    closeMobileMenu();
    navigateTo("/profil");
  };

  const handleDashboardClick = () => {
    closeMobileMenu();
    navigateTo("/dashboard");
  };

  const handleLogoutClick = async () => {
    closeMobileMenu();
    await logout();
  };

  // Prevent body scroll when mobile menu is open
  watch(isMobileMenuOpen, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      document.body.style.overflow = "";
      // Kembalikan posisi scroll setelah drawer ditutup
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    document.body.style.overflow = "";
  });

  // Determine current variant dynamically based on route
  const currentVariant = computed(() => {
    const path = route.path;

    // Check for exact homepage match first
    if (path === "/") return "transparent";
    if (path === "/katalog") return "transparent";
    if (path === "/dashboard") return "transparent";

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

  // Active navigation logic
  const isActiveRoute = (path: string) => {
    const currentPath = route.path;

    // For exact matches
    if (path === "/" && currentPath === "/") return true;
    if (path === "/katalog" && currentPath === "/katalog") return true;

    // For nested routes (e.g., /katalog/some-slug should be active when on /katalog)
    if (path === "/katalog" && currentPath.startsWith("/katalog/")) return true;
    if (path === "/tentang" && currentPath.startsWith("/tentang")) return true;
    if (path === "/faq" && currentPath.startsWith("/faq")) return true;

    return false;
  };
</script>
