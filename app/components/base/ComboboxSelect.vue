<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        :class="[
          'flex w-full items-center justify-between gap-2 rounded-2xl border border-transparent bg-[#f8faf8] px-3 h-9 text-sm text-[#1e1e1e] transition-colors hover:bg-[#f0f5f1] focus:outline-none focus:ring-1 focus:ring-[#035925]/30',
          !selectedLabel && 'text-[#717182]',
          props.class,
        ]"
      >
        <span class="truncate flex-1 text-left">{{ selectedLabel || placeholder }}</span>
        <ChevronsUpDown class="h-4 w-4 shrink-0 text-neutral-500" />
      </button>
    </PopoverTrigger>

    <PopoverContent class="p-0 w-[--radix-popover-trigger-width] shadow-md border border-neutral-200" align="start">
      <Command>
        <div class="p-2 border-b border-neutral-100">
          <CommandInput :placeholder="searchPlaceholder" class="h-8 text-sm" />
        </div>
        <CommandList class="max-h-[200px] overflow-y-auto">
          <CommandEmpty class="py-6 text-center text-sm text-[#717182]">
            Tidak ditemukan.
          </CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="opt in options"
              :key="String(opt.value)"
              :value="opt.label"
              class="cursor-pointer px-3 py-2 text-sm rounded-lg"
              @select="select(opt.value)"
            >
              <Check
                class="mr-2 h-4 w-4 shrink-0"
                :class="modelValue === opt.value ? 'opacity-100 text-[#035925]' : 'opacity-0'"
              />
              {{ opt.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import type { HTMLAttributes } from "vue";

interface Option {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options: Option[];
    placeholder?: string;
    searchPlaceholder?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    placeholder: "Pilih...",
    searchPlaceholder: "Cari...",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const open = ref(false);

const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? ""
);

const select = (value: string) => {
  emit("update:modelValue", value);
  open.value = false;
};
</script>
