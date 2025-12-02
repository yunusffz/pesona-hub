<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child class="rounded-full">
      <FilterDropdownTrigger
        :selected-count="selectedItems.length"
        placeholder="Pilih Kolaborasi"
        selected-text="kolaborasi dipilih"
        icon="uil:users-alt"
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent class="dropdown-content rounded-xl" align="start">
      <div v-if="isLoading" class="loading-state">
        <span>Memuat kolaborasi...</span>
      </div>

      <div v-else class="pt-1">
        <FilterDropdownSearch
          v-model="searchQuery"
          placeholder="Cari kolaborasi..."
        />
        <hr class="mx-1" />

        <div class="item-list">
          <FilterDropdownItem
            v-for="collaboration in filteredCollaborations"
            :key="collaboration.value"
            :label="collaboration.label"
            :is-selected="isSelected(collaboration.value)"
            @toggle="toggleSelection(collaboration.value, collaboration.label)"
          />
          <div v-if="filteredCollaborations.length === 0" class="empty-state">
            Tidak ada kolaborasi ditemukan
          </div>
        </div>
      </div>

      <FilterDropdownSelectedChips
        :items="selectedItems"
        @remove="removeSelection"
      />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from "vue";
  import { useCollaborations } from "~/queries/useCollaborations";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";
  import FilterDropdownTrigger from "./common/FilterDropdownTrigger.vue";
  import FilterDropdownSearch from "./common/FilterDropdownSearch.vue";
  import FilterDropdownItem from "./common/FilterDropdownItem.vue";
  import FilterDropdownSelectedChips from "./common/FilterDropdownSelectedChips.vue";
  import type { components } from "~/types/pesona-hub-api";

  interface CollaborationItem {
    label: string;
    value: number;
  }

  type CollaborationResponse = components["schemas"]["CollaborationResponse"];

  const catalogStore = useCatalogStore();
  const { data, isLoading } = useCollaborations({ limit: 200 });

  const searchQuery = ref<string>("");
  const selectedItems = ref<CollaborationItem[]>([]);

  const collaborations = computed(() => {
    if (!data.value) return [];

    const responseData = data.value as any;

    return (responseData.data as CollaborationResponse[])
      .filter((collab: any) => collab.status === "active")
      .map((collab) => ({
        label: collab.name,
        value: collab.id,
      }));
  });

  const filteredCollaborations = computed(() => {
    if (!searchQuery.value) return collaborations.value;

    const query = searchQuery.value.toLowerCase();
    return collaborations.value.filter((collab) =>
      collab.label.toLowerCase().includes(query)
    );
  });

  const isSelected = (value: number) => {
    return selectedItems.value.some((item) => item.value === value);
  };

  const toggleSelection = (value: number, label: string) => {
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
    catalogStore.setSelectedCollaborations(values);
  };

  onMounted(() => {
    const storedValues = catalogStore.selectedCollaborations || [];
    selectedItems.value = collaborations.value.filter((c) =>
      storedValues.includes(c.value)
    );
  });

  // Watch for data changes to update selected items
  watch(
    () => data.value,
    () => {
      if (collaborations.value.length > 0) {
        const storedValues = catalogStore.selectedCollaborations || [];
        selectedItems.value = collaborations.value.filter((c) =>
          storedValues.includes(c.value)
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
