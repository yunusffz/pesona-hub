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
              v-model="selectedCommodityPriorities"
              :options="commodityPriorityOptions"
              :default-expanded="expandedSections.commodityPriorities"
              :is-loading="isLoadingCommodityPriorities"
              :error="commodityPrioritiesError"
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
  import BaseButton from "~/components/base/BaseButton.vue";
  import { useLocations } from "~/queries/useLocations";
  import { useCommoditiesPriorityDetailed } from "~/queries/useCommodityPriorities";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import CommodityPriorityFilterSection from "./CommodityPriorityFilterSection.vue";
  import LocationFilterSection from "./LocationFilterSection.vue";
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
  const {
    commodities: commodityPrioritiesData,
    isLoading: isLoadingCommodityPriorities,
    error: commodityPrioritiesError,
  } = useCommoditiesPriorityDetailed();

  // Initialize on mount
  onMounted(() => {
    refetchLocations();

    selectedLocations.value = [...catalogStore.selectedLocations];
    selectedCommodityPriorities.value = [...catalogStore.selectedCommodityPriorities];
  });

  // Commodity priority options
  const commodityPriorityOptions = computed(() => {
    if (
      !commodityPrioritiesData.value ||
      !Array.isArray(commodityPrioritiesData.value)
    ) {
      return [];
    }

    return commodityPrioritiesData.value.map((item) => ({
      label: item.commodity || "",
      value: item.commodity || "",
      count: item.total_products || 0,
    }));
  });

  // Expanded sections state
  const expandedSections = ref({
    commodityPriorities: true,
    regions: true,
    priceRange: false,
    sort: false,
  });

  // Local state
  const selectedCommodityPriorities = ref<string[]>([]);
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
    return selectedCommodityPriorities.value.length;
  });

  const checkedLocationsCount = computed(() => {
    return selectedLocations.value.length;
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
    // Use LocationFilter objects directly
    catalogStore.setSelectedLocations(selectedLocations.value);
    catalogStore.setSelectedCommodityPriorities(selectedCommodityPriorities.value);

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
    selectedCommodityPriorities.value = [];
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
