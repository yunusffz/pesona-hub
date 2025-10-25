import { useQuery } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";

type Product = components["schemas"]["Product"];
type ListResponse = components["schemas"]["ListResponse_Product_-Output"];

interface UseProductsOptions {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { search = "", page = 1, limit = 10, enabled = true } = options;

  return useQuery({
    queryKey: ["products", { search, page, limit }],
    queryFn: async (): Promise<ListResponse> => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const { data, error } = await $apiClient.GET(
        `/products?${params.toString()}`
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

export const useProduct = (productId: string | number) => {
  const { $apiClient } = useNuxtApp();

  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<
      components["schemas"]["BaseResponse_Product_"]
    > => {
      const { data, error } = await $apiClient.GET(`/products/{product_id}`, {
        params: {
          path: {
            product_id: productId.toString(),
          },
        },
      });

      if (error) {
        throw new Error(`Failed to fetch product: ${error}`);
      }

      return data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
