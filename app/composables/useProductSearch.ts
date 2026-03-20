import { ref, watch } from "vue";
import { buildStrapiParams } from "~/utils/strapi";
import type { ProductWithRelations } from "~/types/product";

export const useProductSearch = (category: "PRODUK" | "EKOWISATA") => {
  const { $apiClient } = useNuxtApp();

  const search = ref("");
  const page = ref(1);
  const displayedProducts = ref<ProductWithRelations[]>([]);
  const hasMore = ref(true);
  const isLoading = ref(false);

  const fetchPage = async (currentPage: number) => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      const params = buildStrapiParams({
        filters: {
          product_category: { $eq: category },
          ...(search.value ? { name: { $containsi: search.value } } : {}),
        },
        populate: [
          "commodity",
          "social_forestry_business_group",
          "social_forestry_business_group.location",
        ],
        fields: ["id", "name", "thumbnails", "status", "description", "price", "unit", "product_usage"],
        page: currentPage,
        limit: 10,
      });
      const { data } = await $apiClient.GET(`/products?${params.toString()}` as "/products");
      const items = ((data as any)?.data ?? []) as ProductWithRelations[];
      if (currentPage === 1) {
        displayedProducts.value = items;
      } else {
        displayedProducts.value.push(...items);
      }
      hasMore.value = items.length === 10;
    } finally {
      isLoading.value = false;
    }
  };

  watch(page, (p) => fetchPage(p));

  let searchTimer: ReturnType<typeof setTimeout>;
  watch(search, () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (page.value === 1) {
        displayedProducts.value = [];
        fetchPage(1);
      } else {
        page.value = 1;
      }
    }, 300);
  });

  const open = () => fetchPage(1);

  const reset = () => {
    search.value = "";
    page.value = 1;
    displayedProducts.value = [];
    hasMore.value = true;
  };

  const loadMore = () => {
    if (!isLoading.value && hasMore.value) page.value++;
  };

  return { search, displayedProducts, hasMore, isLoading, open, reset, loadMore };
};
