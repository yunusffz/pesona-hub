import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

export interface PartnerItem {
  id: string;
  name: string;
  logo_object_name: string | null;
  order: number;
}

const SETTING_KEY = "partners";

const parsePartners = (raw: unknown): PartnerItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (p): p is PartnerItem =>
      p && typeof p === "object" && typeof p.name === "string"
  );
};

export const usePartners = () => {
  const { $apiClient } = useNuxtApp();

  return useQuery({
    queryKey: ["settings", SETTING_KEY],
    queryFn: async (): Promise<PartnerItem[]> => {
      const { data, error } = await $apiClient.GET("/settings");

      if (error) return [];

      // Response shape: { data: { partners: [...] } } or { partners: [...] }
      const settings = (data as any)?.data ?? data;
      return parsePartners(settings?.[SETTING_KEY]);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

const savePartners = async (
  $apiClient: any,
  partners: PartnerItem[]
): Promise<void> => {
  const { error } = await $apiClient.POST("/settings", {
    body: { key: SETTING_KEY, value: partners },
  });
  if (error) throw new Error("Failed to save partner settings");
};

export const useCreatePartner = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: Omit<PartnerItem, "id">) => {
      const current = queryClient.getQueryData<PartnerItem[]>(["settings", SETTING_KEY]) ?? [];
      const newItem: PartnerItem = {
        ...partner,
        id: `partner_${Date.now()}`,
      };
      await savePartners($apiClient, [...current, newItem]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", SETTING_KEY] });
    },
  });
};

export const useUpdatePartner = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<PartnerItem, "id">> }) => {
      const current = queryClient.getQueryData<PartnerItem[]>(["settings", SETTING_KEY]) ?? [];
      const updated = current.map((p) => (p.id === id ? { ...p, ...data } : p));
      await savePartners($apiClient, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", SETTING_KEY] });
    },
  });
};

export const useDeletePartner = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const current = queryClient.getQueryData<PartnerItem[]>(["settings", SETTING_KEY]) ?? [];
      const updated = current.filter((p) => p.id !== id);
      await savePartners($apiClient, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", SETTING_KEY] });
    },
  });
};
