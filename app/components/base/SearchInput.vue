<template>
  <InputGroup
    v-model="searchQuery"
    :class="
      cn(
        'rounded-full border border-blur-10 focus-within:ring-0 transition-all text-md duration-200 bg-[#F9F9F933] backdrop-blur-[10px] h-[60px] w-[484px]',
        props.class
      )
    "
  >
    <InputGroupInput
      :placeholder="placeholder || 'Cari Produk atau Wisata...'"
      :class="
        cn(
          'text-neutral-1000 placeholder:text-neutral-1000 font-medium !text-md focus:outline-none text-base',
          props.class
        )
      "
      @input="handleInput"
      @keydown.enter="handleSearch"
    />
    <InputGroupAddon class="pl-5 cursor-pointer" @click="handleSearch">
      <SearchIcon :size="iconSize" :style="{ height: `${iconSize}px`, width: `${iconSize}px` }" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
  import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
  } from "../ui/input-group";
  import { SearchIcon } from "lucide-vue-next";
  import { cn } from "@/lib/utils";

  const props = withDefaults(
    defineProps<{
      placeholder?: string;
      onSearch?: (value: string) => void;
      class?: string;
      size?: "sm" | "md" | "lg";
    }>(),
    {
      size: "md",
    }
  );

  // Icon size mapping based on text size
  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const iconSize = computed(() => iconSizeMap[props.size]);

  const searchQuery = ref("");
  let searchTimeout: NodeJS.Timeout | null = null;

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    searchQuery.value = target.value;

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    searchTimeout = setTimeout(() => {
      if (props.onSearch) {
        props.onSearch(searchQuery.value);
      }
    }, 500); // 500ms debounce
  };

  const handleSearch = () => {
    // Clear timeout to prevent debounced search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Immediate search
    if (props.onSearch) {
      props.onSearch(searchQuery.value);
    }
  };

  // Cleanup timeout on unmount
  onUnmounted(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  });
</script>
