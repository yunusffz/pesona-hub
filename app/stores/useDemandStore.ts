import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useDemandStore = defineStore("demand", () => {
  // Filter state
  const searchQuery = ref("");
  const selectedRegions = ref<string[]>([]);
  const selectedLocations = ref<string[]>([]);
  const selectedCommodities = ref<number[]>([]);
  const sortBy = ref<string>("");

  // Pagination state
  const currentPage = ref(1);
  const itemsPerPage = ref(12);

  // Computed filter object for API
  const filters = computed(() => {
    const filterObj: any = {};

    // Filter by role PARTNER
    filterObj.role = { $eq: "PARTNER" };

    // Build details filter
    const detailsFilter: any = {};
    
    if (selectedLocations.value.length > 0) {
      detailsFilter.province = { $in: selectedLocations.value };
    }

    if (selectedCommodities.value.length > 0) {
      // Filter by collaboration_commodities - need to check if any object in the array contains the commodity ID as a key
      // Using $containsi for case-insensitive JSON search, or $contains based on Strapi version
      detailsFilter.collaboration_commodities = { $contains: selectedCommodities.value };
    }

    // Only add details filter if there are location or commodity filters
    if (Object.keys(detailsFilter).length > 0) {
      filterObj.details = detailsFilter;
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

  const setSortBy = (sort: string) => {
    sortBy.value = sort;
    currentPage.value = 1;
  };

  const clearAllFilters = () => {
    searchQuery.value = "";
    selectedRegions.value = [];
    selectedLocations.value = [];
    selectedCommodities.value = [];
    sortBy.value = "";
    currentPage.value = 1;
  };

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value !== "" ||
      selectedRegions.value.length > 0 ||
      selectedLocations.value.length > 0 ||
      selectedCommodities.value.length > 0 ||
      sortBy.value !== ""
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
    sortBy,
    currentPage,
    itemsPerPage,

    // Computed
    filters,
    hasActiveFilters,

    // Actions
    setSearchQuery,
    setSelectedLocations,
    setSelectedCommodities,
    setSortBy,
    clearAllFilters,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
});

