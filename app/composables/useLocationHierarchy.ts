import { computed } from "vue";
import type { Ref } from "vue";

export interface Province {
  name: string;
  regencies: Regency[];
}

export interface Regency {
  name: string;
  districts: string[];
}

interface RawLocationData {
  district: string;
  regency: string;
  province: string;
}

export function useLocationHierarchy(
  data: Ref<any>
) {
  const hierarchicalData = computed<Province[]>(() => {
    if (!data.value?.data || !Array.isArray(data.value.data)) return [];

    const locationData = data.value.data as RawLocationData[];
    const provinceMap = new Map<string, Map<string, Set<string>>>();

    // Build hierarchy
    locationData.forEach((location) => {
      // Skip if any location field is empty or null
      if (!location.province || !location.regency || !location.district) {
        return;
      }

      if (!provinceMap.has(location.province)) {
        provinceMap.set(location.province, new Map());
      }

      const regencyMap = provinceMap.get(location.province)!;
      if (!regencyMap.has(location.regency)) {
        regencyMap.set(location.regency, new Set());
      }

      regencyMap.get(location.regency)!.add(location.district);
    });

    // Convert to array structure
    const provinces: Province[] = [];
    provinceMap.forEach((regencyMap, provinceName) => {
      const regencies: Regency[] = [];
      regencyMap.forEach((districtSet, regencyName) => {
        regencies.push({
          name: regencyName,
          districts: Array.from(districtSet).sort(),
        });
      });

      provinces.push({
        name: provinceName,
        regencies: regencies.sort((a, b) => a.name.localeCompare(b.name)),
      });
    });

    return provinces.sort((a, b) => a.name.localeCompare(b.name));
  });

  return {
    hierarchicalData,
  };
}
