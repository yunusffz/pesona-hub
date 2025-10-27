<template>
  <div class="w-full">
    <div class="rounded-2xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200">
            <tr>
              <th class="bg-gray-50 px-6 py-3 text-left rounded-tl-2xl">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Produk/Wisata
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Kategori
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Status
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Produksi
              </th>
              <th
                class="bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Pengelola / Mitra
              </th>
              <th class="bg-gray-50 px-6 py-3 rounded-tr-2xl"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="item in paginatedData"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-md overflow-hidden flex-shrink-0"
                    :style="{ backgroundColor: item.color }"
                  >
                    <span class="text-2xl">{{ item.icon }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{
                    item.name
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ item.category }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="
                    item.status === 'Done'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="
                      item.status === 'Done' ? 'bg-green-500' : 'bg-gray-400'
                    "
                  ></span>
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ item.production }}</span>
                <span class="text-sm text-gray-500"> / {{ item.period }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ item.partner }}</span>
              </td>
              <td class="px-6 py-4">
                <button class="text-gray-400 hover:text-gray-600">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination -->
      <div class="px-6 py-4 border-t border-gray-200">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :start-item="startItem"
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import Pagination from "~/components/ui/pagination/Pagination.vue";

  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const tableData = ref([
    {
      id: 1,
      name: "Pupuk Cair Organik KUPS Danau Raya",
      category: "Pupuk Organik",
      status: "In Process",
      production: "1,5 ton",
      period: "bulan",
      partner: "LPHN Limo Koto",
      icon: "🌱",
      color: "#E8F5E9",
    },
    {
      id: 2,
      name: "Arang Briket Tempurung Kelapa",
      category: "Energi Terbarukan",
      status: "Done",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Agroforest Dana...",
      icon: "🔥",
      color: "#FFE0E6",
    },
    {
      id: 3,
      name: "Produk Pangan",
      category: "Produk Perlebahan",
      status: "Done",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Madu Lambah Si...",
      icon: "🍯",
      color: "#FFF3E0",
    },
    {
      id: 4,
      name: "Gula Semut Organik",
      category: "Produk Pangan",
      status: "Done",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Aren Tumbang",
      icon: "🍬",
      color: "#F3E5F5",
    },
    {
      id: 5,
      name: "Briket Kayu Hutan Rakyat",
      category: "Perhutanan Non-Kayu",
      status: "In Process",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Hijau Mandiri",
      icon: "🪵",
      color: "#E0F2F1",
    },
    {
      id: 6,
      name: "Minyak VCO Kelapa",
      category: "Produk Olahan",
      status: "In Process",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Kelapa Sejahtera",
      icon: "🥥",
      color: "#E8EAF6",
    },
    {
      id: 7,
      name: "Kopi Arabika Gunung Pasaman",
      category: "Produk Pangan",
      status: "In Process",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Kopi Gunung Pa...",
      icon: "☕",
      color: "#EFEBE9",
    },
    {
      id: 8,
      name: "Sabun Herbal Daun Sirih",
      category: "Produk Turunan",
      status: "In Process",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS EcoNatural Sum...",
      icon: "🧼",
      color: "#E1F5FE",
    },
    {
      id: 9,
      name: "Media Tanam Cocopeat",
      category: "Produk Hortikultura",
      status: "In Process",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS CocoFarm Jatim",
      icon: "🌿",
      color: "#FFF9C4",
    },
    {
      id: 10,
      name: "Madu Hutan Tropis Riau",
      category: "Produk Perlebahan",
      status: "Done",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Hutan Tropis Riau",
      icon: "🍯",
      color: "#FFE082",
    },
    {
      id: 11,
      name: "Madu Hutan Tropis Riau",
      category: "Produk Perlebahan",
      status: "Done",
      production: "1,5 ton",
      period: "bulan",
      partner: "KUPS Hutan Tropis Riau",
      icon: "🍯",
      color: "#FFE082",
    },
  ]);

  const totalItems = computed(() => tableData.value.length);
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return tableData.value.slice(start, end);
  });

  const startItem = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value;
  });
</script>
