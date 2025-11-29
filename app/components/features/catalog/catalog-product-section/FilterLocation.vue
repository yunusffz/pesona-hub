<template>
  <DropdownMenu :modal="false">
    <!-- Trigger Button -->
    <DropdownMenuTrigger as-child class="rounded-full">
      <button class="dropdown-trigger rounded-full">
        <div class="trigger-content flex flex-nowrap">
          <Icon name="uil:map-marker" size="20px" class="trigger-icon" />
          <span class="trigger-text text-base">
            {{
              selected.length > 0
                ? `${selected.length} wilayah dipilih`
                : "Pilih Wilayah"
            }}
          </span>
        </div>
        <Icon name="uil:angle-down" size="20px" class="chevron-icon" />
      </button>
    </DropdownMenuTrigger>

    <!-- Dropdown Content -->
    <DropdownMenuContent class="dropdown-content rounded-xl" align="start">
      <div v-if="isLoading" class="loading-state">
        <span>Memuat wilayah...</span>
      </div>

      <div v-else class="location-tree">
        <!-- Province Level -->
        <div
          v-for="province in hierarchicalData"
          :key="province.name"
          class="location-level province-level"
        >
          <div
            class="location-item"
            :class="{ selected: isSelected(province.name, 'province') }"
            @click="toggleSelection(province.name, 'province')"
          >
            <Icon
              v-if="isSelected(province.name, 'province')"
              name="uil:check"
              size="16px"
              class="check-icon"
            />
            <span class="location-name">{{ province.name }}</span>
            <span class="item-count">({{ province.regencies.length }})</span>
          </div>

          <!-- Regency Level -->
          <div
            v-if="expandedProvinces.includes(province.name)"
            class="location-children"
          >
            <div
              v-for="regency in province.regencies"
              :key="`${province.name}-${regency.name}`"
              class="location-level regency-level"
            >
              <div
                class="location-item"
                :class="{ selected: isSelected(regency.name, 'regency') }"
                @click="toggleSelection(regency.name, 'regency', province.name)"
              >
                <Icon
                  v-if="isSelected(regency.name, 'regency')"
                  name="uil:check"
                  size="16px"
                  class="check-icon"
                />
                <span class="location-name">{{ regency.name }}</span>
                <span class="item-count">({{ regency.districts.length }})</span>
              </div>

              <!-- District Level -->
              <div
                v-if="
                  expandedRegencies.includes(`${province.name}-${regency.name}`)
                "
                class="location-children"
              >
                <div
                  v-for="district in regency.districts"
                  :key="`${province.name}-${regency.name}-${district}`"
                  class="location-level district-level"
                >
                  <div
                    class="location-item"
                    :class="{ selected: isSelected(district, 'district') }"
                    @click="toggleSelection(district, 'district')"
                  >
                    <Icon
                      v-if="isSelected(district, 'district')"
                      name="uil:check"
                      size="16px"
                      class="check-icon"
                    />
                    <span class="location-name">{{ district }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Items Display -->
      <div v-if="selected.length > 0" class="selected-items w-[400px] p-3">
        <DropdownMenuSeparator class="my-2" />
        <div class="selected-header">Terpilih ({{ selected.length }})</div>
        <div class="selected-chips">
          <div
            v-for="(item, index) in selected"
            :key="`${item.type}-${item.value}`"
            class="selected-chip"
          >
            <span class="chip-label">{{ item.value }}</span>
            <Icon
              name="uil:times"
              size="14px"
              class="chip-remove"
              @click="removeSelection(index)"
            />
          </div>
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useLocations } from "~/queries/useLocations";
  import {
    useCatalogStore,
    type LocationFilter,
  } from "~/stores/useCatalogStore";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";

  interface District {
    name: string;
  }

  interface Regency {
    name: string;
    districts: string[];
  }

  interface Province {
    name: string;
    regencies: Regency[];
  }

  const catalogStore = useCatalogStore();
  const { data, isLoading, error } = useLocations({
    limit: 1000,
    page: 1,
  });

  // Expanded state
  const expandedProvinces = ref<string[]>([]);
  const expandedRegencies = ref<string[]>([]);

  // Selected locations - initialize from store
  const selected = ref<LocationFilter[]>([]);

  // Initialize selected from store on mount
  onMounted(() => {
    selected.value = [...catalogStore.selectedLocations];
  });

  // Transform flat data into hierarchical structure
  const hierarchicalData = computed<Province[]>(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    const locationData = data.value.data as Array<{
      district: string;
      regency: string;
      province: string;
    }>;

    // Build hierarchy
    const provinceMap = new Map<string, Map<string, Set<string>>>();

    locationData.forEach((location) => {
      if (!provinceMap.has(location.province)) {
        provinceMap.set(location.province, new Map());
      }

      const regencyMap = provinceMap.get(location.province)!;
      if (!regencyMap.has(location.regency)) {
        regencyMap.set(location.regency, new Set());
      }

      regencyMap.get(location.regency)!.add(location.district);
    });

    // Convert to array structure
    const provinces: Province[] = [];
    provinceMap.forEach((regencyMap, provinceName) => {
      const regencies: Regency[] = [];
      regencyMap.forEach((districtSet, regencyName) => {
        regencies.push({
          name: regencyName,
          districts: Array.from(districtSet).sort(),
        });
      });

      provinces.push({
        name: provinceName,
        regencies: regencies.sort((a, b) => a.name.localeCompare(b.name)),
      });
    });

    return provinces.sort((a, b) => a.name.localeCompare(b.name));
  });

  // Toggle expand/collapse
  const toggleExpand = (level: "province" | "regency", key: string) => {
    if (level === "province") {
      const index = expandedProvinces.value.indexOf(key);
      if (index > -1) {
        expandedProvinces.value.splice(index, 1);
      } else {
        expandedProvinces.value.push(key);
      }
    } else {
      const index = expandedRegencies.value.indexOf(key);
      if (index > -1) {
        expandedRegencies.value.splice(index, 1);
      } else {
        expandedRegencies.value.push(key);
      }
    }
  };

  // Check if item is selected
  const isSelected = (value: string, type: LocationFilter["type"]): boolean => {
    return selected.value.some(
      (item) => item.value === value && item.type === type
    );
  };

  // Toggle selection
  const toggleSelection = (
    value: string,
    type: LocationFilter["type"],
    provinceName?: string
  ) => {
    const index = selected.value.findIndex(
      (item) => item.value === value && item.type === type
    );

    if (index > -1) {
      // Remove if already selected
      selected.value.splice(index, 1);

      // Collapse children when deselecting parent
      if (type === "province") {
        const provinceIndex = expandedProvinces.value.indexOf(value);
        if (provinceIndex > -1) {
          expandedProvinces.value.splice(provinceIndex, 1);
        }
      } else if (type === "regency") {
        // Find the province for this regency to build the key
        const provinceForRegency =
          provinceName ||
          hierarchicalData.value.find((p) =>
            p.regencies.some((r) => r.name === value)
          )?.name;

        if (provinceForRegency) {
          const key = `${provinceForRegency}-${value}`;
          const regencyIndex = expandedRegencies.value.indexOf(key);
          if (regencyIndex > -1) {
            expandedRegencies.value.splice(regencyIndex, 1);
          }
        }
      }
    } else {
      // Add selection
      selected.value.push({ value, type });

      // Auto-expand children when selecting parent
      if (type === "province" && !expandedProvinces.value.includes(value)) {
        expandedProvinces.value.push(value);
      } else if (type === "regency") {
        // Find the province for this regency to build the key
        const provinceForRegency =
          provinceName ||
          hierarchicalData.value.find((p) =>
            p.regencies.some((r) => r.name === value)
          )?.name;

        if (provinceForRegency) {
          const key = `${provinceForRegency}-${value}`;
          if (!expandedRegencies.value.includes(key)) {
            expandedRegencies.value.push(key);
          }
        }
      }
    }

    // Update store immediately
    catalogStore.setSelectedLocations([...selected.value]);
  };

  // Remove selection
  const removeSelection = (index: number) => {
    selected.value.splice(index, 1);
    // Update store immediately
    catalogStore.setSelectedLocations([...selected.value]);
  };

  defineExpose({
    selected,
  });
</script>

<style scoped>
  .dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 340px;
    padding: 0.625rem 1rem;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dropdown-trigger:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .trigger-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .trigger-icon {
    color: #6b7280;
  }

  .trigger-text {
    color: #374151;
    font-weight: 500;
  }

  .chevron-icon {
    color: #9ca3af;
  }

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

  .location-level {
    margin-bottom: 0.25rem;
  }

  .location-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    min-height: 38px;
  }

  .location-item:hover {
    background-color: #f3f4f6;
  }

  .location-item.selected {
    background-color: #effcef;
    color: #035925;
    font-weight: 500;
  }

  .location-item.selected .location-name {
    color: #035925;
    font-weight: 600;
  }

  .check-icon {
    flex-shrink: 0;
    color: #035925;
  }

  .location-name {
    flex: 1;
    font-size: 12px;
    color: #0a0a0a;
    user-select: none;
    line-height: 1.4;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-count {
    color: #0a0a0a;
    font-size: 12px;
    font-weight: 500;
    margin-left: auto;
    margin-right: 0.875rem;
    flex-shrink: 0;
  }

  .location-item.selected .item-count {
    color: #035925;
    font-weight: 600;
  }

  .location-children {
    padding-left: 1.5rem;
    margin-top: 0.25rem;
    position: relative;
  }

  .location-children::before {
    content: "";
    position: absolute;
    left: 0.5rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #e2e8f0;
  }

  .province-level .location-item {
    font-weight: 500;
  }

  .regency-level .location-item {
    font-size: 0.875rem;
  }

  .district-level .location-item {
    font-size: 0.813rem;
    padding-left: 0.5rem;
  }

  .selected-items {
    padding-top: 0.75rem;
  }

  .selected-header {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .selected-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .selected-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background-color: #effcef;
    border: 1px solid #b0d3b0;
    border-radius: 6px;
    font-size: 0.813rem;
  }

  .chip-label {
    color: #035925;
    font-weight: 500;
  }

  .chip-remove {
    cursor: pointer;
    color: #9ca3af;
    transition: color 0.2s ease;
  }

  .chip-remove:hover {
    color: #ef4444;
  }
</style>
