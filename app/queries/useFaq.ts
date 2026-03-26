import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  is_active: boolean;
  order: number;
}

const SETTING_KEY = "faq";

const parseFaqItem = (raw: unknown): FaqItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : `faq_${Date.now()}_${Math.random()}`,
    question: typeof d.question === "string" ? d.question : "",
    answer: typeof d.answer === "string" ? d.answer : "",
    is_active: typeof d.is_active === "boolean" ? d.is_active : true,
    order: typeof d.order === "number" ? d.order : 0,
  };
};

const saveFaqs = async ($apiClient: any, items: FaqItem[]): Promise<void> => {
  const { error } = await $apiClient.POST("/settings", {
    body: { key: SETTING_KEY, value: items },
  });
  if (error) throw new Error("Gagal menyimpan data FAQ");
};

export const useFaqs = () => {
  const { $apiClient } = useNuxtApp();

  return useQuery({
    queryKey: ["settings", SETTING_KEY],
    queryFn: async (): Promise<FaqItem[]> => {
      const { data, error } = await $apiClient.GET("/settings");
      if (error) return [];
      const settings = (data as any)?.data ?? data;
      const raw = settings?.[SETTING_KEY];
      if (!Array.isArray(raw)) return [];
      return raw.map(parseFaqItem).filter((i): i is FaqItem => i !== null);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateFaq = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<FaqItem, "id" | "order">) => {
      const current = queryClient.getQueryData<FaqItem[]>(["settings", SETTING_KEY]) ?? [];
      const nextOrder = current.length > 0 ? Math.max(...current.map((f) => f.order)) + 1 : 1;
      const newItem: FaqItem = { ...item, id: `faq_${Date.now()}`, order: nextOrder };
      await saveFaqs($apiClient, [...current, newItem]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings", SETTING_KEY] }),
  });
};

export const useUpdateFaq = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<FaqItem, "id">> }) => {
      const current = queryClient.getQueryData<FaqItem[]>(["settings", SETTING_KEY]) ?? [];
      await saveFaqs($apiClient, current.map((f) => (f.id === id ? { ...f, ...data } : f)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings", SETTING_KEY] }),
  });
};

export const useDeleteFaq = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const current = queryClient.getQueryData<FaqItem[]>(["settings", SETTING_KEY]) ?? [];
      await saveFaqs($apiClient, current.filter((f) => f.id !== id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings", SETTING_KEY] }),
  });
};
