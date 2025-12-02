import { ref, computed } from "vue";
import { defineStore } from "pinia";

export interface LocationFilter {
  value: string;
  type: "province" | "regency" | "district";
}

// Collaboration filter mapping table
interface CollaborationFilterRule {
  class_group: string[];
  product_category: string[];
  value_chain: string[];
  collaboration_ids: number[];
}

const COLLABORATION_FILTER_RULES: CollaborationFilterRule[] = [
  // HHBK; HHK - JADI
  {
    class_group: ["PLATINUM"],
    product_category: ["HHBK", "HHK"],
    value_chain: ["JADI"],
    collaboration_ids: [1, 2, 3],
  },
  {
    class_group: ["GOLD"],
    product_category: ["HHBK", "HHK"],
    value_chain: ["JADI"],
    collaboration_ids: [3, 4, 5],
  },
  {
    class_group: ["SILVER"],
    product_category: ["HHBK", "HHK"],
    value_chain: ["JADI"],
    collaboration_ids: [6, 7, 8, 9],
  },
  // HHBK; HHK - MENTAH; SETENGAH JADI
  {
    class_group: ["PLATINUM"],
    product_category: ["HHBK", "HHK"],
    value_chain: ["MENTAH", "SETENGAH JADI"],
    collaboration_ids: [1, 2, 3, 10],
  },
  {
    class_group: ["GOLD"],
    product_category: ["HHBK", "HHK"],
    value_chain: ["MENTAH", "SETENGAH JADI"],
    collaboration_ids: [2, 3, 4, 5, 9, 10],
  },
  {
    class_group: ["SILVER"],
    product_category: ["HHBK", "HHK"],
    value_chain: ["MENTAH", "SETENGAH JADI"],
    collaboration_ids: [6, 7, 8, 9, 10, 16],
  },
  // JASLING - MENTAH
  {
    class_group: ["PLATINUM"],
    product_category: ["JASLING"],
    value_chain: ["MENTAH"],
    collaboration_ids: [2, 11, 12, 13],
  },
  {
    class_group: ["GOLD"],
    product_category: ["JASLING"],
    value_chain: ["MENTAH"],
    collaboration_ids: [11, 12],
  },
  {
    class_group: ["SILVER"],
    product_category: ["JASLING"],
    value_chain: ["MENTAH"],
    collaboration_ids: [11, 12],
  },
  // JASLING - MENTAH; SETENGAH JADI; JADI
  {
    class_group: ["PLATINUM"],
    product_category: ["JASLING"],
    value_chain: ["MENTAH", "SETENGAH JADI", "JADI"],
    collaboration_ids: [15, 16],
  },
  {
    class_group: ["GOLD"],
    product_category: ["JASLING"],
    value_chain: ["MENTAH", "SETENGAH JADI", "JADI"],
    collaboration_ids: [15, 16],
  },
  {
    class_group: ["SILVER"],
    product_category: ["JASLING"],
    value_chain: ["MENTAH", "SETENGAH JADI", "JADI"],
    collaboration_ids: [15, 16],
  },
];

export const useCatalogStore = defineStore("catalog", () => {
  // Filter state
  const searchQuery = ref("");
  const selectedRegions = ref<string[]>([]);
  const selectedLocations = ref<LocationFilter[]>([]);
  const selectedCommodities = ref<number[]>([]);
  const selectedCommodityPriorities = ref<string[]>([]);
  const selectedCollaborations = ref<number[]>([]);
  const priceRange = ref<{ min: number; max: number } | null>(null);
  const sortBy = ref<string>("");

  // Pagination state
  const currentPage = ref(1);
  const itemsPerPage = ref(12);

  // Computed filter object for API
  const filters = computed(() => {
    const filterObj: any = {};

    if (selectedLocations.value.length > 0) {
      const locationFilter: any = {};

      const provinces = selectedLocations.value.filter(loc => loc.type === 'province').map(loc => loc.value);
      const regencies = selectedLocations.value.filter(loc => loc.type === 'regency').map(loc => loc.value);
      const districts = selectedLocations.value.filter(loc => loc.type === 'district').map(loc => loc.value);

      if (provinces.length > 0) {
        locationFilter.province = { $in: provinces };
      }
      if (regencies.length > 0) {
        locationFilter.regency = { $in: regencies };
      }
      if (districts.length > 0) {
        locationFilter.district = { $in: districts };
      }

      if (Object.keys(locationFilter).length > 0) {
        filterObj.social_forestry_business_group = {
          location: locationFilter,
        };
      }
    }

    if (priceRange.value) {
      filterObj.price = {
        $gte: priceRange.value.min,
        $lte: priceRange.value.max,
      };
    }

    if (selectedCommodities.value.length > 0) {
      // Use commodity_id directly as it's a foreign key field in Product schema
      filterObj.commodity_id = { $in: selectedCommodities.value };
    }

    if (selectedCommodityPriorities.value.length > 0) {
      filterObj.commodity = {
        ...filterObj.commodity,
        commodity_priority: {
          $in: selectedCommodityPriorities.value,
        },
      };
    }

    // Apply collaboration-based filtering
    if (selectedCollaborations.value.length > 0) {
      // Find matching rules for the selected collaborations
      const matchingRules = COLLABORATION_FILTER_RULES.filter((rule) =>
        rule.collaboration_ids.some((id) =>
          selectedCollaborations.value.includes(id)
        )
      );

      if (matchingRules.length > 0) {
        // Collect all unique values from matching rules
        const classGroups = new Set<string>();
        const productCategories = new Set<string>();
        const valueChains = new Set<string>();

        matchingRules.forEach((rule) => {
          rule.class_group.forEach((cg) => classGroups.add(cg));
          rule.product_category.forEach((pc) => productCategories.add(pc));
          rule.value_chain.forEach((vc) => valueChains.add(vc));
        });

        // Apply direct filters based on collaboration rules
        if (classGroups.size > 0) {
          const classGroupArray = Array.from(classGroups);
          if (classGroupArray.length === 1) {
            filterObj.class_group = { $eq: classGroupArray[0] };
          } else {
            filterObj.class_group = { $in: classGroupArray };
          }
        }

        if (productCategories.size > 0) {
          filterObj.product_category = { $in: Array.from(productCategories) };
        }

        if (valueChains.size > 0) {
          filterObj.value_chain = { $in: Array.from(valueChains) };
        }

        // Also filter by the selected collaboration IDs
        filterObj.collaboration_id = { $in: selectedCollaborations.value };
      }
    }

    return filterObj;
  });

  // Actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page
  };

  const setSelectedLocations = (locations: LocationFilter[]) => {
    selectedLocations.value = [...locations];
    currentPage.value = 1;
  };

  const setSelectedCommodities = (commodityIds: number[]) => {
    selectedCommodities.value = commodityIds;
    currentPage.value = 1;
  };

  const setSelectedCommodityPriorities = (priorities: string[]) => {
    selectedCommodityPriorities.value = priorities;
    currentPage.value = 1;
  };

  const setSelectedCollaborations = (collaborationIds: number[]) => {
    selectedCollaborations.value = collaborationIds;
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
    selectedCommodityPriorities.value = [];
    selectedCollaborations.value = [];
    priceRange.value = null;
    sortBy.value = "";
    currentPage.value = 1;
  };

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value !== "" ||
      selectedRegions.value.length > 0 ||
      selectedLocations.value.length > 0 ||
      selectedCommodities.value.length > 0 ||
      selectedCommodityPriorities.value.length > 0 ||
      selectedCollaborations.value.length > 0 ||
      priceRange.value !== null ||
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
    selectedCommodityPriorities,
    selectedCollaborations,
    priceRange,
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
    setSelectedCommodityPriorities,
    setSelectedCollaborations,
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
