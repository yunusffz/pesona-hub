<template>
  <div class="w-full" v-if="isMounted">
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
            v-if="props.icon"
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
        <Command class="bg-white">
          <div class="p-2">
            <CommandInput :placeholder="placeholder" />
          </div>

          <CommandList :class="['bg-white', listClass]">
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup v-if="isMounted">
              <template v-for="opt in options" :key="String(opt.value)">
                <CommandItem
                  :value="opt.value"
                  :disabled="
                    opt.disabled || (maxReached && !isSelected(opt.value))
                  "
                  class="cursor-pointer bg-white hover:bg-neutral-50"
                  @select.prevent="toggle(opt.value, opt.disabled)"
                >
                  <div class="me-2 flex items-center">
                    <Check
                      class="h-4 w-4 transition-opacity"
                      :class="
                        isSelected(opt.value) ? 'opacity-100' : 'opacity-0'
                      "
                    />
                  </div>
                  <span class="truncate flex-1">{{ opt.label }}</span>

                  <span
                    v-if="max > 0 && !isSelected(opt.value) && maxReached"
                    class="text-xs text-muted-foreground ms-2"
                  >
                    max
                  </span>
                </CommandItem>
              </template>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup v-if="isMounted">
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
        v-if="max && selectedOptions.length"
      >
        <div>{{ selectedOptions.length }}/{{ max }} item dipilih</div>
        <button type="button" class="cursor-pointer" @click="clearAll">
          Hapus Semua
        </button>
      </div>
      <div
        v-if="showBadges && selectedOptions.length"
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

  // shadcn-vue components (generated into your project by shadcn-vue)
  // adjust the import alias if your paths differ
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
      /** ✅ Optional icon name */
      icon?: string;
      /** ✅ Optional icon size */
      iconSize?: string;
    }>(),
    {
      placeholder: "Search…",
      emptyText: "Select items",
      max: 0,
      disabled: false,
      showBadges: true,
      icon: "", // default: no icon
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

  onMounted(() => {
    isMounted.value = true;
  });

  watch(
    () => props.modelValue,
    (v) => {
      // keep internal in sync if parent changes it
      internal.value = [...v];
    }
  );

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
</script>
