import { useQuery } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";
// The API now returns generic Dict[str, Any] types
type ListResponse =
  components["schemas"]["ListResponse_Dict_str__Any__-Output"];
type BaseResponse = components["schemas"]["BaseResponse_Dict_str__Any__"];

export const useLocations = (options: UseStrapiParamsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["locations", options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/locations${queryString ? `?${queryString}` : ""}`
      );

      if (error) {
        throw new Error(`Failed to fetch locations: ${error}`);
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLocation = (
  locationId: string | number,
  options: Omit<UseStrapiParamsOptions, "pagination" | "page" | "limit"> = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["location", locationId, options],
    queryFn: async (): Promise<BaseResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/locations/{location_id}${queryString ? `?${queryString}` : ""}`,
        {
          params: {
            path: {
              location_id: locationId.toString(),
            },
          },
        }
      );

      if (error) {
        throw new Error(`Failed to fetch location: ${error}`);
      }

      return data;
    },
    enabled: !!locationId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
