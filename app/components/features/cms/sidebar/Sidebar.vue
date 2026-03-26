<template>
  <aside
    :class="[
      'bg-white flex flex-col border-b border-r border-gray-200 rounded-br-3xl shrink-0 transition-all duration-300 self-stretch mb-6',
      // Mobile: fixed overlay, toggled by mobileOpen
      'fixed inset-y-0 left-0 z-30 lg:relative lg:z-auto lg:translate-x-0',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      collapsed ? 'w-[68px]' : 'w-[255px]',
    ]"
  >
    <!-- Header -->
    <div
      :class="[
        'flex items-center h-[73px] border-b border-gray-100 px-4',
        collapsed ? 'justify-center' : 'justify-between',
      ]"
    >
      <img
        v-if="!collapsed"
        src="/assets/images/logo.png"
        alt="Pesona Hub Logo"
        class="h-8 w-auto"
      />
      <button
        class="bg-[#fafafa] rounded-[10px] p-2 hover:bg-gray-100 transition-colors shrink-0"
        @click="toggleCollapsed"
      >
        <ChevronLeft
          :class="[
            'h-5 w-5 text-[#4A4A4A] transition-transform duration-300',
            collapsed ? 'rotate-180' : '',
          ]"
        />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex flex-col gap-1 p-3 flex-1 pt-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        :title="collapsed ? item.label : undefined"
        :class="[
          'group flex items-center gap-3 px-3 h-[62px] rounded-2xl w-full transition-colors',
          collapsed ? 'justify-center px-0' : '',
          item.soon ? 'opacity-65 cursor-not-allowed pointer-events-none' : '',
          item.active
            ? 'bg-gradient-to-r from-[#e6f1d6] to-white'
            : 'hover:bg-gradient-to-r hover:from-[#e6f1d6] hover:to-white',
        ]"
        @click="emit('close')"
      >
        <!-- Icon -->
        <component
          :is="item.icon"
          :class="[
            'h-5 w-5 shrink-0',
            item.active
              ? 'text-[#035925]'
              : 'text-[#4A4A4A] group-hover:text-[#035925]',
          ]"
        />

        <!-- Label (hidden when collapsed) -->
        <template v-if="!collapsed">
          <div class="flex flex-col gap-0.5 flex-1 min-w-0">
            <span
              :class="[
                'text-sm leading-5 tracking-tight truncate',
                item.active
                  ? 'font-semibold text-[#035925]'
                  : 'font-medium text-[#4A4A4A] group-hover:text-[#035925]',
              ]"
            >
              {{ item.label }}
            </span>
            <span
              v-if="item.subtitle"
              class="text-xs text-[#4A4A4A] leading-4 truncate"
            >
              {{ item.subtitle }}
            </span>
          </div>

          <!-- Soon badge -->
          <span
            v-if="item.soon"
            class="text-[10px] font-medium text-white bg-gradient-to-r from-[#fb4c5b] to-[#ff98a1] rounded-md px-1.5 py-0.5 shrink-0"
          >
            Soon
          </span>
        </template>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import {
  Package,
  Star,
  Handshake,
  Info,
  HelpCircle,
  ChevronLeft,
  Users,
} from "lucide-vue-next";
import { useRoute } from "vue-router";

const props = defineProps<{
  mobileOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();
const collapsed = ref(false);

function toggleCollapsed() {
  collapsed.value = !collapsed.value;
}

const navItems = computed(() => [
  {
    label: "Data Produk",
    subtitle: undefined,
    icon: Package,
    to: "/cms",
    active: route.path === "/cms",
    soon: false,
  },
  {
    label: "Highlight Produk",
    subtitle: "Atur produk unggulan",
    icon: Star,
    to: "/cms/highlight-product",
    active: route.path.startsWith("/cms/highlight-product"),
    soon: false,
  },
  {
    label: "Mitra",
    subtitle: "Kelola akun mitra",
    icon: Users,
    to: "/cms/mitra",
    active: route.path.startsWith("/cms/mitra"),
    soon: false,
  },
  {
    label: "Kolaborasi",
    subtitle: "Kelola logo partner",
    icon: Handshake,
    to: "/cms/collaboration",
    active: route.path.startsWith("/cms/collaboration"),
    soon: false,
  },
  {
    label: "Tentang Kami",
    subtitle: "Kelola konten about",
    icon: Info,
    to: "/cms/about",
    active: route.path.startsWith("/cms/about"),
    soon: false,
  },
  {
    label: "FAQ",
    subtitle: "Kelola pertanyaan umum",
    icon: HelpCircle,
    to: "/cms/faq",
    active: route.path.startsWith("/cms/faq"),
    soon: true,
  },
]);
</script>
