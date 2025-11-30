<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child class="rounded-full">
      <FilterDropdownTrigger
        :selected-count="selectedItems.length"
        placeholder="Pilih Komoditas"
        selected-text="komoditas dipilih"
        icon="uil:tag-alt"
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent class="dropdown-content rounded-xl" align="start">
      <div v-if="isLoading" class="loading-state">
        <span>Memuat komoditas...</span>
      </div>

      <div v-else class="pt-1">
        <FilterDropdownSearch
          v-model="searchQuery"
          placeholder="Cari komoditas..."
        />
        <hr class="mx-1" />

        <div class="item-list">
          <FilterDropdownItem
            v-for="commodity in filteredCommodities"
            :key="commodity.value"
            :label="commodity.label"
            :is-selected="isSelected(commodity.value)"
            @toggle="toggleSelection(commodity.value, commodity.label)"
          />
          <div v-if="filteredCommodities.length === 0" class="empty-state">
            Tidak ada komoditas ditemukan
          </div>
        </div>
      </div>

      <FilterDropdownSelectedChips :items="selectedItems" @remove="removeSelection" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useCommodities } from "~/queries/useCommodities";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";
  import FilterDropdownTrigger from "../common/FilterDropdownTrigger.vue";
  import FilterDropdownSearch from "../common/FilterDropdownSearch.vue";
  import FilterDropdownItem from "../common/FilterDropdownItem.vue";
  import FilterDropdownSelectedChips from "../common/FilterDropdownSelectedChips.vue";

  interface CommodityItem {
    label: string;
    value: string | number;
  }

  const catalogStore = useCatalogStore();
  const { data, isLoading } = useCommodities({ limit: 200 });

  const searchQuery = ref<string>("");
  const selectedItems = ref<CommodityItem[]>([]);

  const commodities = computed(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    return (data.value.data as Array<Record<string, unknown>>).map(
      (commodity) => ({
        label: String(
          (commodity as any).name ?? (commodity as any).label ?? "-"
        ),
        value: (commodity as any).id as string | number,
      })
    );
  });

  const filteredCommodities = computed(() => {
    if (!searchQuery.value) return commodities.value;

    const query = searchQuery.value.toLowerCase();
    return commodities.value.filter((commodity) =>
      commodity.label.toLowerCase().includes(query)
    );
  });

  const isSelected = (value: string | number) => {
    return selectedItems.value.some((item) => item.value === value);
  };

  const toggleSelection = (value: string | number, label: string) => {
    const index = selectedItems.value.findIndex((item) => item.value === value);

    if (index > -1) {
      selectedItems.value.splice(index, 1);
    } else {
      selectedItems.value.push({ label, value });
    }

    updateStore();
  };

  const removeSelection = (index: number) => {
    selectedItems.value.splice(index, 1);
    updateStore();
  };

  const updateStore = () => {
    const numericValues = selectedItems.value
      .map((item) => (typeof item.value === "string" ? Number(item.value) : item.value))
      .filter((v) => v !== null && v !== undefined && !isNaN(Number(v))) as number[];

    (catalogStore as any).setSelectedCommodities(numericValues);
  };

  onMounted(() => {
    const storedIds = (catalogStore as any).selectedCommodities || [];
    selectedItems.value = commodities.value.filter((c) =>
      storedIds.includes(c.value)
    );
  });

  defineExpose({
    selected: computed(() =>
      selectedItems.value.map((item) =>
        typeof item.value === "string" ? Number(item.value) : item.value
      )
    ),
  });
</script>

<style scoped>
  .dropdown-content {
    width: 600px;
    max-height: 500px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 8px;
    padding: 0.75rem;
  }

  .loading-state {
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .item-list {
    max-height: 350px;
    overflow-y: auto;
    padding: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
  }
</style>
