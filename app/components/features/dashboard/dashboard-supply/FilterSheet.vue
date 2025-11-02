<template>
  <Sheet>
    <slot />
    <SheetContent side="right" class="w-[336px] p-0">
      <SheetHeader class="px-3.5 pt-3.5 pb-0">
        <SheetTitle class="flex items-center gap-1.5 text-sm">
          <Icon name="uil:filter" class="h-[17.5px] w-[17.5px]" />
          <span>Filter Data Lanjutan</span>
          <Badge
            v-if="activeFiltersCount > 0"
            variant="outline"
            class="ml-auto bg-[#fbfbfb] border-zinc-200 text-xs"
          >
            <span class="text-[#035925]">{{ activeFiltersCount }}</span>
            <span class=""> filter aktif</span>
          </Badge>
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

            <div class="flex flex-col gap-2.5">
              <button
                @click="
                  expandedSections.commodities = !expandedSections.commodities
                "
                class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
              >
                <span class="flex-1 text-left">Pilih Komoditas</span>
                <span class="text-[#717182]">
                  ({{ checkedCommoditiesCount }}/{{ commodityOptions.length }})
                </span>
                <Icon
                  :name="
                    expandedSections.commodities
                      ? 'uil:angle-up'
                      : 'uil:angle-down'
                  "
                  class="h-4 w-4"
                />
              </button>

              <div
                v-if="expandedSections.commodities"
                class="flex flex-col gap-2.5"
              >
                <div
                  v-for="commodity in commodityOptions"
                  :key="commodity.value"
                  class="flex items-center gap-1.5"
                >
                  <Checkbox
                    :id="`commodity-${commodity.value}`"
                    :checked="isCommodityChecked(commodity.value)"
                    @update:checked="(checked: boolean) => toggleCommodity(commodity.value, checked)"
                    class="h-3.5 w-3.5 cursor-pointer"
                  />
                  <label
                    :for="`commodity-${commodity.value}`"
                    class="flex-1 text-xs text-neutral-950 cursor-pointer"
                  >
                    {{ commodity.label }}
                  </label>
                  <span class="text-xs text-[#717182]"
                    >({{ getCommodityCount(commodity.value) }})</span
                  >
                </div>
              </div>
            </div>

            <!-- Regions Filter -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>

            <div class="flex flex-col gap-2.5">
              <button
                @click="expandedSections.regions = !expandedSections.regions"
                class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
              >
                <span class="flex-1 text-left">Pilih Wilayah</span>
                <span class="text-[#717182]">
                  ({{ checkedRegionsCount }}/{{ groupedRegions.length }})
                </span>
                <Icon
                  :name="
                    expandedSections.regions ? 'uil:angle-up' : 'uil:angle-down'
                  "
                  class="h-4 w-4"
                />
              </button>

              <div
                v-if="expandedSections.regions"
                class="flex flex-col gap-2.5"
              >
                <div v-if="isLoadingLocations" class="text-xs text-[#717182]">
                  Memuat data lokasi...
                </div>
                <div v-else-if="locationsError" class="text-xs text-red-500">
                  Error memuat lokasi: {{ locationsError.message }}
                </div>
                <div
                  v-else-if="groupedRegions.length === 0"
                  class="text-xs text-[#717182]"
                >
                  Tidak ada data lokasi
                </div>
                <div
                  v-for="region in groupedRegions"
                  :key="region.province"
                  class="flex flex-col gap-1.5"
                >
                  <div class="flex items-center gap-1.5">
                    <Checkbox
                      :id="`region-${region.province}`"
                      :checked="isRegionChecked(region.province)"
                      @update:checked="(checked: boolean) => toggleRegion(region.province, checked)"
                      class="h-3.5 w-3.5 cursor-pointer"
                    />
                    <label
                      :for="`region-${region.province}`"
                      class="flex-1 text-xs text-neutral-950 cursor-pointer"
                    >
                      {{ region.province }}
                    </label>
                    <span class="text-xs text-[#717182]"
                      >({{ region.districts.length }})</span
                    >
                    <button
                      v-if="region.districts.length > 0"
                      @click="toggleRegionExpansion(region.province)"
                    >
                      <Icon
                        :name="
                          isRegionExpanded(region.province)
                            ? 'uil:angle-up'
                            : 'uil:angle-down'
                        "
                        class="h-4 w-4"
                      />
                    </button>
                  </div>

                  <div
                    v-if="
                      isRegionExpanded(region.province) &&
                      region.districts.length > 0
                    "
                    class="flex flex-col gap-1.5 pl-2"
                  >
                    <div
                      v-for="district in region.districts"
                      :key="district.value"
                      class="flex items-center gap-1.5 pr-8"
                    >
                      <Checkbox
                        :id="`district-${district.value}`"
                        :checked="isDistrictChecked(district.value)"
                        @update:checked="
                          (checked: boolean) => toggleDistrict(region.province, district.value, checked)
                        "
                        class="h-3.5 w-3.5 cursor-pointer"
                      />
                      <label
                        :for="`district-${district.value}`"
                        class="flex-1 text-xs text-neutral-950 cursor-pointer"
                      >
                        {{ district.label }}
                      </label>
                      <span class="text-xs text-[#717182]"
                        >({{ getDistrictCount(district.value) }})</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>

            <div class="flex flex-col gap-2.5">
              <button
                @click="
                  expandedSections.priceRange = !expandedSections.priceRange
                "
                class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
              >
                <span class="flex-1 text-left">Rentang Harga</span>
                <Icon
                  :name="
                    expandedSections.priceRange
                      ? 'uil:angle-up'
                      : 'uil:angle-down'
                  "
                  class="h-4 w-4"
                />
              </button>

              <div
                v-if="expandedSections.priceRange"
                class="flex flex-col gap-2.5"
              >
                <div class="flex gap-3">
                  <div class="flex-1">
                    <label class="block text-xs text-[#717182] mb-1">Min</label>
                    <input
                      v-model.number="priceMin"
                      type="number"
                      placeholder="Min"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      @input="handlePriceChange"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs text-[#717182] mb-1">Max</label>
                    <input
                      v-model.number="priceMax"
                      type="number"
                      placeholder="Max"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      @input="handlePriceChange"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Sort Options -->
            <div class="w-full h-px bg-[rgba(0,0,0,0.1)]"></div>

            <div class="flex flex-col gap-2.5">
              <button
                @click="expandedSections.sort = !expandedSections.sort"
                class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
              >
                <span class="flex-1 text-left">Urutkan</span>
                <Icon
                  :name="
                    expandedSections.sort ? 'uil:angle-up' : 'uil:angle-down'
                  "
                  class="h-4 w-4"
                />
              </button>

              <div v-if="expandedSections.sort" class="flex flex-col gap-2.5">
                <select
                  v-model="sortBy"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  @change="handleSortChange"
                >
                  <option value="">Pilih urutan...</option>
                  <option value="name:asc">Nama (A-Z)</option>
                  <option value="name:desc">Nama (Z-A)</option>
                  <option value="price:asc">Harga (Terendah)</option>
                  <option value="price:desc">Harga (Tertinggi)</option>
                  <option value="created_at:desc">Terbaru</option>
                  <option value="created_at:asc">Terlama</option>
                </select>
              </div>
            </div>

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
  import { Checkbox } from "~/components/ui/checkbox";
  import BaseButton from "~/components/base/BaseButton.vue";
  import { useLocations } from "~/queries/useLocations";
  import { useCommodities } from "~/queries/useCommodities";
  import { useCatalogStore } from "~/stores/useCatalogStore";

  const catalogStore = useCatalogStore();

  // Data fetching
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error: locationsError,
    refetch: refetchLocations,
  } = useLocations({
    enabled: true, // Explicitly enable the query
  });
  const { data: commoditiesData } = useCommodities();

  // Force refetch on mount to ensure query runs
  onMounted(() => {
    console.log("FilterSheet - onMounted, refetching locations");
    refetchLocations();
  });

  // Debug: Log locations data
  watch(
    locationsData,
    (newData) => {
      console.log("FilterSheet - Locations data:", {
        data: newData,
        hasData: !!newData?.data,
        isArray: Array.isArray(newData?.data),
        length: Array.isArray(newData?.data) ? newData.data.length : 0,
      });
    },
    { immediate: true }
  );

  watch(
    () => isLoadingLocations.value,
    (loading) => {
      console.log("FilterSheet - Locations loading:", loading);
    }
  );

  watch(
    () => locationsError.value,
    (error) => {
      if (error) {
        console.error("FilterSheet - Locations error:", error);
      }
    }
  );

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
    console.log("FilterSheet - Computing groupedRegions:", {
      hasData: !!locationsData.value?.data,
      isArray: Array.isArray(locationsData.value?.data),
      rawData: locationsData.value,
    });

    if (
      !locationsData.value?.data ||
      !Array.isArray(locationsData.value.data)
    ) {
      console.warn("FilterSheet - No locations data or not an array");
      return [];
    }

    const locations = locationsData.value.data as Array<
      Record<string, unknown>
    >;
    console.log("FilterSheet - Processing locations:", {
      count: locations.length,
      firstLocation: locations[0],
    });

    const grouped: Record<
      string,
      { province: string; districts: Array<{ label: string; value: string }> }
    > = {};

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
    console.log("FilterSheet - Grouped regions result:", {
      count: result.length,
      regions: result.map((r) => ({
        province: r.province,
        districtCount: r.districts.length,
      })),
    });

    return result;
  });

  // Expanded sections state
  const expandedSections = ref({
    commodities: true,
    regions: true,
    priceRange: false,
    sort: false,
  });

  // Region expansion state
  const expandedRegions = ref<Record<string, boolean>>({});

  // Local state
  const selectedCommodities = ref<(string | number)[]>(
    catalogStore.selectedCommodities.map((id) => String(id))
  );
  const selectedLocations = ref<string[]>(catalogStore.selectedLocations);
  const selectedDistricts = ref<string[]>([]);
  const priceMin = ref<number | null>(catalogStore.priceRange?.min || null);
  const priceMax = ref<number | null>(catalogStore.priceRange?.max || null);
  const sortBy = ref<string>((catalogStore as any).sortBy || "");

  // Sync with store
  watch(
    () => catalogStore.selectedLocations,
    (newLocations) => {
      selectedLocations.value = newLocations;
    },
    { deep: true }
  );

  watch(
    () => catalogStore.selectedCommodities,
    (newCommodities) => {
      selectedCommodities.value = newCommodities.map((id) => String(id));
    },
    { deep: true }
  );

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

  // Checkbox handlers
  const isCommodityChecked = (value: string | number) => {
    return selectedCommodities.value.includes(String(value));
  };

  const toggleCommodity = (value: string | number, checked: boolean) => {
    const stringValue = String(value);
    if (checked) {
      if (!selectedCommodities.value.includes(stringValue)) {
        selectedCommodities.value.push(stringValue);
      }
    } else {
      selectedCommodities.value = selectedCommodities.value.filter(
        (v) => v !== stringValue
      );
    }
  };

  const isRegionChecked = (province: string) => {
    return selectedLocations.value.includes(province);
  };

  const toggleRegion = (province: string, checked: boolean) => {
    if (checked) {
      if (!selectedLocations.value.includes(province)) {
        selectedLocations.value.push(province);
      }
    } else {
      selectedLocations.value = selectedLocations.value.filter(
        (v) => v !== province
      );
      // Also remove districts from this province
      const region = groupedRegions.value.find((r) => r.province === province);
      if (region) {
        region.districts.forEach((d) => {
          const index = selectedDistricts.value.indexOf(d.value);
          if (index > -1) {
            selectedDistricts.value.splice(index, 1);
          }
        });
      }
    }
  };

  const isDistrictChecked = (district: string) => {
    return selectedDistricts.value.includes(district);
  };

  const toggleDistrict = (
    province: string,
    district: string,
    checked: boolean
  ) => {
    if (checked) {
      if (!selectedDistricts.value.includes(district)) {
        selectedDistricts.value.push(district);
      }
      // Also select the province if not already selected
      if (!selectedLocations.value.includes(province)) {
        selectedLocations.value.push(province);
      }
    } else {
      selectedDistricts.value = selectedDistricts.value.filter(
        (v) => v !== district
      );
    }
  };

  const toggleRegionExpansion = (province: string) => {
    expandedRegions.value[province] = !expandedRegions.value[province];
  };

  const isRegionExpanded = (province: string) => {
    return expandedRegions.value[province] ?? false;
  };

  // Count functions (mock for now, can be enhanced with actual data)
  const getCommodityCount = (value: string | number) => {
    // TODO: Get actual count from API or computed from products
    return 0;
  };

  const getDistrictCount = (district: string) => {
    // TODO: Get actual count from API or computed from products
    return 0;
  };

  const checkedCommoditiesCount = computed(() => {
    return selectedCommodities.value.length;
  });

  const checkedRegionsCount = computed(() => {
    return selectedLocations.value.length;
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
    // Combine districts and provinces for locations
    // Note: Filter uses district, so we prioritize districts over provinces
    const allLocations = [
      ...selectedDistricts.value,
      ...selectedLocations.value.filter(
        (loc) => !selectedDistricts.value.includes(loc)
      ),
    ];

    catalogStore.setSelectedLocations(allLocations);

    catalogStore.setSelectedCommodities(
      selectedCommodities.value
        .map((v) => (typeof v === "string" ? Number(v) : v))
        .filter((v) => v !== null && v !== undefined) as number[]
    );

    if (priceMin.value !== null || priceMax.value !== null) {
      catalogStore.priceRange = {
        min: priceMin.value || 0,
        max: priceMax.value || 999999,
      };
    } else {
      catalogStore.priceRange = null;
    }

    (catalogStore as any).setSortBy(sortBy.value);

    // Debug: Log applied filters
    console.log("Applied filters:", {
      locations: allLocations,
      commodities: catalogStore.selectedCommodities,
      priceRange: catalogStore.priceRange,
      sortBy: (catalogStore as any).sortBy,
    });
  };

  const handleClearFilters = () => {
    selectedLocations.value = [];
    selectedCommodities.value = [];
    selectedDistricts.value = [];
    priceMin.value = null;
    priceMax.value = null;
    sortBy.value = "";
    catalogStore.clearAllFilters();
  };

  // Expose for parent component to trigger open/close
  defineExpose({
    handleApplyFilters,
    handleClearFilters,
  });
</script>
