import { useQuery } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";
import type { UseStrapiParamsOptions } from "~/types/strapi";
import { buildStrapiParams } from "~/utils/strapi";

type ListResponse = components["schemas"]["BaseResponse_dict_str__Any__"];

export const useProducts = (options: UseStrapiParamsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["products", options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/products${queryString ? `?${queryString}` : ""}`
      );

      if (error) {
        throw new Error(`Failed to fetch products: ${error}`);
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (
  productId: string | number,
  options: Omit<UseStrapiParamsOptions, "pagination" | "page" | "limit"> = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["product", productId, options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/products/{product_id}${queryString ? `?${queryString}` : ""}`,
        {
          params: {
            path: {
              product_id: productId.toString(),
            },
          },
        }
      );

      if (error) {
        throw new Error(`Failed to fetch product: ${error}`);
      }

      return data;
    },
    enabled: !!productId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
