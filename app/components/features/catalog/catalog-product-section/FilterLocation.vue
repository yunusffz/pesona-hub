<template>
  <MultiSelectCombobox
    v-model="selected"
    :options="locations"
    placeholder="Cari Lokasi..."
    emptyText="Pilih Lokasi"
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
  const { data, isLoading, error, refetch } = useLocations();

  const locations = computed(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    return (
      data.value.data as Array<{
        district: string;
        regency: string;
        province: string;
        village: string;
        id: string | number;
      }>
    ).map((location) => ({
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
