import { useQuery } from "@tanstack/vue-query";
import { useSocialForestryBusinessGroups } from "~/queries/useSocialForestryBusinessGroups";
import { useProducts } from "~/queries/useProducts";
import { useLocations } from "~/queries/useLocations";
import { computed } from "vue";

/**
 * Composable for fetching dashboard statistics
 * Provides counts and aggregated data for various entities
 */
export function useStatistics() {
  // Fetch KUPS (Social Forestry Business Groups) count
  const {
    data: kupsData,
    isLoading: isLoadingKups,
    error: kupsError,
  } = useSocialForestryBusinessGroups({
    pagination: {
      page: 1,
      page_size: 1, // We only need metadata, not the actual data
    },
  });

  // Fetch Products count
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts({
    pagination: {
      page: 1,
      page_size: 1,
    },
  });

  // Fetch Locations for province count
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error: locationsError,
  } = useLocations({
    fields: ["province"],
  });

  // Extract KUPS count from pagination metadata
  const kupsCount = computed(() => {
    const meta = (kupsData.value as any)?.meta;
    if (meta?.pagination?.total !== undefined) {
      return meta.pagination.total;
    }
    return 0;
  });

  // Extract Products count from pagination metadata
  const productsCount = computed(() => {
    const meta = (productsData.value as any)?.meta;
    if (meta?.pagination?.total !== undefined) {
      return meta.pagination.total;
    }
    return 0;
  });

  // Count unique provinces
  const provincesCount = computed(() => {
    const data = (locationsData.value as any)?.data;
    if (!Array.isArray(data)) return 0;

    const uniqueProvinces = new Set(
      data
        .map((location: any) => location.province)
        .filter((province: any) => province)
    );

    return uniqueProvinces.size;
  });

  // Overall loading state
  const isLoading = computed(
    () =>
      isLoadingKups.value || isLoadingProducts.value || isLoadingLocations.value
  );

  return {
    // KUPS Statistics
    kupsCount,
    isLoadingKups,
    kupsError,

    // Products Statistics
    productsCount,
    isLoadingProducts,
    productsError,

    // Locations Statistics
    provincesCount,
    isLoadingLocations,
    locationsError,

    // Overall state
    isLoading,
  };
}

/**
 * Composable for fetching economic statistics from KUPS
 * Aggregates economic data like production capacity and transaction value
 */
export function useEconomicStatistics() {
  const { $apiClient } = useNuxtApp();

  return useQuery({
    queryKey: ["economic-statistics"],
    queryFn: async () => {
      // Fetch all economics data with necessary fields
      const { data, error } = await $apiClient.GET("/economics", {
        params: {
          query: {
            fields: ["production", "economic_value"],
            pagination: {
              page: 1,
              page_size: 10000, // Get all for aggregation
            },
          } as any,
        },
      });

      if (error) {
        throw new Error(`Failed to fetch economics: ${error}`);
      }

      const economicsData = (data as any)?.data || [];

      // Calculate aggregates
      const totalProduction = economicsData.reduce(
        (sum: number, item: any) => sum + (item.production || 0),
        0
      );

      const totalEconomicValue = economicsData.reduce(
        (sum: number, item: any) => sum + (item.economic_value || 0),
        0
      );

      return {
        totalProduction,
        totalEconomicValue,
        recordsCount: economicsData.length,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Format large numbers with Indonesian thousand separator
 * @param value - Number to format
 * @returns Formatted string
 *
 * @example
 * formatStatNumber(1284) // "1,284"
 * formatStatNumber(3138025000) // "3,138,025,000"
 */
export function formatStatNumber(value: number | undefined | null): string {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Format currency values in Indonesian Rupiah
 * @param value - Number to format
 * @param compact - Use compact notation (e.g., "3,1 M" instead of full number)
 * @returns Formatted string
 *
 * @example
 * formatCurrency(3138025000) // "Rp 3.138.025.000"
 * formatCurrency(3138025000, true) // "Rp 3,1 M"
 */
export function formatCurrency(
  value: number | undefined | null,
  compact = false
): string {
  if (value === null || value === undefined) return "Rp 0";

  if (compact) {
    // Format in millions or billions
    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
    } else if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
    }
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
