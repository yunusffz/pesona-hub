<template>
  <header
    class="bg-white border-b border-gray-200 px-4 lg:px-6 h-[73px] flex items-center justify-between shrink-0"
  >
    <!-- Left: hamburger (mobile) + breadcrumb -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
        @click="emit('toggle-sidebar')"
      >
        <Menu class="h-5 w-5 text-[#4A4A4A]" />
      </button>

      <div class="flex flex-col gap-0.5 min-w-0">
        <h1
          class="text-lg lg:text-xl font-bold text-[#101828] leading-5 truncate"
        >
          {{ breadcrumb.title }}
        </h1>
        <p
          class="text-xs lg:text-sm text-[#6A7282] leading-4 truncate hidden sm:block"
        >
          {{ breadcrumb.subtitle }}
        </p>
      </div>
    </div>

    <!-- Right -->
    <DropdownMenu v-model:open="open">
      <DropdownMenuTrigger as-child>
        <button
          class="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors outline-none"
        >
          <Avatar class="flex items-center justify-center bg-neutral-100">
            <AvatarImage
              v-if="user?.thumbnail"
              :src="avatarUrl || ''"
              :alt="user?.name || 'User'"
            />
            <AvatarFallback>{{ userInitials }}</AvatarFallback>
          </Avatar>
          <div class="text-left hidden sm:block">
            <div class="font-medium text-neutral-900 text-sm">
              {{ user?.name || "User" }}
            </div>
            <div class="text-xs text-neutral-500">
              {{ userRole }}
            </div>
          </div>
          <ChevronDown
            :class="[
              'h-4 w-4 text-neutral-400 transition-transform duration-200',
              open ? 'rotate-180' : '',
            ]"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-48">
        <DropdownMenuItem
          class="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4 mr-2" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
</template>

<script setup lang="ts">
import { ChevronDown, LogOut, Menu } from "lucide-vue-next";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { useAuth } from "~/composables/useAuth";
import { ROLE_MAP } from "~/utils/user-profile";

const emit = defineEmits<{ "toggle-sidebar": [] }>();

const route = useRoute();
const config = useRuntimeConfig();
const { user, logout } = useAuth();

const open = ref(false);

const handleLogout = async () => {
  await logout();
  await navigateTo("/cms/login");
};

const avatarUrl = computed(() => {
  if (!user.value?.thumbnail) return null;
  return `${config.public.pesonaApiUrl}/files/${user.value.thumbnail}`;
});

const userInitials = computed(() => {
  const name = user.value?.name || "";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase() ?? "")
    .join("");
});

const userRole = computed(
  () => ROLE_MAP[user.value?.role ?? ""] ?? user.value?.role ?? ""
);

const breadcrumbMap: Record<string, { title: string; subtitle: string }> = {
  "/cms": { title: "Data Produk", subtitle: "Kelola data produk & wisata" },
  "/cms/highlight-product": {
    title: "Highlight Produk",
    subtitle: "Atur produk unggulan di halaman utama",
  },
  "/cms/mitra": {
    title: "Data Mitra",
    subtitle: "Kelola data mitra",
  },
  "/cms/kolaborasi": {
    title: "Kolaborasi",
    subtitle: "Kelola logo partner & kolaborasi",
  },
  "/cms/about": {
    title: "Tentang Kami",
    subtitle: "Kelola konten halaman Tentang Kami",
  },
  "/cms/faq": {
    title: "FAQ",
    subtitle: "Kelola pertanyaan yang sering diajukan",
  },
};

const breadcrumb = computed(
  () =>
    breadcrumbMap[route.path] ?? {
      title: "CMS",
      subtitle: "Content Management System",
    }
);
</script>
