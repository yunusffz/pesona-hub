import { useQuery } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";

type CommodityDetailedPriorityResponse =
  components["schemas"]["CommodityDetailedPriorityResponse"];

export const useCommoditiesPriority = () => {
  const { $apiClient } = useNuxtApp();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["commodities-priority-detailed"],
    queryFn: async () => {
      const response = await $apiClient.GET(
        "/commodities/priorities/detailed"
      );

      if (response.error) {
        throw new Error("Failed to fetch commodities priority");
      }

      return (response.data?.data || []) as CommodityDetailedPriorityResponse[];
    },
  });

  return {
    commodities: computed(() => data.value || []),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    refetch,
  };
};
