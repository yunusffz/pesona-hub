<template>
  <div class="w-full" v-show="isMounted">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          :disabled="disabled"
          variant="outline"
          :class="[
            'w-full items-center gap-2.5 justify-between font-medium rounded-lg h-9 px-3 border border-[#d9d9d9] shadow-none text-sm text-[#6B7280]',
            buttonClass,
            disabled ? 'opacity-70 cursor-not-allowed' : '',
          ]"
        >
          <SvgIcon
            v-show="props.icon"
            :name="props.icon"
            :size="props.iconSize"
          />
          <span class="flex-1 block truncate text-left leading-none">
            {{ buttonLabel }}
          </span>
          <ChevronsUpDown class="ms-2 !h-4 !w-4 shrink-0 text-neutral-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        class="p-0 w-[--radix-popover-trigger-width] bg-white border border-neutral-200 shadow-md"
        align="start"
      >
        <Command class="bg-white" :filter-function="filterFunction">
          <div class="p-2">
            <CommandInput :placeholder="placeholder" v-model="searchQuery" />
          </div>

          <CommandList class="bg-white overflow-y-hidden h-[350px]">
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup class="pt-[rem]">
              <div
                ref="scrollContainer"
                class="overflow-auto"
                style="max-height: 235px"
                @scroll="handleScroll"
              >
                <div
                  :style="{ height: `${totalHeight}px`, position: 'relative' }"
                >
                  <template
                    v-for="item in visibleItems"
                    :key="String(item.value)"
                  >
                    <CommandItem
                      :value="item.value"
                      :disabled="
                        item.disabled || (maxReached && !isSelected(item.value))
                      "
                      :style="{
                        position: 'absolute',
                        top: `${item.offsetTop}px`,
                        left: 0,
                        right: 0,
                        height: `${itemHeight}px`,
                      }"
                      class="cursor-pointer bg-white hover:bg-neutral-50"
                      @select.prevent="toggle(item.value, item.disabled)"
                    >
                      <div class="me-2 flex items-center">
                        <Check
                          class="h-4 w-4 transition-opacity"
                          :class="
                            isSelected(item.value) ? 'opacity-100' : 'opacity-0'
                          "
                        />
                      </div>
                      <span class="truncate flex-1">{{ item.label }}</span>

                      <span
                        v-show="
                          max > 0 && !isSelected(item.value) && maxReached
                        "
                        class="text-xs text-muted-foreground ms-2"
                      >
                        max
                      </span>
                    </CommandItem>
                  </template>
                </div>
              </div>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup>
              <CommandItem
                value=""
                :disabled="internal.length === 0"
                class="bg-white hover:bg-neutral-50"
                @select.prevent="clearAll()"
              >
                <X class="h-4 w-4 me-2" />
                Clear selection
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>

      <!-- Selected badges -->
      <div
        class="flex justify-between text-[10.5px] mt-2 text-[#6B7280]"
        v-show="max && selectedOptions.length"
      >
        <div>{{ selectedOptions.length }}/{{ max }} item dipilih</div>
        <button type="button" class="cursor-pointer" @click="clearAll">
          Hapus Semua
        </button>
      </div>
      <div
        v-show="showBadges && selectedOptions.length"
        class="mt-2 flex flex-wrap gap-2"
      >
        <Badge
          v-for="opt in selectedOptions"
          :key="String(opt.value)"
          variant="secondary"
          class="items-center gap-1 bg-[#174C361A] border border-[#174C3633] text-[#174C36] text-[10.5px] font-medium rounded-[8.5px] py-[6.25px] pr-[6.25px] pl-[11.5px]"
        >
          <span class="truncate max-w-[180px]">{{ opt.label }}</span>
          <button
            type="button"
            class="ms-1 inline-flex items-center outline-none"
            @click="remove(opt.value)"
          >
            <X class="h-[10.5px] w-[10.5px]" />
          </button>
        </Badge>
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onMounted } from "vue";
  import { Check, X, ChevronsUpDown } from "lucide-vue-next";
  import SvgIcon from "~/components/base/SvgIcon.vue";

  // shadcn-vue components
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover";

  import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
  } from "@/components/ui/command";

  type Option = {
    label: string;
    value: string | number;
    disabled?: boolean;
  };

  const props = withDefaults(
    defineProps<{
      modelValue: (string | number)[];
      options: Option[];
      placeholder?: string;
      emptyText?: string;
      max?: number;
      disabled?: boolean;
      showBadges?: boolean;
      buttonClass?: string;
      listClass?: string;
      icon?: string;
      iconSize?: string;
    }>(),
    {
      placeholder: "Search…",
      emptyText: "Select items",
      max: 0,
      disabled: false,
      showBadges: true,
      icon: "",
      iconSize: "24px",
    }
  );

  const emit = defineEmits<{
    (e: "update:modelValue", value: (string | number)[]): void;
    (e: "change", value: (string | number)[]): void;
  }>();

  const open = ref(false);
  const internal = ref<(string | number)[]>([...props.modelValue]);
  const isMounted = ref(false);
  const searchQuery = ref("");
  const scrollTop = ref(0);
  const scrollContainer = ref<HTMLElement | null>(null);

  // Virtual scroll settings
  const itemHeight = 36; // Height of each item in pixels
  const containerHeight = 300; // Max height of scrollable area
  const bufferSize = 3; // Number of extra items to render above/below viewport

  onMounted(() => {
    isMounted.value = true;
  });

  watch(
    () => props.modelValue,
    (v) => {
      internal.value = [...v];
    }
  );

  // Filter options based on search query
  const filteredOptions = computed(() => {
    if (!searchQuery.value) return props.options;
    const query = searchQuery.value.toLowerCase();
    return props.options.filter((opt) =>
      opt.label.toLowerCase().includes(query)
    );
  });

  // Calculate total height for virtual scroll
  const totalHeight = computed(() => filteredOptions.value.length * itemHeight);

  // Calculate which items should be visible based on scroll position
  const visibleItems = computed(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop.value / itemHeight) - bufferSize
    );
    const endIndex = Math.min(
      filteredOptions.value.length,
      Math.ceil((scrollTop.value + containerHeight) / itemHeight) + bufferSize
    );

    return filteredOptions.value
      .slice(startIndex, endIndex)
      .map((item, index) => ({
        ...item,
        offsetTop: (startIndex + index) * itemHeight,
      }));
  });

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  }

  function isSelected(val: string | number) {
    return internal.value.includes(val);
  }

  const maxReached = computed(
    () => props.max > 0 && internal.value.length >= props.max
  );

  function toggle(val: string | number, disabled?: boolean) {
    if (disabled) return;
    if (!isSelected(val)) {
      if (maxReached.value) return;
      internal.value = [...internal.value, val];
    } else {
      internal.value = internal.value.filter((x) => x !== val);
    }
    emit("update:modelValue", internal.value);
    emit("change", internal.value);
  }

  function remove(val: string | number) {
    if (!isSelected(val)) return;
    internal.value = internal.value.filter((x) => x !== val);
    emit("update:modelValue", internal.value);
    emit("change", internal.value);
  }

  function clearAll() {
    if (!internal.value.length) return;
    internal.value = [];
    emit("update:modelValue", internal.value);
    emit("change", internal.value);
  }

  const selectedOptions = computed<Option[]>(() =>
    props.options.filter((o) => internal.value.includes(o.value))
  );

  const buttonLabel = computed(() => {
    const count = internal.value.length;
    if (count === 0) return props.emptyText;
    if (count === 1) {
      const one = props.options.find((o) => o.value === internal.value[0]);
      return one?.label ?? props.emptyText;
    }
    return `${count} item dipilih`;
  });

  // Custom filter function for Command component to disable built-in filtering
  const filterFunction = () => {
    return 1; // Return 1 to show all items (we handle filtering manually)
  };
</script>
