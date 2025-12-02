<template>
  <section
    class="grid grid-cols-1 lg:grid-cols-3 gap-[74px] px-4 2xl:px-20 lg:px-10 py-20 sm:py-[120px] lg:py-0"
  >
    <StatisticContent
      number="500+"
      title="Produk kehutanan sosial terdaftar"
      description="Madu, kopi, kayu, dan kerajinan dari berbagai KUPS di seluruh Indonesia."
    />
    <StatisticContent
      :number="provinceDisplay"
      title="Jumlah Provinsi"
      description="Produk dan data perhutanan sosial yang terhimpun di Pesona Hub berasal dari berbagai provinsi di Indonesia, mencerminkan keberagaman potensi alam dan ekonomi masyarakat pengelola hutan."
    />
    <StatisticContent
      :number="mitraDisplay"
      title="Jumlah Mitra Terfasilitasi"
      description="Jumlah mitra yang terhubung berkolaborasi dan berinteraksi langsung dengan kelompok masyarakat dalam program perhutanan sosial."
    />
  </section>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import StatisticContent from "./StatisticContent.vue";
  import { useLocations } from "~/queries/useLocations";
  import { useUsers } from "~/queries/useUsers";
  import { useLocationHierarchy } from "~/composables/useLocationHierarchy";

  // Fetch locations with province, regency, and district fields
  const { data: locationsData } = useLocations();

  // Fetch users with role 'PARTNER'
  const { data: usersData } = useUsers({
    filters: {
      role: { $eq: "PARTNER" },
    },
    limit: 1000, // Get all mitra users
  });

  // Use location hierarchy composable to get structured data
  const { hierarchicalData } = useLocationHierarchy(locationsData);

  // Count provinces from hierarchical data
  const provinceCount = computed(() => {
    return hierarchicalData.value.length;
  });

  // Count mitra users
  const mitraCount = computed(() => {
    if (!usersData.value?.data) return 0;

    const data = usersData.value.data;
    if (Array.isArray(data)) {
      return data.length;
    }

    return 0;
  });

  // Format display strings
  const provinceDisplay = computed(() => {
    const count = provinceCount.value;
    return count > 0 ? `${count}+` : "-";
  });

  const mitraDisplay = computed(() => {
    const count = mitraCount.value;
    return count > 0 ? `${count}+` : "-";
  });
</script>
