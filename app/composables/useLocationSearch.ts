import { computed, watch } from "vue";
import type { Ref } from "vue";
import type { Province } from "./useLocationHierarchy";

export function useLocationSearch(
  hierarchicalData: Ref<Province[]>,
  searchQuery: Ref<string>,
  expandedProvinces: Ref<string[]>,
  expandedRegencies: Ref<string[]>
) {
  const filteredHierarchicalData = computed<Province[]>(() => {
    if (!searchQuery.value.trim()) {
      return hierarchicalData.value;
    }

    const query = searchQuery.value.toLowerCase();
    const filtered: Province[] = [];

    hierarchicalData.value.forEach((province) => {
      // Safety check for province name
      if (!province || !province.name) return;

      const provinceMatches = province.name.toLowerCase().includes(query);
      const matchedRegencies: any[] = [];

      province.regencies?.forEach((regency) => {
        // Safety check for regency name
        if (!regency || !regency.name) return;

        const regencyMatches = regency.name.toLowerCase().includes(query);
        const matchedDistricts = regency.districts?.filter((district) => {
          // Safety check for district name
          if (!district) return false;
          return district.toLowerCase().includes(query);
        }) || [];

        // Include regency if it matches OR has matching districts
        if (regencyMatches || matchedDistricts.length > 0) {
          matchedRegencies.push({
            name: regency.name,
            districts:
              matchedDistricts.length > 0
                ? matchedDistricts
                : regency.districts || [],
          });
        }
      });

      // Include province if it matches OR has matching regencies
      if (provinceMatches || matchedRegencies.length > 0) {
        filtered.push({
          name: province.name,
          regencies:
            matchedRegencies.length > 0 ? matchedRegencies : province.regencies || [],
        });
      }
    });

    return filtered;
  });

  // Watch for search changes and update expansion states
  watch(
    [searchQuery, filteredHierarchicalData],
    ([query, filtered]) => {
      if (!query.trim()) {
        // Clear expansion when search is empty
        expandedProvinces.value = [];
        expandedRegencies.value = [];
        return;
      }

      const newExpandedProvinces: string[] = [];
      const newExpandedRegencies: string[] = [];

      // Auto-expand all filtered provinces and regencies
      filtered.forEach((province) => {
        newExpandedProvinces.push(province.name);

        province.regencies.forEach((regency) => {
          const regencyKey = `${province.name}-${regency.name}`;
          newExpandedRegencies.push(regencyKey);
        });
      });

      expandedProvinces.value = newExpandedProvinces;
      expandedRegencies.value = newExpandedRegencies;
    },
    { immediate: true }
  );

  return {
    filteredHierarchicalData,
  };
}
