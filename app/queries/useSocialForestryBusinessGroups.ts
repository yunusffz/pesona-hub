import { useQuery } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";

type ListResponse =
  | components["schemas"]["BaseResponse_dict_str__Any__"]
  | components["schemas"]["BaseResponse_SocialForestryBusinessGroupResponse_"]
  | {
      [key: string]: unknown;
    }
  | null;

type BaseResponse =
  | components["schemas"]["BaseResponse_dict_str__Any__"]
  | components["schemas"]["SocialForestryBusinessGroupResponse"];

export const useSocialForestryBusinessGroups = (
  options: UseStrapiParamsOptions = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["social-forestry-business-groups", options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/social-forestry-business-groups${
          queryString ? `?${queryString}` : ""
        }`
      );

      if (error) {
        throw new Error(
          `Failed to fetch social forestry business groups: ${error}`
        );
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSocialForestryBusinessGroup = (
  socialForestryBusinessGroupId: string | number,
  options: Omit<UseStrapiParamsOptions, "pagination" | "page" | "limit"> = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: [
      "social-forestry-business-group",
      socialForestryBusinessGroupId,
      options,
    ],
    queryFn: async (): Promise<BaseResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/social-forestry-business-groups/{social_forestry_business_group_id}${
          queryString ? `?${queryString}` : ""
        }`,
        {
          params: {
            path: {
              social_forestry_business_group_id:
                typeof socialForestryBusinessGroupId === "string"
                  ? socialForestryBusinessGroupId
                  : socialForestryBusinessGroupId.toString(),
            },
          },
        }
      );

      if (error) {
        throw new Error(
          `Failed to fetch social forestry business group: ${error}`
        );
      }

      return data;
    },
    enabled: !!socialForestryBusinessGroupId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
