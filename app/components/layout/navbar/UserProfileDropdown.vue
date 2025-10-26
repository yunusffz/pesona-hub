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
          LP
        </Avatar>
        <div class="flex justify-start text-left flex-col">
          <span class="font-medium leading-6">Lora Pradita</span>
          <span class="text-xs">Kementrian</span>
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
        @click="handleProfileClick"
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
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";

  interface Props {
    currentVariant?: "light" | "transparent";
  }

  const props = withDefaults(defineProps<Props>(), {
    currentVariant: "light",
  });

  // Handle menu item clicks
  const handleProfileClick = () => {
    // Navigate to profile page
    navigateTo("/profile");
  };

  const handleSettingsClick = () => {
    // Navigate to settings page
    navigateTo("/settings");
  };

  const handleHelpClick = () => {
    // Navigate to help page
    navigateTo("/help");
  };

  const handleLogoutClick = () => {
    // Handle logout logic
    console.log("Logout clicked");
    // You can implement actual logout logic here
  };
</script>
