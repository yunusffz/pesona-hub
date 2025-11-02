<template>
  <section>
    <NuxtImg
      src="/assets/images/dashboard.png"
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
            <Tabs default-value="supply" class="gap-0">
              <div
                class="flex items-center justify-between p-4 border-b border-[#E4E4E7]"
              >
                <TabsList class="grid grid-cols-3 rounded-2xl w-[300px]">
                  <TabsTrigger value="supply" class="rounded-xl">
                    Supply
                  </TabsTrigger>
                  <TabsTrigger value="demand" class="rounded-xl">
                    Demand
                  </TabsTrigger>
                  <TabsTrigger value="monitoring" class="rounded-xl">
                    Monitoring
                  </TabsTrigger>
                </TabsList>
                <div>
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
              <TabsContent value="demand" class="p-4">
                Change your password here.
              </TabsContent>
              <TabsContent value="monitoring" class="p-4">
                Change your password here.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
  import DashboardSupply from "@/components/features/dashboard/dashboard-supply/DashboardSupply.vue";
  import FilterSheet from "@/components/features/dashboard/dashboard-supply/FilterSheet.vue";
  import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs";
  import { SheetTrigger } from "@/components/ui/sheet";
</script>
