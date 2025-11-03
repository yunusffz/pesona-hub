import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue } from "vue";
import type { components } from "~/types/pesona-hub-api";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";

type ListResponse =
  | components["schemas"]["ListResponse_dict_str__Any__"]
  | components["schemas"]["BaseResponse_dict_str__Any__"]
  | null;

type LogActivityRequest = components["schemas"]["LogActivityRequest"];

export const useActivityLogs = (options: UseStrapiParamsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  // Create a reactive query key
  const queryKey = computed(() => {
    const search =
      typeof options.search === "function" ? options.search : options.search;
    const filters =
      typeof options.filters === "function"
        ? options.filters()
        : options.filters;
    const sort =
      typeof options.sort === "function" ? options.sort : options.sort;

    // Convert filters to a serializable format for query key
    const filtersKey = filters ? JSON.stringify(toValue(filters)) : null;

    return [
      "activity-logs",
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

      const { data, error } = await $apiClient.GET(
        `/analytics${queryString ? `?${queryString}` : ""}`
      );

      if (error) {
        throw new Error(`Failed to fetch activity logs: ${error}`);
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Mutation hook for logging activities
 *
 * @example
 * ```ts
 * const { mutate: logActivity, isPending, error } = useLogActivity();
 * logActivity({
 *   event_type: "create",
 *   entity_type: "product",
 *   entity_id: 1,
 *   access_type: "public"
 * });
 * ```
 */
export const useLogActivity = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityLog: LogActivityRequest) => {
      // Send activity log to /analytics/log endpoint
      const { data, error } = await $apiClient.POST("/analytics/log", {
        body: activityLog,
      });

      if (error) {
        throw new Error(`Failed to log activity: ${error}`);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate activity logs queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
    // Don't throw error to user, silently fail for analytics
    onError: (error) => {
      console.error("Failed to log activity:", error);
    },
  });
};
