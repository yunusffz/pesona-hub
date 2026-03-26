import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

export interface MisiItem {
  id: string;
  image_object_name: string | null;
  title: string;
  description: string;
}

export interface VisiItem {
  id: string;
  image_object_name: string | null;
  year: number;
  description: string;
}

export interface AboutUsData {
  title: string;
  description: string;
  image_object_name: string | null;
  misi: {
    section_title: string;
    headline: string;
    description: string;
    items: MisiItem[];
  };
  visi: VisiItem[];
}

const SETTING_KEY = "tentang_kami";

const parseMisiItem = (raw: unknown): MisiItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : `item_${Date.now()}_${Math.random()}`,
    image_object_name: typeof d.image_object_name === "string" ? d.image_object_name : null,
    title: typeof d.title === "string" ? d.title : "",
    description: typeof d.description === "string" ? d.description : "",
  };
};

const parseVisiItem = (raw: unknown): VisiItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : `visi_${Date.now()}_${Math.random()}`,
    image_object_name: typeof d.image_object_name === "string" ? d.image_object_name : null,
    year: typeof d.year === "number" ? d.year : new Date().getFullYear(),
    description: typeof d.description === "string" ? d.description : "",
  };
};

const parseAboutUs = (raw: unknown): AboutUsData => {
  const empty: AboutUsData = {
    title: "",
    description: "",
    image_object_name: null,
    misi: { section_title: "", headline: "", description: "", items: [] },
    visi: [],
  };
  if (!raw || typeof raw !== "object") return empty;
  const d = raw as Record<string, unknown>;
  const misiRaw = d.misi && typeof d.misi === "object" ? (d.misi as Record<string, unknown>) : {};
  const misiItemsRaw = Array.isArray(misiRaw.items) ? misiRaw.items : [];
  const visiRaw = Array.isArray(d.visi) ? d.visi : [];
  return {
    title: typeof d.title === "string" ? d.title : "",
    description: typeof d.description === "string" ? d.description : "",
    image_object_name: typeof d.image_object_name === "string" ? d.image_object_name : null,
    misi: {
      section_title: typeof misiRaw.section_title === "string" ? misiRaw.section_title : "",
      headline: typeof misiRaw.headline === "string" ? misiRaw.headline : "",
      description: typeof misiRaw.description === "string" ? misiRaw.description : "",
      items: misiItemsRaw.map(parseMisiItem).filter((i): i is MisiItem => i !== null),
    },
    visi: visiRaw.map(parseVisiItem).filter((i): i is VisiItem => i !== null),
  };
};

export const useAboutUs = () => {
  const { $apiClient } = useNuxtApp();

  return useQuery({
    queryKey: ["settings", SETTING_KEY],
    queryFn: async (): Promise<AboutUsData> => {
      const { data, error } = await $apiClient.GET("/settings");
      if (error) return parseAboutUs(null);
      const settings = (data as any)?.data ?? data;
      return parseAboutUs(settings?.[SETTING_KEY]);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSaveAboutUs = () => {
  const { $apiClient } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AboutUsData) => {
      const { error } = await $apiClient.POST("/settings", {
        body: { key: SETTING_KEY, value: payload },
      });
      if (error) throw new Error("Gagal menyimpan data Tentang Kami");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", SETTING_KEY] });
    },
  });
};
