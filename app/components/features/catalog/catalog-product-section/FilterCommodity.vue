<template>
  <MultiSelectCombobox
    v-model="selected"
    :options="commodities"
    placeholder="Cari Komoditas..."
    emptyText="Pilih Komoditas"
    icon="tags"
    iconSize="24px"
  />
</template>

<script setup lang="ts">
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
  import { ref, watch } from "vue";
  import { useCommodities } from "~/queries/useCommodities";
  import { useCatalogStore } from "~/stores/useCatalogStore";

  const catalogStore = useCatalogStore();
  const { data } = useCommodities();

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

  const selected = ref<(string | number)[]>(
    (catalogStore as any).selectedCommodities
  );

  watch(
    selected,
    (newValues) => {
      (catalogStore as any).setSelectedCommodities(
        newValues
          .map((v) => (typeof v === "string" ? Number(v) : v))
          .filter((v) => v !== null && v !== undefined) as number[]
      );
    },
    { deep: true }
  );

  watch(
    () => (catalogStore as any).selectedCommodities,
    (newValues) => {
      selected.value = newValues;
    },
    { deep: true }
  );

  defineExpose({
    selected,
  });
</script>
