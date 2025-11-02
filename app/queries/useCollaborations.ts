import { useQuery } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";

type ListResponse =
  | components["schemas"]["ListResponse_dict_str__Any__"]
  | components["schemas"]["BaseResponse_dict_str__Any__"]
  | components["schemas"]["CollaborationResponse"]
  | null;

type BaseResponse =
  | components["schemas"]["BaseResponse_dict_str__Any__"]
  | components["schemas"]["CollaborationResponse"];

export const useCollaborations = (options: UseStrapiParamsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["collaborations", options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/collaborations${queryString ? `?${queryString}` : ""}`
      );

      if (error) {
        throw new Error(`Failed to fetch collaborations: ${error}`);
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCollaboration = (
  collaborationId: string | number,
  options: Omit<UseStrapiParamsOptions, "pagination" | "page" | "limit"> = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["collaboration", collaborationId, options],
    queryFn: async (): Promise<BaseResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/collaborations/{collaboration_id}${queryString ? `?${queryString}` : ""}`,
        {
          params: {
            path: {
              collaboration_id: Number(collaborationId),
            },
          },
        }
      );

      if (error) {
        throw new Error(`Failed to fetch collaboration: ${error}`);
      }

      return data;
    },
    enabled: !!collaborationId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

