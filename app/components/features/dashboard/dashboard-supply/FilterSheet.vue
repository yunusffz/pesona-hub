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
            <!-- Commodities Filter -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <CommodityFilterSection
              :options="commodityOptions"
              :selected-map="selectedCommoditiesMap"
              :default-expanded="expandedSections.commodities"
              @update:selected-map="selectedCommoditiesMap = $event"
            />

            <!-- Regions Filter -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <RegionFilterSection
              :grouped-regions="groupedRegions"
              :selected-regions-map="selectedRegionsMap"
              :selected-districts-map="selectedDistrictsMap"
              :is-loading="isLoadingLocations"
              :error="locationsError"
              :default-expanded="expandedSections.regions"
              @update:selected-regions-map="selectedRegionsMap = $event"
              @update:selected-districts-map="selectedDistrictsMap = $event"
            />

            <!-- Price Range Filter -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <PriceRangeFilterSection
              v-model:price-min="priceMin"
              v-model:price-max="priceMax"
              :default-expanded="expandedSections.priceRange"
              @change="handlePriceChange"
            />

            <!-- Sort Options -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>
            <SortFilterSection
              v-model:sort-by="sortBy"
              :default-expanded="expandedSections.sort"
              @change="handleSortChange"
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
  import { Badge } from "~/components/ui/badge";
  import BaseButton from "~/components/base/BaseButton.vue";
  import { useLocations } from "~/queries/useLocations";
  import { useCommodities } from "~/queries/useCommodities";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import CommodityFilterSection from "./CommodityFilterSection.vue";
  import RegionFilterSection from "./RegionFilterSection.vue";
  import PriceRangeFilterSection from "./PriceRangeFilterSection.vue";
  import SortFilterSection from "./SortFilterSection.vue";

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
  const { data: commoditiesData } = useCommodities();

  // Initialize on mount
  onMounted(() => {
    refetchLocations();

    // Sync local state with store on mount
    catalogStore.selectedLocations.forEach((loc) => {
      selectedRegionsMap.value[loc] = true;
    });
    catalogStore.selectedCommodities.forEach((id) => {
      selectedCommoditiesMap.value[String(id)] = true;
    });
  });

  // Commodity options
  const commodityOptions = computed(() => {
    if (
      !commoditiesData.value?.data ||
      !Array.isArray(commoditiesData.value.data)
    ) {
      return [];
    }

    return (commoditiesData.value.data as Array<Record<string, unknown>>).map(
      (commodity) => ({
        label: String(
          (commodity as any).name ?? (commodity as any).label ?? "-"
        ),
        value: (commodity as any).id as string | number,
      })
    );
  });

  // Group locations by province with districts
  const groupedRegions = computed(() => {
    if (
      !locationsData.value?.data ||
      !Array.isArray(locationsData.value.data)
    ) {
      console.warn("FilterSheet - No locations data or not an array");
      return [];
    }

    type LocationData = Record<string, unknown>;
    type GroupedRegion = {
      province: string;
      districts: Array<{ label: string; value: string }>;
    };

    const locations = locationsData.value.data as Array<LocationData>;

    const grouped: Record<string, GroupedRegion> = {};

    locations.forEach((location) => {
      const province = (location.province as string) || "Lainnya";
      const district = (location.district as string) || "";
      const regency = (location.regency as string) || "";

      if (!grouped[province]) {
        grouped[province] = { province, districts: [] };
      }

      if (district) {
        const districtLabel = regency ? `${district} - ${regency}` : district;
        const existingDistrict = grouped[province].districts.find(
          (d) => d.value === district
        );
        if (!existingDistrict) {
          grouped[province].districts.push({
            label: districtLabel,
            value: district,
          });
        }
      }
    });

    const result = Object.values(grouped);

    return result;
  });

  // Expanded sections state
  const expandedSections = ref({
    commodities: true,
    regions: true,
    priceRange: false,
    sort: false,
  });

  // Local state using maps for checkbox state
  const selectedCommoditiesMap = ref<Record<string | number, boolean>>({});
  const selectedRegionsMap = ref<Record<string, boolean>>({});
  const selectedDistrictsMap = ref<Record<string, boolean>>({});
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

  const checkedCommoditiesCount = computed(() => {
    return Object.values(selectedCommoditiesMap.value).filter(Boolean).length;
  });

  const checkedRegionsCount = computed(() => {
    return Object.values(selectedRegionsMap.value).filter(Boolean).length;
  });

  const activeFiltersCount = computed(() => {
    return (
      checkedCommoditiesCount.value +
      checkedRegionsCount.value +
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
    const commodityIds = Object.entries(selectedCommoditiesMap.value)
      .filter(([_, checked]) => checked)
      .map(([id]) => {
        const numId = typeof id === "string" ? Number(id) : id;
        return numId;
      })
      .filter(
        (v) => v !== null && v !== undefined && !isNaN(Number(v))
      ) as number[];

    const checkedDistricts = Object.entries(selectedDistrictsMap.value)
      .filter(([_, checked]) => checked)
      .map(([district]) => district);

    const checkedRegions = Object.entries(selectedRegionsMap.value)
      .filter(([province, checked]) => {
        if (!checked) return false;
        const region = groupedRegions.value.find(
          (r) => r.province === province
        );
        if (region) {
          const hasCheckedDistricts = region.districts.some(
            (d) => selectedDistrictsMap.value[d.value]
          );
          return !hasCheckedDistricts;
        }
        return true;
      })
      .map(([province]) => province);

    const allLocations = [...checkedDistricts, ...checkedRegions].filter(
      Boolean
    );

    catalogStore.setSelectedLocations(allLocations);
    catalogStore.setSelectedCommodities(commodityIds);

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
    selectedCommoditiesMap.value = {};
    selectedRegionsMap.value = {};
    selectedDistrictsMap.value = {};
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
