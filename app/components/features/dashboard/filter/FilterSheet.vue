<template>
  <Sheet>
    <slot />
    <SheetContent side="right" class="w-[336px] p-0">
      <SheetHeader class="px-3.5 pt-3.5 pb-0">
        <SheetTitle class="flex items-center gap-1.5 text-sm">
          <Icon name="uil:filter" class="h-[17.5px] w-[17.5px]" />
          <span>Filter Data Lanjutan</span>
        </SheetTitle>
        <p class="text-xs text-[#717182] mt-2">
          Sesuaikan tampilan data berdasarkan kategori yang Anda butuhkan.
        </p>
      </SheetHeader>

      <div class="px-5 py-0">
        <div class="h-[calc(100vh-200px)] overflow-y-auto pr-1">
          <div class="flex flex-col gap-5 py-6">
            <!-- Commodity Priority Filter -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <CommodityPriorityFilterSection
              :options="commodityPriorityOptions"
              :selected-map="selectedCommodityPrioritiesMap"
              :default-expanded="expandedSections.commodityPriorities"
              @update:selected-map="selectedCommodityPrioritiesMap = $event"
            />

            <!-- Regions Filter -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <LocationFilterSection
              v-model="selectedLocations"
              :locations-data="locationsData"
              :is-loading="isLoadingLocations"
              :error="locationsError"
              :default-expanded="expandedSections.regions"
            />

            <!-- Price Range Filter -->
            <!-- <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <PriceRangeFilterSection
              v-model:price-min="priceMin"
              v-model:price-max="priceMax"
              :default-expanded="expandedSections.priceRange"
              @change="handlePriceChange"
            /> -->

            <!-- Sort Options -->
            <!-- <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <SortFilterSection
              v-model:sort-by="sortBy"
              :default-expanded="expandedSections.sort"
              @change="handleSortChange"
            /> -->

            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5 py-4">
          <BaseButton
            variant="secondary"
            @click="handleClearFilters"
            class="flex-1 h-8 rounded-md text-xs text-neutral-950"
          >
            Reset
          </BaseButton>
          <BaseButton
            @click="handleApplyFilters"
            class="flex-1 h-8 rounded-md bg-[#035925] hover:bg-[#024c20] text-xs text-white"
          >
            Terapkan
          </BaseButton>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onMounted } from "vue";
  import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "~/components/ui/sheet";
  import { Badge } from "~/components/ui/badge";
  import BaseButton from "~/components/base/BaseButton.vue";
  import { useLocations } from "~/queries/useLocations";
  import { useCommodityPriorities } from "~/queries/useCommodityPriorities";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import CommodityPriorityFilterSection from "./CommodityPriorityFilterSection.vue";
  import LocationFilterSection from "./LocationFilterSection.vue";
  import PriceRangeFilterSection from "./PriceRangeFilterSection.vue";
  import SortFilterSection from "./SortFilterSection.vue";
  import type { LocationFilter } from "~/stores/useCatalogStore";

  const catalogStore = useCatalogStore();

  // Data fetching
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error: locationsError,
    refetch: refetchLocations,
  } = useLocations({
    enabled: true,
  });
  const { data: commodityPrioritiesData } = useCommodityPriorities({
    limit: 200,
  });

  // Initialize on mount
  onMounted(() => {
    refetchLocations();

    // Sync local state with store on mount
    selectedLocations.value = [...catalogStore.selectedLocations];
    catalogStore.selectedCommodityPriorities.forEach((priority) => {
      selectedCommodityPrioritiesMap.value[priority] = true;
    });
  });

  // Commodity priority options
  const commodityPriorityOptions = computed(() => {
    if (
      !commodityPrioritiesData.value?.data ||
      !Array.isArray(commodityPrioritiesData.value.data)
    ) {
      return [];
    }

    return (commodityPrioritiesData.value.data as string[]).map((priority) => ({
      label: priority,
      value: priority,
    }));
  });


  // Expanded sections state
  const expandedSections = ref({
    commodityPriorities: true,
    regions: true,
    priceRange: false,
    sort: false,
  });

  // Local state using maps for checkbox state
  const selectedCommodityPrioritiesMap = ref<Record<string, boolean>>({});
  const selectedLocations = ref<LocationFilter[]>([]);
  const priceMin = ref<number | null>(catalogStore.priceRange?.min || null);
  const priceMax = ref<number | null>(catalogStore.priceRange?.max || null);
  const sortBy = ref<string>((catalogStore as any).sortBy || "");

  watch(
    () => catalogStore.priceRange,
    (newRange) => {
      if (newRange) {
        priceMin.value = newRange.min;
        priceMax.value = newRange.max;
      } else {
        priceMin.value = null;
        priceMax.value = null;
      }
    }
  );

  watch(
    () => (catalogStore as any).sortBy,
    (newSort) => {
      sortBy.value = newSort || "";
    }
  );

  const checkedCommodityPrioritiesCount = computed(() => {
    return Object.values(selectedCommodityPrioritiesMap.value).filter(Boolean)
      .length;
  });

  const checkedLocationsCount = computed(() => {
    return selectedLocations.value.length;
  });

  const activeFiltersCount = computed(() => {
    return (
      checkedCommodityPrioritiesCount.value +
      checkedLocationsCount.value +
      (priceMin.value !== null || priceMax.value !== null ? 1 : 0) +
      (sortBy.value !== "" ? 1 : 0)
    );
  });

  // Handlers
  const handlePriceChange = () => {
    if (priceMin.value !== null || priceMax.value !== null) {
      catalogStore.priceRange = {
        min: priceMin.value || 0,
        max: priceMax.value || 999999,
      };
    } else {
      catalogStore.priceRange = null;
    }
  };

  const handleSortChange = () => {
    (catalogStore as any).setSortBy(sortBy.value);
  };

  const handleApplyFilters = () => {
    const commodityPriorities = Object.entries(
      selectedCommodityPrioritiesMap.value
    )
      .filter(([_, checked]) => checked)
      .map(([priority]) => priority);

    // Use LocationFilter objects directly
    catalogStore.setSelectedLocations(selectedLocations.value);
    catalogStore.setSelectedCommodityPriorities(commodityPriorities);

    if (priceMin.value !== null || priceMax.value !== null) {
      catalogStore.priceRange = {
        min: priceMin.value || 0,
        max: priceMax.value || 999999,
      };
    } else {
      catalogStore.priceRange = null;
    }

    (catalogStore as any).setSortBy(sortBy.value);
  };

  const handleClearFilters = () => {
    selectedCommodityPrioritiesMap.value = {};
    selectedLocations.value = [];
    priceMin.value = null;
    priceMax.value = null;
    sortBy.value = "";
    catalogStore.clearAllFilters();
  };

  defineExpose({
    handleApplyFilters,
    handleClearFilters,
  });
</script>
