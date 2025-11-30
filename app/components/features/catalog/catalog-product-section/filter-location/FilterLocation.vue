<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child class="rounded-full">
      <LocationTriggerButton :selected-count="selected.length" />
    </DropdownMenuTrigger>

    <DropdownMenuContent class="dropdown-content rounded-xl" align="start">
      <div v-if="isLoading" class="loading-state">
        <span>Memuat wilayah...</span>
      </div>

      <div v-else class="pt-1">
        <LocationSearchBar v-model="searchQuery" />
        <hr class="mx-1" />

        <div class="location-tree">
          <LocationTreeItem
            v-for="province in filteredHierarchicalData"
            :key="province.name"
            :name="province.name"
            level="province"
            :is-selected="isSelected(province.name, 'province')"
            :show-children="expandedProvinces.includes(province.name)"
            :item-count="province.regencies.length"
            @toggle="toggleSelection(province.name, 'province')"
          >
            <LocationTreeItem
              v-for="regency in province.regencies"
              :key="`${province.name}-${regency.name}`"
              :name="regency.name"
              level="regency"
              :is-selected="isSelected(regency.name, 'regency')"
              :show-children="
                expandedRegencies.includes(`${province.name}-${regency.name}`)
              "
              :item-count="regency.districts.length"
              @toggle="toggleSelection(regency.name, 'regency', province.name)"
            >
              <LocationTreeItem
                v-for="district in regency.districts"
                :key="`${province.name}-${regency.name}-${district}`"
                :name="district"
                level="district"
                :is-selected="isSelected(district, 'district')"
                @toggle="toggleSelection(district, 'district')"
              />
            </LocationTreeItem>
          </LocationTreeItem>
        </div>
      </div>

      <SelectedLocationChips :items="selected" @remove="removeSelection" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useLocations } from "~/queries/useLocations";
  import { useCatalogStore } from "~/stores/useCatalogStore";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";
  import { useLocationHierarchy } from "~/composables/useLocationHierarchy";
  import { useLocationSearch } from "~/composables/useLocationSearch";
  import { useLocationSelection } from "~/composables/useLocationSelection";
  import LocationTriggerButton from "./LocationTriggerButton.vue";
  import LocationSearchBar from "./LocationSearchBar.vue";
  import LocationTreeItem from "./LocationTreeItem.vue";
  import SelectedLocationChips from "./SelectedLocationChips.vue";

  const catalogStore = useCatalogStore();
  const { data, isLoading } = useLocations({
    limit: 1000,
    page: 1,
  });

  const searchQuery = ref<string>("");
  const expandedProvinces = ref<string[]>([]);
  const expandedRegencies = ref<string[]>([]);

  const { hierarchicalData } = useLocationHierarchy(data);
  const { filteredHierarchicalData } = useLocationSearch(
    hierarchicalData,
    searchQuery,
    expandedProvinces,
    expandedRegencies
  );

  const { selected, isSelected, toggleSelection, removeSelection } =
    useLocationSelection(
      hierarchicalData,
      expandedProvinces,
      expandedRegencies,
      (selections) => catalogStore.setSelectedLocations(selections)
    );

  onMounted(() => {
    selected.value = [...catalogStore.selectedLocations];
  });

  defineExpose({
    selected,
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

  .location-tree {
    max-height: 350px;
    overflow-y: auto;
    padding: 0.25rem;
  }
</style>
