<template>
  <MultiSelectCombobox
    v-model="selected"
    :options="cities"
    placeholder="Cari Wilayah..."
    emptyText="Pilih Wilayah"
    icon="map"
    iconSize="24px"
  />
</template>

<script setup lang="ts">
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
  import { ref } from "vue";

  const cities = [
    { label: "Bandung", value: "bdg" },
    { label: "Jakarta", value: "jkt" },
    { label: "Surabaya", value: "sby" },
    { label: "Medan", value: "mdn" },
  ];

  const selected = ref<string[]>([]);
</script>
