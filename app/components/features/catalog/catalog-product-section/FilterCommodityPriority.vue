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
  import { useCommodityPriorities } from "~/queries/useCommodityPriorities";
  import { useCatalogStore } from "~/stores/useCatalogStore";

  const catalogStore = useCatalogStore();
  const { data } = useCommodityPriorities({ limit: 200 });

  const commodityPriorities = computed(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    return (data.value.data as string[]).map((priority) => ({
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
