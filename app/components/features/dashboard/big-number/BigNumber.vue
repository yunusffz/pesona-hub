<template>
  <section
    class="p-6 bg-white rounded-2xl border border-[#E4E4E7] flex flex-col gap-3"
  >
    <div class="flex items-start justify-between">
      <div class="font-medium text-sm text-neutral-1000">{{ props.title }}</div>
      <Icon
        :name="props.icon || 'uil:user'"
        class="w-4 h-4 text-muted-foreground"
      />
    </div>
    <div v-if="props.loading" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-32 mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-24" v-if="props.description"></div>
    </div>
    <div v-else>
      <h1 class="font-bold text-2xl text-rich-black leading-tight">
        {{ props.number }}
        <span class="text-muted-foreground font-bold" v-if="props.unit">{{
          props.unit
        }}</span>
      </h1>
      <div class="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
        <div v-if="props.growth !== undefined" class="flex items-center gap-1">
          <Icon
            :name="
              props.growth >= 0 ? 'uil:arrow-up-right' : 'uil:arrow-down-left'
            "
            :class="[
              'w-3 h-3',
              props.growth >= 0 ? 'text-primary' : 'text-red-800',
            ]"
          />
          <span
            :class="[
              'font-medium',
              props.growth >= 0 ? 'text-primary' : 'text-red-800',
            ]"
          >
            {{ Math.abs(props.growth) }}%
          </span>
        </div>
        <span v-if="props.growth !== undefined && props.description">•</span>
        <span>{{ props.description }}</span>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  interface Props {
    number: string;
    title: string;
    unit?: string;
    description?: string;
    growth?: number;
    icon?: string;
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
  });
</script>
