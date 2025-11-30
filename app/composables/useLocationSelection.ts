import { ref } from "vue";
import type { Ref } from "vue";
import type { LocationFilter } from "~/stores/useCatalogStore";
import type { Province } from "./useLocationHierarchy";

export function useLocationSelection(
  hierarchicalData: Ref<Province[]>,
  expandedProvinces: Ref<string[]>,
  expandedRegencies: Ref<string[]>,
  onUpdate: (selections: LocationFilter[]) => void
) {
  const selected = ref<LocationFilter[]>([]);

  const isSelected = (value: string, type: LocationFilter["type"]): boolean => {
    return selected.value.some(
      (item) => item.value === value && item.type === type
    );
  };

  const toggleSelection = (
    value: string,
    type: LocationFilter["type"],
    provinceName?: string
  ) => {
    const index = selected.value.findIndex(
      (item) => item.value === value && item.type === type
    );

    if (index > -1) {
      selected.value.splice(index, 1);

      // Collapse children when deselecting parent
      if (type === "province") {
        const provinceIndex = expandedProvinces.value.indexOf(value);
        if (provinceIndex > -1) {
          expandedProvinces.value.splice(provinceIndex, 1);
        }
      } else if (type === "regency") {
        const provinceForRegency =
          provinceName ||
          hierarchicalData.value.find((p) =>
            p.regencies.some((r) => r.name === value)
          )?.name;

        if (provinceForRegency) {
          const key = `${provinceForRegency}-${value}`;
          const regencyIndex = expandedRegencies.value.indexOf(key);
          if (regencyIndex > -1) {
            expandedRegencies.value.splice(regencyIndex, 1);
          }
        }
      }
    } else {
      selected.value.push({ value, type });

      // Auto-expand children when selecting parent
      if (type === "province" && !expandedProvinces.value.includes(value)) {
        expandedProvinces.value.push(value);
      } else if (type === "regency") {
        const provinceForRegency =
          provinceName ||
          hierarchicalData.value.find((p) =>
            p.regencies.some((r) => r.name === value)
          )?.name;

        if (provinceForRegency) {
          const key = `${provinceForRegency}-${value}`;
          if (!expandedRegencies.value.includes(key)) {
            expandedRegencies.value.push(key);
          }
        }
      }
    }

    onUpdate([...selected.value]);
  };

  const removeSelection = (index: number) => {
    selected.value.splice(index, 1);
    onUpdate([...selected.value]);
  };

  return {
    selected,
    isSelected,
    toggleSelection,
    removeSelection,
  };
}
