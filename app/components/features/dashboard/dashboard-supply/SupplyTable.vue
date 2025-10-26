<template>
  <section>
    <div class="flex items-center justify-between">
      <SearchInput class="w-[290px] h-9" placeholder="Cari..." />
      <BaseButton
        variant="solid"
        class="pr-2 pl-3 py-2 justify-between text-sm"
      >
        <Icon name="uil:file-export" class="w-4 h-4" />
        Export
        <Icon name="uil:angle-down" class="w-5 h-5 font-medium" />
      </BaseButton>
    </div>
    <div class="mt-4">
      <DataTable />
    </div>
  </section>
</template>
<script setup lang="ts">
  import SearchInput from "~/components/base/SearchInput.vue";
  import BaseButton from "~/components/base/BaseButton.vue";
  import DataTable from "../data-table/DataTable.vue";
</script>
