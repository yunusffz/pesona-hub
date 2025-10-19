<script setup lang="ts">
  import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { cn } from "@/lib/utils";

  interface TabItem {
    value: string;
    label: string;
  }

  interface Props {
    tabs: TabItem[];
    defaultValue?: string;
    className?: string;
    listClassName?: string;
    triggerClassName?: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: "update:value", value: string | number): void;
  }>();

  const activeValue = ref(props.defaultValue ?? props.tabs[0]?.value);

  function onChange(value: string | number) {
    activeValue.value = value as string;
    emit("update:value", value as string | number);
  }
</script>

<template>
  <Tabs
    v-model="activeValue"
    :class="cn('w-full', props.className)"
    @update:model-value="onChange"
  >
    <TabsList
      :class="
        cn(
          'inline-flex h-auto gap-2 rounded-full bg-transparent p-1',
          props.listClassName
        )
      "
    >
      <TabsTrigger
        v-for="tab in props.tabs"
        :key="tab.value"
        :value="tab.value"
        :class="
          cn(
            'rounded-full px-5 py-2 text-sm font-medium border border-gray-300 transition-colors',
            'data-[state=active]:bg-green-800 data-[state=active]:text-white data-[state=active]:border-green-800',
            'data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-gray-50',
            props.triggerClassName
          )
        "
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
