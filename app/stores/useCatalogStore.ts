import { ref } from "vue";
import { defineStore } from "pinia";

export const useCatalogStore = defineStore("catalog", () => {
  // Filter state
  const searchQuery = ref("");
  const selectedRegions = ref<string[]>([]);
  const priceRange = ref<{ min: number; max: number } | null>(null);

  // Pagination state
  const currentPage = ref(1);
  const itemsPerPage = ref(12);

  // Computed filter object for API
  const filters = computed(() => {
    const filterObj: any = {};

    if (selectedRegions.value.length > 0) {
      filterObj.social_forestry_business_group = {
        location: {
          region: { $in: selectedRegions.value },
        },
      };
    }

    if (priceRange.value) {
      filterObj.price = {
        $gte: priceRange.value.min,
        $lte: priceRange.value.max,
      };
    }

    return filterObj;
  });

  // Actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page
  };

  const setSelectedRegions = (regions: string[]) => {
    selectedRegions.value = regions;
    currentPage.value = 1;
  };

  const clearAllFilters = () => {
    searchQuery.value = "";
    selectedRegions.value = [];
    priceRange.value = null;
    currentPage.value = 1;
  };

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value !== "" ||
      selectedRegions.value.length > 0 ||
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
    selectedRegions,
    priceRange,
    currentPage,
    itemsPerPage,

    // Computed
    filters,
    hasActiveFilters,

    // Actions
    setSearchQuery,
    setSelectedRegions,
    clearAllFilters,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
});
