import { ref } from "vue";
import { defineStore } from "pinia";

export const useCatalogStore = defineStore("catalog", () => {
  // Filter state
  const searchQuery = ref("");
  const selectedRegions = ref<string[]>([]);
  const selectedLocations = ref<string[]>([]);
  const selectedCommodities = ref<number[]>([]);
  const priceRange = ref<{ min: number; max: number } | null>(null);

  // Pagination state
  const currentPage = ref(1);
  const itemsPerPage = ref(12);

  // Computed filter object for API
  const filters = computed(() => {
    const filterObj: any = {};

    if (selectedLocations.value.length > 0) {
      filterObj.social_forestry_business_group = {
        location: {
          district: { $in: selectedLocations.value },
        },
      };
    }

    if (priceRange.value) {
      filterObj.price = {
        $gte: priceRange.value.min,
        $lte: priceRange.value.max,
      };
    }

    if (selectedCommodities.value.length > 0) {
      filterObj.commodity_id = { $in: selectedCommodities.value };
    }

    // Debug: Log the filter structure
    if (selectedLocations.value.length > 0) {
      console.log("Filter structure:", filterObj);
    }

    return filterObj;
  });

  // Actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page
  };

  const setSelectedLocations = (locations: string[]) => {
    selectedLocations.value = locations;
    currentPage.value = 1;
  };

  const setSelectedCommodities = (commodityIds: number[]) => {
    selectedCommodities.value = commodityIds;
    currentPage.value = 1;
  };

  const clearAllFilters = () => {
    searchQuery.value = "";
    selectedRegions.value = [];
    selectedLocations.value = [];
    selectedCommodities.value = [];
    priceRange.value = null;
    currentPage.value = 1;
  };

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value !== "" ||
      selectedRegions.value.length > 0 ||
      selectedLocations.value.length > 0 ||
      selectedCommodities.value.length > 0 ||
      priceRange.value !== null
    );
  });

  // Pagination actions
  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items;
    currentPage.value = 1; // Reset to first page when changing items per page
  };

  const goToNextPage = () => {
    currentPage.value += 1;
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  };

  const goToFirstPage = () => {
    currentPage.value = 1;
  };

  const goToLastPage = (totalPages: number) => {
    currentPage.value = totalPages;
  };

  return {
    // State
    searchQuery,
    selectedLocations,
    selectedCommodities,
    priceRange,
    currentPage,
    itemsPerPage,

    // Computed
    filters,
    hasActiveFilters,

    // Actions
    setSearchQuery,
    setSelectedLocations,
    setSelectedCommodities,
    clearAllFilters,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
});
