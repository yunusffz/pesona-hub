<template>
  <MultiSelectCombobox
    v-model="selected"
    :options="locations"
    placeholder="Cari Wilayah..."
    emptyText="Pilih Wilayah"
    icon="map"
    iconSize="24px"
  />
</template>

<script setup lang="ts">
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
  import { ref, watch } from "vue";
  import { useLocations } from "~/queries/useLocations";
  import { useCatalogStore } from "~/stores/useCatalogStore";

  const catalogStore = useCatalogStore();
  const { data, isLoading, error, refetch } = useLocations({
    limit: 200,
    page: 1,
  });

  const locations = computed(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    const locationData = data.value.data as Array<{
      district: string;
      regency: string;
      province: string;
      village: string;
      id: string | number;
    }>;

    // Group by district to get distinct districts
    const districtMap = new Map<
      string,
      {
        district: string;
        regency: string;
        province: string;
      }
    >();

    locationData.forEach((location) => {
      if (!districtMap.has(location.district)) {
        districtMap.set(location.district, {
          district: location.district,
          regency: location.regency,
          province: location.province,
        });
      }
    });

    // Convert map to array and return
    return Array.from(districtMap.values()).map((location) => ({
      label: `${location.district} - ${location.regency} - ${location.province}`,
      value: location.district,
    }));
  });

  const selected = ref<string[]>(catalogStore.selectedLocations);

  // Watch for changes in selected locations and update store
  watch(
    selected,
    (newLocations) => {
      catalogStore.setSelectedLocations(newLocations);
    },
    { deep: true }
  );

  // Watch for changes in store and update local selected
  watch(
    () => catalogStore.selectedLocations,
    (newLocations) => {
      selected.value = newLocations;
    },
    { deep: true }
  );

  defineExpose({
    selected,
  });
</script>
