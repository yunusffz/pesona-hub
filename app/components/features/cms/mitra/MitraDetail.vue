<template>
  <div
    class="bg-white rounded-2xl border border-[#e7efea] shadow-lg w-[560px] lg:w-[768px] max-h-[90vh] overflow-hidden flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e7efea] shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
          <img
            v-if="user.thumbnail"
            :src="user.thumbnail"
            :alt="user.details?.institution_name || user.name"
            class="w-full h-full object-cover"
          />
          <Building2 v-else class="w-6 h-6 text-gray-400" />
        </div>
        <div class="flex flex-col gap-0.5">
          <h2 class="font-bold text-lg text-gray-900 leading-tight">
            {{ user.details?.institution_name || user.name }}
          </h2>
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar class="w-3 h-3" />
            <span>Terdaftar {{ formatDate(user.created_at) }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton
          v-if="canEdit"
          class="h-9 px-4 rounded-2xl text-sm bg-[#035925] hover:bg-[#024c20] text-white flex items-center gap-2"
          @click="$emit('edit', user)"
        >
          <Pencil class="w-4 h-4" />
          Edit
        </BaseButton>
        <button
          type="button"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          @click="$emit('close')"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-[#e7efea] px-6 shrink-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="py-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors"
        :class="
          activeTab === tab.id
            ? 'border-[#035925] text-[#035925]'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        "
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="overflow-y-auto flex-1 px-6 py-5">
      <!-- Tab 1: Informasi Umum -->
      <div v-if="activeTab === 'info'" class="flex flex-col gap-5">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Person In Charge -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <UserRound class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-semibold text-gray-700">Person In Charge</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-500">Nama</span>
              <span class="text-sm font-medium text-gray-900">{{ user.name || "-" }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-500">Email</span>
              <a
                v-if="user.email"
                :href="`mailto:${user.email}`"
                class="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Mail class="w-3.5 h-3.5" />
                {{ user.email }}
              </a>
              <span v-else class="text-sm text-gray-400">-</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-500">WhatsApp</span>
              <div v-if="user.phone" class="flex items-center gap-1 text-sm text-gray-800">
                <Phone class="w-3.5 h-3.5 text-gray-400" />
                {{ user.phone }}
              </div>
              <span v-else class="text-sm text-gray-400">-</span>
            </div>
          </div>

          <!-- Kontak Organisasi -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Building class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-semibold text-gray-700">Kontak Organisasi</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-500">WhatsApp</span>
              <div v-if="user.details?.contact_phone" class="flex items-center gap-1 text-sm text-gray-800">
                <Phone class="w-3.5 h-3.5 text-gray-400" />
                {{ user.details.contact_phone }}
              </div>
              <span v-else class="text-sm text-gray-400">-</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-500">Website</span>
              <a
                v-if="user.details?.website"
                :href="user.details.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Globe class="w-3.5 h-3.5" />
                {{ user.details.website.replace(/^https?:\/\//, "") }}
              </a>
              <span v-else class="text-sm text-gray-400">-</span>
            </div>
          </div>

          <!-- Akun Login -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <KeyRound class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-semibold text-gray-700">Akun Login</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-gray-500">Username</span>
              <span class="text-sm font-medium text-gray-900">{{ user.username }}</span>
            </div>
          </div>
        </div>

        <!-- Catatan Tambahan -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-gray-500" />
            <span class="text-sm font-semibold text-gray-700">Catatan Tambahan</span>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 min-h-[56px]">
            {{ user.details?.product_service_description || "-" }}
          </div>
        </div>
      </div>

      <!-- Tab 2: Kolaborasi & Komoditas -->
      <div v-else-if="activeTab === 'collaboration'" class="flex flex-col gap-5">
        <!-- Bentuk Kerja Sama -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Handshake class="w-4 h-4 text-gray-500" />
            <span class="text-sm font-semibold text-gray-700">Bentuk Kerja Sama</span>
          </div>
          <div v-if="collaborationNames.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="name in collaborationNames"
              :key="name"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#e8f5ee] text-[#035925]"
            >
              {{ name }}
            </span>
          </div>
          <p v-else class="text-sm text-gray-400">-</p>
        </div>

        <!-- Komoditas -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Sprout class="w-4 h-4 text-gray-500" />
            <span class="text-sm font-semibold text-gray-700">Komoditas</span>
          </div>
          <div v-if="commodityNames.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="name in commodityNames"
              :key="name"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {{ name }}
            </span>
          </div>
          <p v-else class="text-sm text-gray-400">-</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-end px-6 py-4 border-t border-[#e7efea] shrink-0">
      <BaseButton
        variant="secondary"
        class="h-9 px-5 rounded-2xl text-sm border border-[#e7efea] text-[#1e1e1e]"
        @click="$emit('close')"
      >
        Tutup
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  X,
  Pencil,
  Calendar,
  UserRound,
  Building,
  Building2,
  KeyRound,
  FileText,
  Mail,
  Phone,
  Globe,
  Handshake,
  Sprout,
} from "lucide-vue-next";
import BaseButton from "~/components/base/BaseButton.vue";
import { useCommodities } from "~/queries/useCommodities";
import { useCollaborations } from "~/queries/useCollaborations";
import type { components } from "~/types/pesona-hub-api";

type UserResponse = components["schemas"]["UserResponse"];

const props = defineProps<{
  user: UserResponse;
  canEdit?: boolean;
}>();

defineEmits<{
  close: [];
  edit: [user: UserResponse];
}>();

const tabs = [
  { id: "info", label: "Informasi Umum" },
  { id: "collaboration", label: "Kolaborasi & Komoditas" },
];

const activeTab = ref("info");

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const { data: commoditiesData } = useCommodities();
const { data: collaborationsData } = useCollaborations();

const commoditiesMap = computed(() => {
  const map = new Map<number, string>();
  if (commoditiesData.value?.data && Array.isArray(commoditiesData.value.data)) {
    (commoditiesData.value.data as any[]).forEach((c: any) => {
      if (c.id && c.name) map.set(c.id, c.name);
    });
  }
  return map;
});

const collaborationsMap = computed(() => {
  const map = new Map<number, string>();
  const data =
    collaborationsData.value && "data" in collaborationsData.value
      ? collaborationsData.value.data
      : collaborationsData.value;
  if (Array.isArray(data)) {
    (data as any[]).forEach((c: any) => {
      if (c.id && c.name) map.set(c.id, c.name);
    });
  }
  return map;
});

const commodityNames = computed(() => {
  const commodities = props.user.details?.collaboration_commodities;
  if (!Array.isArray(commodities) || commodities.length === 0) return [];
  const ids: number[] = commodities
    .map((entry: any) => {
      if (typeof entry === "object" && entry !== null) {
        return Number(Object.keys(entry)[0]);
      }
      return Number(entry);
    })
    .filter((n) => !isNaN(n));
  return ids
    .map((id) => commoditiesMap.value.get(id))
    .filter((n): n is string => !!n);
});

const collaborationNames = computed(() => {
  const ids = props.user.details?.collaboration_ids;
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids
    .map((id: number) => collaborationsMap.value.get(id))
    .filter((n): n is string => !!n);
});
</script>
