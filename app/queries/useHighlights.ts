import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";

type HighlighResponse = components["schemas"]["HighlighResponse"];
type HighlightCreate = components["schemas"]["HighlightCreate"];
type HighlightUpdate = components["schemas"]["HighlightUpdate"];

export const useHighlights = () => {
  const { $apiClient } = useNuxtApp();

  return useQuery({
    queryKey: ["highlights"],
    queryFn: async (): Promise<HighlighResponse[]> => {
      const { data, error } = await $apiClient.GET("/highlights", {
        params: { query: { populate: "product" } },
      });

      if (error) throw new Error(`Failed to fetch highlights: ${error}`);

      const list = data as unknown as { data?: HighlighResponse[] } | HighlighResponse[] | null;
      if (Array.isArray(list)) return list;
      if (list && "data" in list && Array.isArray(list.data)) return list.data;
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateHighlight = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: HighlightCreate) => {
      const { data, error } = await $apiClient.POST("/highlights", { body });
      if (error) throw new Error(`Failed to create highlight: ${error}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
    },
  });
};

export const useUpdateHighlight = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: HighlightUpdate;
    }) => {
      const { data, error } = await $apiClient.PUT(
        "/highlights/{highlight_id}",
        {
          params: { path: { highlight_id: id } },
          body,
        }
      );
      if (error) throw new Error(`Failed to update highlight: ${error}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
    },
  });
};

export const useDeleteHighlight = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await $apiClient.DELETE("/highlights/{highlight_id}", {
        params: { path: { highlight_id: id } },
      });
      if (error) throw new Error(`Failed to delete highlight: ${error}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
    },
  });
};
