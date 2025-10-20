<template>
  <InputGroup
    class="rounded-full border border-blur-10 focus-within:ring-0 transition-all duration-200 bg-[#F9F9F933] backdrop-blur-[10px] h-[60px] w-[484px]"
  >
    <InputGroupInput
      placeholder="Cari Produk atau Wisata..."
      class="text-neutral-1000 placeholder:text-neutral-1000 font-medium text-md focus:outline-none"
    />
    <InputGroupAddon class="pl-5 py-[18px]">
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
</script>
