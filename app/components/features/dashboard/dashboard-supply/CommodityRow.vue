<template>
  <div class="border-b border-[#E4E4E7] last:border-b-0">
    <!-- Main Row -->
    <div
      class="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
      @click="toggleExpanded"
    >
      <!-- Expand Icon -->
      <div class="w-6 flex items-center justify-center">
        <ChevronRight
          :size="16"
          class="transition-transform duration-200"
          :class="{ 'rotate-90': isExpanded }"
        />
      </div>

      <!-- Commodity Icon & Name -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="w-9 h-9 flex-shrink-0">
          <SvgIcon :name="commodityIcon" preserveOriginalColors size="36px" />
        </div>
        <span class="font-medium text-sm text-neutral-900 truncate">
          {{ commodity.commodity }}
        </span>
      </div>

      <!-- Products Count -->
      <div class="w-24 text-center">
        <span class="text-sm text-neutral-900">
          {{ commodity.total_products }} Produk
        </span>
      </div>

      <!-- Units -->
      <div class="w-32 text-center truncate text-ellipsis overflow-hidden">
        <span class="text-sm text-neutral-600">
          {{ formattedUnits }}
        </span>
      </div>

      <!-- KUPS Count -->
      <div class="w-24 text-center">
        <span class="text-sm text-neutral-900">
          {{ commodity.total_sfbg }} KUPS
        </span>
      </div>
    </div>

    <!-- Expanded Details -->
    <Transition
      name="expand"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div v-if="isExpanded" class="overflow-hidden">
        <div class="bg-[#F7FFF7] px-4 py-3 ml-6 mr-4 mb-2">
          <!-- Header Row for Details -->
          <div
            class="grid grid-cols-3 gap-4 pb-2 border-b border-[#E4E4E7] mb-2"
          >
            <div class="text-xs font-semibold text-neutral-600 text-center">
              Kapasitas
            </div>
            <div class="text-xs font-semibold text-neutral-600 text-center">
              Satuan
            </div>
            <div class="text-xs font-semibold text-neutral-600 text-center">
              Jumlah KUPS
            </div>
          </div>

          <!-- Detail Rows -->
          <div
            v-for="(detail, index) in commodity.unit_details"
            :key="index"
            class="grid grid-cols-3 gap-4 py-2 border-b border-[#E4E4E7] last:border-b-0"
          >
            <div class="text-sm text-neutral-900 text-center font-medium">
              {{ formatNumber(detail.capacity) }}
            </div>
            <div class="text-sm text-neutral-600 text-center truncate">
              {{ detail.unit }}
            </div>
            <div class="text-sm text-neutral-900 text-center">
              {{ detail.sfbg_count }} KUPS
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { ChevronRight } from "lucide-vue-next";
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import { getCommodityIcon } from "~/utils/commodity-icons";
  import type { components } from "~/types/pesona-hub-api";

  type CommodityDetailedPriorityResponse =
    components["schemas"]["CommodityDetailedPriorityResponse"];

  interface Props {
    commodity: CommodityDetailedPriorityResponse;
  }

  const props = defineProps<Props>();

  const isExpanded = ref(false);

  const commodityIcon = computed(() =>
    getCommodityIcon(props.commodity.commodity)
  );

  const formattedUnits = computed(() => {
    return props.commodity.units.join(", ");
  });

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Animation handlers
  const onEnter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = "0";
  };

  const onAfterEnter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = "auto";
  };

  const onLeave = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = element.scrollHeight + "px";
    // Force reflow
    element.offsetHeight;
    element.style.height = "0";
  };
</script>

<style scoped>
  .expand-enter-active,
  .expand-leave-active {
    transition: height 0.3s ease;
    overflow: hidden;
  }

  .expand-enter-from,
  .expand-leave-to {
    height: 0;
  }
</style>
