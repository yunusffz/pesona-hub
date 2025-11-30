import { computed } from "vue";
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
      const provinceMatches = province.name.toLowerCase().includes(query);
      const matchedRegencies: any[] = [];

      province.regencies.forEach((regency) => {
        const regencyMatches = regency.name.toLowerCase().includes(query);
        const matchedDistricts = regency.districts.filter((district) =>
          district.toLowerCase().includes(query)
        );

        if (regencyMatches || matchedDistricts.length > 0) {
          matchedRegencies.push({
            name: regency.name,
            districts:
              matchedDistricts.length > 0
                ? matchedDistricts
                : regency.districts,
          });
        }
      });

      if (provinceMatches || matchedRegencies.length > 0) {
        filtered.push({
          name: province.name,
          regencies:
            matchedRegencies.length > 0 ? matchedRegencies : province.regencies,
        });

        // Auto-expand provinces with search results
        if (!expandedProvinces.value.includes(province.name)) {
          expandedProvinces.value.push(province.name);
        }

        // Auto-expand regencies with matching districts
        matchedRegencies.forEach((regency) => {
          const key = `${province.name}-${regency.name}`;
          if (!expandedRegencies.value.includes(key)) {
            expandedRegencies.value.push(key);
          }
        });
      }
    });

    return filtered;
  });

  return {
    filteredHierarchicalData,
  };
}
