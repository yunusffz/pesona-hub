import { useQuery } from "@tanstack/vue-query";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";
import type { components } from "~/types/pesona-hub-api";

// Keep types generic to accommodate schema evolution
type ListResponse = any;
type BaseResponse = any;
type CommodityDetailedPriorityResponse =
  components["schemas"]["CommodityDetailedPriorityResponse"];

export const useCommodityPriorities = (options: UseStrapiParamsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["commodityPriorities", options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params?.toString();

      const { data, error } = await $apiClient.GET(
        `/commodities/priorities${queryString ? `?${queryString}` : ""}`
      );

      if (error) {
        throw new Error(`Failed to fetch commodity priorities: ${error}`);
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCommodityPriority = (
  priorityId: string | number,
  options: Omit<UseStrapiParamsOptions, "pagination" | "page" | "limit"> = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["commodityPriority", priorityId, options],
    queryFn: async (): Promise<BaseResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params?.toString();

      const { data, error } = await $apiClient.GET(
        `/commodities/priorities/{priority_id}${queryString ? `?${queryString}` : ""}`,
        {
          params: {
            path: {
              priority_id: priorityId.toString(),
            },
          },
        }
      );

      if (error) {
        throw new Error(`Failed to fetch commodity priority: ${error}`);
      }

      return data;
    },
    enabled: !!priorityId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCommoditiesPriorityDetailed = () => {
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
