import { useQuery } from "@tanstack/vue-query";
import { computed, toValue } from "vue";
import type { components } from "~/types/pesona-hub-api";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";
// The API now returns generic Dict[str, Any] types
type ListResponse =
  components["schemas"]["BaseResponse_LocationResponse_-Output"];

export const useLocations = (options: UseStrapiParamsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  // Create a reactive query key
  const queryKey = computed(() => {
    const search =
      typeof options.search === "function" ? options.search : options.search;
    const filters =
      typeof options.filters === "function" ? options.filters : options.filters;
    const sort =
      typeof options.sort === "function" ? options.sort : options.sort;

    // Convert filters to a serializable format for query key
    const filtersKey = filters ? JSON.stringify(toValue(filters)) : null;

    return [
      "locations",
      {
        search: toValue(search),
        filters: filtersKey,
        sort: toValue(sort),
        populate: options.populate,
        fields: options.fields,
        page: options.page,
        limit: options.limit,
      },
    ];
  });

  return useQuery({
    queryKey: queryKey,
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params?.toString();

      console.log("useLocations - Fetching with query string:", queryString);

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
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params?.toString();

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
