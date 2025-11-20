<template>
  <MultiSelectCombobox
    v-model="selected"
    :options="commodityPriorities"
    placeholder="Cari Prioritas Komoditas..."
    emptyText="Pilih Prioritas Komoditas"
    icon="building"
    iconSize="24px"
  />
</template>

<script setup lang="ts">
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
  import { computed } from "vue";
  import { useCatalogStore } from "~/stores/useCatalogStore";

  const catalogStore = useCatalogStore();

  const commodityPriorities = computed(() => {
    const priorities = [
      "Madu",
      "Rotan",
      "Bambu",
      "Atsiri",
      "Kopi",
      "Kakao",
      "Buah-buahan",
      "Wisata Alam"
    ];

    return priorities.map((priority) => ({
      label: priority,
      value: priority,
    }));
  });

  // Use computed with getter/setter to avoid circular dependency
  const selected = computed<(string | number)[]>({
    get() {
      return catalogStore.selectedCommodityPriorities || [];
    },
    set(newValues) {
      catalogStore.setSelectedCommodityPriorities(newValues as string[]);
    },
  });

  defineExpose({
    selected,
  });
</script>
