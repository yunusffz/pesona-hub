import { useQuery } from "@tanstack/vue-query";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";

// Keep types generic to accommodate schema evolution
type ListResponse = any;
type BaseResponse = any;

export const useCommodities = (options: UseStrapiParamsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["commodities", options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params?.toString();

      const { data, error } = await $apiClient.GET(
        `/commodities${queryString ? `?${queryString}` : ""}`
      );

      if (error) {
        throw new Error(`Failed to fetch commodities: ${error}`);
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCommodity = (
  commodityId: string | number,
  options: Omit<UseStrapiParamsOptions, "pagination" | "page" | "limit"> = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["commodity", commodityId, options],
    queryFn: async (): Promise<BaseResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params?.toString();

      const { data, error } = await $apiClient.GET(
        `/commodities/{commodity_id}${queryString ? `?${queryString}` : ""}`,
        {
          params: {
            path: {
              commodity_id: commodityId.toString(),
            },
          },
        }
      );

      if (error) {
        throw new Error(`Failed to fetch commodity: ${error}`);
      }

      return data;
    },
    enabled: !!commodityId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
