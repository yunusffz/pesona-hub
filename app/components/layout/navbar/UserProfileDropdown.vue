<template>
  <DropdownMenu>
    <!-- Trigger Button -->
    <DropdownMenuTrigger as-child>
      <BaseButton
        variant="solid"
        :class="[
          'gap-4 py-2 px-4 border cursor-pointer',
          currentVariant === 'transparent'
            ? 'bg-[#FFFFFF42] text-white hover:border-neutral-300 hover:bg-[#FFFFFF73]'
            : 'hover:bg-[#FFFFFFD9] bg-[#FFFFFF73] hover:text-neutral-1000 border-neutral-200 hover:border-neutral-300',
        ]"
      >
        <Avatar
          class="text-neutral-1000 flex items-center justify-center bg-neutral-100"
        >
          {{ userInitials }}
        </Avatar>
        <div class="flex justify-start text-left flex-col">
          <span class="font-medium leading-6">{{ user?.name || "User" }}</span>
          <span class="text-xs">{{ user?.email || "user@example.com" }}</span>
        </div>
        <Icon name="uil:angle-down" size="24px" />
      </BaseButton>
    </DropdownMenuTrigger>

    <!-- Dropdown Content -->
    <DropdownMenuContent
      class="w-40 bg-[#FFFFFFE5] font-medium text-sm rounded-3xl p-4 gap-2 flex flex-col"
      align="start"
    >
      <!-- Menu Items -->
      <DropdownMenuItem
        @click="handleProfileClick"
        class="hover:bg-[#D2D2D2BF] rounded-lg cursor-pointer"
      >
        <Icon name="uil:user" size="16px" />
        <span>Profil Saya</span>
      </DropdownMenuItem>
      <!-- Menu Items -->
      <DropdownMenuItem
        @click="handleDashboardClick"
        class="hover:bg-[#D2D2D2BF] rounded-lg cursor-pointer"
      >
        <Icon name="mingcute:layout-line" size="16px" />
        <span>Dashboard</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator class="mx-2 border border-[#8E8E8E40]" />

      <DropdownMenuItem
        variant="destructive"
        @click="handleLogoutClick"
        class="hover:bg-[#D2D2D2BF] rounded-lg cursor-pointer"
      >
        <Icon name="uil:signout" size="16px" />
        <span>Keluar</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";
  import { useAuth } from "~/composables/useAuth";

  interface Props {
    currentVariant?: "light" | "transparent";
  }

  const props = withDefaults(defineProps<Props>(), {
    currentVariant: "light",
  });

  // Authentication
  const { user, logout } = useAuth();

  // User initials for avatar
  const userInitials = computed(() => {
    if (!user.value?.name) return "U";
    const names = user.value.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  });

  // Handle menu item clicks
  const handleProfileClick = () => {
    // Navigate to profile page
    navigateTo("/profil");
  };

  const handleDashboardClick = () => {
    // Navigate to dashboard page
    navigateTo("/dashboard");
  };

  const handleLogoutClick = async () => {
    // Handle logout logic
    await logout();
  };
</script>
