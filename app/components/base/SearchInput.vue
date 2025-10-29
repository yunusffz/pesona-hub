<template>
  <InputGroup
    v-model="searchQuery"
    class="rounded-full border border-blur-10 focus-within:ring-0 transition-all duration-200 bg-[#F9F9F933] backdrop-blur-[10px] h-[60px] w-[484px]"
  >
    <InputGroupInput
      :placeholder="placeholder || 'Cari Produk atau Wisata...'"
      class="text-neutral-1000 placeholder:text-neutral-1000 font-medium text-md focus:outline-none"
      @input="handleInput"
      @keydown.enter="handleSearch"
    />
    <InputGroupAddon
      class="pl-5 py-[18px] cursor-pointer"
      @click="handleSearch"
    >
      <SearchIcon />
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

  const props = defineProps<{
    placeholder?: string;
    onSearch?: (value: string) => void;
  }>();

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
