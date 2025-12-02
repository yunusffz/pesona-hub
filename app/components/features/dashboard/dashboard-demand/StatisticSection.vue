<template>
  <div class="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
    <BigNumber
      :number="formatNumber(totalPartners)"
      title="Total Mitra"
      icon="uil:users-alt"
      class="w-full"
    />
  </div>
</template>
<script setup lang="ts">
  import BigNumber from "../dashboard-supply/statistic-section/BigNumber.vue";
  import { computed } from "vue";
  import { useUsers } from "~/queries/useUsers";

  const { data } = useUsers({
    filters: {
      role: { $eq: "PARTNER" },
    },
    enabled: true,
  });

  const totalPartners = computed(() => {
    if (!data.value?.data) return 0;
    if (Array.isArray(data.value.data)) {
      return data.value.data.length;
    }
    return 0;
  });

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("id-ID").format(num);
  };
</script>
