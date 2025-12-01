<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Pilih Wilayah</span>
      <span class="text-[#717182]">
        ({{ selectedCount }})
      </span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2.5">
      <div v-if="isLoading" class="text-xs text-[#717182]">
        Memuat data lokasi...
      </div>
      <div v-else-if="error" class="text-xs text-red-500">
        Error memuat lokasi: {{ error.message }}
      </div>
      <div
        v-else-if="hierarchicalData.length === 0"
        class="text-xs text-[#717182]"
      >
        Tidak ada data lokasi
      </div>

      <!-- Search bar -->
      <div v-else class="flex flex-col gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari wilayah..."
          class="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#035925] focus:border-[#035925]"
        />

        <!-- Location tree -->
        <div class="max-h-[300px] overflow-y-auto pr-1">
          <LocationTreeItem
            v-for="province in filteredHierarchicalData"
            :key="province.name"
            :name="province.name"
            level="province"
            :is-selected="isSelected(province.name, 'province')"
            :show-children="expandedProvinces.includes(province.name)"
            :item-count="province.regencies.length"
            @toggle="toggleSelection(province.name, 'province')"
          >
            <LocationTreeItem
              v-for="regency in province.regencies"
              :key="`${province.name}-${regency.name}`"
              :name="regency.name"
              level="regency"
              :is-selected="isSelected(regency.name, 'regency')"
              :show-children="
                expandedRegencies.includes(`${province.name}-${regency.name}`)
              "
              :item-count="regency.districts.length"
              @toggle="toggleSelection(regency.name, 'regency', province.name)"
            >
              <LocationTreeItem
                v-for="district in regency.districts"
                :key="`${province.name}-${regency.name}-${district}`"
                :name="district"
                level="district"
                :is-selected="isSelected(district, 'district')"
                @toggle="toggleSelection(district, 'district')"
              />
            </LocationTreeItem>
          </LocationTreeItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from "vue";
  import type { LocationFilter } from "~/stores/useCatalogStore";
  import { useLocationHierarchy } from "~/composables/useLocationHierarchy";
  import { useLocationSearch } from "~/composables/useLocationSearch";
  import { useLocationSelection } from "~/composables/useLocationSelection";
  import LocationTreeItem from "../../catalog/catalog-product-section/filter-location/LocationTreeItem.vue";

  interface Props {
    locationsData: any;
    isLoading?: boolean;
    error?: Error | null;
    defaultExpanded?: boolean;
    modelValue: LocationFilter[];
  }

  interface Emits {
    (e: "update:modelValue", value: LocationFilter[]): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    error: null,
    defaultExpanded: true,
  });

  const emit = defineEmits<Emits>();

  const isExpanded = ref(props.defaultExpanded);
  const searchQuery = ref<string>("");
  const expandedProvinces = ref<string[]>([]);
  const expandedRegencies = ref<string[]>([]);

  // Use the same composables as catalog FilterLocation
  const { hierarchicalData } = useLocationHierarchy(
    computed(() => props.locationsData)
  );

  const { filteredHierarchicalData } = useLocationSearch(
    hierarchicalData,
    searchQuery,
    expandedProvinces,
    expandedRegencies
  );

  const { selected, isSelected, toggleSelection, removeSelection } =
    useLocationSelection(
      hierarchicalData,
      expandedProvinces,
      expandedRegencies,
      (selections) => emit("update:modelValue", selections)
    );

  const selectedCount = computed(() => selected.value.length);

  // Watch for changes in modelValue to sync internal state
  watch(
    () => props.modelValue,
    (newValue) => {
      selected.value = [...newValue];
    },
    { immediate: true }
  );

  watch(
    () => props.defaultExpanded,
    (newValue) => {
      isExpanded.value = newValue;
    }
  );
</script>

<style scoped>
  /* Reuse similar styles to maintain consistency */
</style>
