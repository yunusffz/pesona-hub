<template>
  <section>
    <img
      src="/assets/images/dashboard.avif"
      alt="Dashboard Hero"
      class="absolute inset-0 w-full h-full max-h-[356px] object-cover brightness-75"
    />

    <div
      class="absolute inset-0 bg-gradient-to-b max-h-[356px] from-black/10 via-black/30 to-black/40"
    ></div>
    <section class="relative px-24 mt-[94px]">
      <div class="relative flex flex-col 2xl:px-20 lg:px-20 gap-8">
        <div class="font-medium flex items-center gap-2 text-[#FFFFFFD9]">
          <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
          <Icon name="uil:angle-right" size="20" />
          <span>Dashboard</span>
        </div>
        <div class="text-white">
          <h1 class="font-semibold text-3xl mb-4">Dashboard</h1>
          <p>Pantau perkembangan program perhutanan sosial secara real-time.</p>
        </div>

        <div class="bg-white border border-[#E4E4E7] shadow-sm rounded-2xl">
          <div>
            <Tabs v-model="activeTab" default-value="supply" class="gap-0">
              <div
                class="flex items-center justify-between p-4 border-b border-[#E4E4E7]"
              >
                <TabsList :class="tabsListClass">
                  <TabsTrigger value="supply" class="rounded-xl">
                    Supply
                  </TabsTrigger>
                  <TabsTrigger v-if="isAdmin" value="demand" class="rounded-xl">
                    Demand
                  </TabsTrigger>
                  <TabsTrigger
                    v-if="isAdmin"
                    value="activity"
                    class="rounded-xl"
                  >
                    Activity Log
                  </TabsTrigger>
                </TabsList>
                <div class="flex items-center gap-2">
                  <DateRangePicker
                    v-if="activeTab === 'activity'"
                    v-model="dateRange"
                    :number-of-months="2"
                  />
                  <FilterSheet>
                    <SheetTrigger as-child>
                      <BaseButton variant="solid" class="px-4 py-2">
                        <Icon name="uil:filter" class="w-4 h-4" />
                        Filter
                      </BaseButton>
                    </SheetTrigger>
                  </FilterSheet>
                </div>
              </div>
              <TabsContent value="supply" class="p-8">
                <DashboardSupply />
              </TabsContent>
              <TabsContent v-if="isAdmin" value="demand" class="p-4">
                <DashboardDemand />
              </TabsContent>
              <TabsContent v-if="isAdmin" value="activity" class="p-4">
                <DashboardActivity
                  :start-date="startDate || undefined"
                  :end-date="endDate || undefined"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import DashboardSupply from "@/components/features/dashboard/dashboard-supply/DashboardSupply.vue";
  import DashboardDemand from "@/components/features/dashboard/dashboard-demand/DashboardDemand.vue";
  import DashboardActivity from "@/components/features/dashboard/dashboard-activity/DashboardActivity.vue";
  import FilterSheet from "@/components/features/dashboard/dashboard-supply/FilterSheet.vue";
  import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs";
  import { SheetTrigger } from "@/components/ui/sheet";
  import { useAuth } from "@/composables/useAuth";
  import DateRangePicker from "@/components/ui/date-range-picker/DateRangePicker.vue";

  const { user } = useAuth();
  const isAdmin = computed(() => user.value?.role === "ADMINISTRATOR");
  const tabsListClass = computed(() =>
    isAdmin.value
      ? "grid grid-cols-3 rounded-2xl w-[300px]"
      : "grid grid-cols-1 rounded-2xl w-[100px]"
  );

  const activeTab = ref<string>("supply");
  const startDate = ref<string>("");
  const endDate = ref<string>("");

  const dateRange = ref<any>(undefined);

  const formatDateOnly = (d?: Date): string => {
    if (!d) return "";
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${yr}-${mo}-${da}`;
  };

  const asJsDate = (val: any | undefined): Date | undefined => {
    if (!val) return undefined;
    // DateValue from @internationalized/date usually has year/month/day
    if (
      typeof val === "object" &&
      "year" in val &&
      "month" in val &&
      "day" in val
    ) {
      const year = (val as any).year as number;
      const month = (val as any).month as number;
      const day = (val as any).day as number;
      return new Date(year, month - 1, day);
    }
    if (val instanceof Date) return val;
    return undefined;
  };

  watch(
    dateRange,
    (val) => {
      if (!val) {
        startDate.value = "";
        endDate.value = "";
        return;
      }

      let fromVal: any | undefined;
      let toVal: any | undefined;

      if (Array.isArray(val)) {
        fromVal = val[0];
        toVal = val[1];
      } else if (val && typeof val === "object") {
        fromVal = (val as any).from ?? (val as any).start;
        toVal = (val as any).to ?? (val as any).end;
      }

      const startDateValue = formatDateOnly(asJsDate(fromVal));
      const endDateValue = formatDateOnly(asJsDate(toVal));

      startDate.value = startDateValue || "";
      endDate.value = endDateValue || "";

      console.log("Date Range Changed:", {
        fromVal,
        toVal,
        startDate: startDate.value,
        endDate: endDate.value,
      });
    },
    { deep: true }
  );
</script>
