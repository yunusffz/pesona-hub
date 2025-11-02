<template>
  <div class="flex flex-col gap-2.5">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-1 text-xs text-neutral-950 hover:opacity-80"
    >
      <span class="flex-1 text-left">Pilih Wilayah</span>
      <span class="text-[#717182]">
        ({{ checkedCount }}/{{ groupedRegions.length }})
      </span>
      <Icon
        :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'"
        class="h-4 w-4"
      />
    </button>

    <div v-if="isExpanded" class="flex flex-col gap-2.5">
      <div v-if="isLoading" class="text-xs text-[#717182]">
        Memuat data lokasi...
      </div>
      <div v-else-if="error" class="text-xs text-red-500">
        Error memuat lokasi: {{ error.message }}
      </div>
      <div
        v-else-if="groupedRegions.length === 0"
        class="text-xs text-[#717182]"
      >
        Tidak ada data lokasi
      </div>
      <div
        v-for="region in groupedRegions"
        :key="region.province"
        class="flex flex-col gap-1.5"
      >
        <div
          class="flex items-center gap-1.5 cursor-pointer"
          @click="toggleRegion(region.province)"
        >
          <Checkbox :checked="selectedRegionsMap[region.province] || false" />
          <span class="flex-1 text-xs text-neutral-950">
            {{ region.province }}
          </span>
          <span class="text-xs text-[#717182]"
            >({{ region.districts.length }})</span
          >
          <button
            v-if="region.districts.length > 0"
            @click.stop="toggleRegionExpansion(region.province)"
            class="hover:opacity-70"
          >
            <Icon
              :name="
                isRegionExpanded(region.province)
                  ? 'uil:angle-up'
                  : 'uil:angle-down'
              "
              class="h-4 w-4"
            />
          </button>
        </div>

        <div
          v-if="
            isRegionExpanded(region.province) && region.districts.length > 0
          "
          class="flex flex-col gap-1.5 pl-2"
        >
          <div
            v-for="district in region.districts"
            :key="district.value"
            class="flex items-center gap-1.5 pr-8 cursor-pointer"
            @click="toggleDistrict(district.value)"
          >
            <Checkbox
              :checked="selectedDistrictsMap[district.value] || false"
            />
            <span class="flex-1 text-xs text-neutral-950">
              {{ district.label }}
            </span>
            <span class="text-xs text-[#717182]"
              >({{ getDistrictCount(district.value) }})</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { Checkbox } from "~/components/ui/checkbox";

  interface District {
    label: string;
    value: string;
  }

  interface GroupedRegion {
    province: string;
    districts: District[];
  }

  interface Props {
    groupedRegions: GroupedRegion[];
    selectedRegionsMap: Record<string, boolean>;
    selectedDistrictsMap: Record<string, boolean>;
    isLoading?: boolean;
    error?: Error | null;
    defaultExpanded?: boolean;
  }

  interface Emits {
    (e: "update:selectedRegionsMap", value: Record<string, boolean>): void;
    (e: "update:selectedDistrictsMap", value: Record<string, boolean>): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    error: null,
    defaultExpanded: true,
  });

  const emit = defineEmits<Emits>();

  const isExpanded = ref(props.defaultExpanded);
  const expandedRegions = ref<Record<string, boolean>>({});

  const checkedCount = computed(() => {
    return Object.values(props.selectedRegionsMap).filter(Boolean).length;
  });

  const getDistrictCount = (district: string) => {
    return 0;
  };

  const toggleRegion = (province: string) => {
    const newValue = !props.selectedRegionsMap[province];
    const newMap = {
      ...props.selectedRegionsMap,
      [province]: newValue,
    };
    emit("update:selectedRegionsMap", newMap);

    // If unchecking region, uncheck all its districts
    if (!newValue) {
      const region = props.groupedRegions.find((r) => r.province === province);
      if (region) {
        const updates: Record<string, boolean> = {};
        region.districts.forEach((d) => {
          updates[d.value] = false;
        });
        const newDistrictsMap = {
          ...props.selectedDistrictsMap,
          ...updates,
        };
        emit("update:selectedDistrictsMap", newDistrictsMap);
      }
    }
  };

  const toggleDistrict = (district: string) => {
    const newValue = !props.selectedDistrictsMap[district];
    const newMap = {
      ...props.selectedDistrictsMap,
      [district]: newValue,
    };
    emit("update:selectedDistrictsMap", newMap);

    // If checking district, also check its region
    if (newValue) {
      const region = props.groupedRegions.find((r) =>
        r.districts.some((d) => d.value === district)
      );
      if (region) {
        const newRegionsMap = {
          ...props.selectedRegionsMap,
          [region.province]: true,
        };
        emit("update:selectedRegionsMap", newRegionsMap);
      }
    }
  };

  const toggleRegionExpansion = (province: string) => {
    expandedRegions.value = {
      ...expandedRegions.value,
      [province]: !expandedRegions.value[province],
    };
  };

  const isRegionExpanded = (province: string) => {
    return expandedRegions.value[province] ?? false;
  };

  watch(
    () => props.defaultExpanded,
    (newValue) => {
      isExpanded.value = newValue;
    }
  );
</script>
