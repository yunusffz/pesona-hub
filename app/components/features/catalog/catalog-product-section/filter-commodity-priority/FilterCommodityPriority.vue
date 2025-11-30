<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child class="rounded-full">
      <FilterDropdownTrigger
        :selected-count="selectedItems.length"
        placeholder="Pilih Prioritas Komoditas"
        selected-text="prioritas dipilih"
        icon="uil:building"
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent class="dropdown-content rounded-xl" align="start">
      <div v-if="isLoading" class="loading-state">
        <span>Memuat prioritas komoditas...</span>
      </div>

      <div v-else class="pt-1">
        <FilterDropdownSearch
          v-model="searchQuery"
          placeholder="Cari prioritas komoditas..."
        />
        <hr class="mx-1" />

        <div class="item-list">
          <FilterDropdownItem
            v-for="priority in filteredPriorities"
            :key="priority.value"
            :label="priority.label"
            :is-selected="isSelected(priority.value)"
            @toggle="toggleSelection(priority.value, priority.label)"
          />
          <div v-if="filteredPriorities.length === 0" class="empty-state">
            Tidak ada prioritas komoditas ditemukan
          </div>
        </div>
      </div>

      <FilterDropdownSelectedChips :items="selectedItems" @remove="removeSelection" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from "vue";
  import { useCommodityPriorities } from "~/queries/useCommodityPriorities";
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

  interface PriorityItem {
    label: string;
    value: string;
  }

  const catalogStore = useCatalogStore();
  const { data, isLoading } = useCommodityPriorities({ limit: 200 });

  const searchQuery = ref<string>("");
  const selectedItems = ref<PriorityItem[]>([]);

  const priorities = computed(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    return (data.value.data as string[]).map((priority) => ({
      label: priority,
      value: priority,
    }));
  });

  const filteredPriorities = computed(() => {
    if (!searchQuery.value) return priorities.value;

    const query = searchQuery.value.toLowerCase();
    return priorities.value.filter((priority) =>
      priority.label.toLowerCase().includes(query)
    );
  });

  const isSelected = (value: string) => {
    return selectedItems.value.some((item) => item.value === value);
  };

  const toggleSelection = (value: string, label: string) => {
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
    const values = selectedItems.value.map((item) => item.value);
    catalogStore.setSelectedCommodityPriorities(values);
  };

  onMounted(() => {
    const storedValues = catalogStore.selectedCommodityPriorities || [];
    selectedItems.value = priorities.value.filter((p) =>
      storedValues.includes(p.value)
    );
  });

  // Watch for data changes to update selected items
  watch(
    () => data.value,
    () => {
      if (priorities.value.length > 0) {
        const storedValues = catalogStore.selectedCommodityPriorities || [];
        selectedItems.value = priorities.value.filter((p) =>
          storedValues.includes(p.value)
        );
      }
    }
  );

  defineExpose({
    selected: computed(() => selectedItems.value.map((item) => item.value)),
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
