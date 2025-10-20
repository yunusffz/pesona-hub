<template>
  <div class="flex items-center gap-2">
    <span class="font-medium text-md text-neutral-900"> Jumlah: </span>

    <button
      @click="decrement"
      :disabled="modelValue <= min"
      class="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Decrease quantity"
    >
      <Icon name="uil:minus" class="w-4 h-4 text-gray-600" />
    </button>

    <input
      :value="modelValue"
      type="number"
      :min="min"
      :max="max"
      @input="handleInput"
      class="w-20 h-8 text-center border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />

    <button
      @click="increment"
      class="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Increase quantity"
    >
      <Icon name="uil:plus" class="w-4 h-4 text-gray-600" />
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: number;
    min?: number;
    max?: number;
  }

  interface Emits {
    "update:modelValue": [value: number];
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: 1,
    min: 1,
    max: undefined,
  });

  const emit = defineEmits<Emits>();

  const decrement = () => {
    if (props.modelValue > props.min) {
      emit("update:modelValue", props.modelValue - 1);
    }
  };

  const increment = () => {
    const newValue = props.modelValue + 1;
    if (!props.max || newValue <= props.max) {
      emit("update:modelValue", newValue);
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value);

    if (isNaN(value) || value < props.min) {
      emit("update:modelValue", props.min);
    } else if (props.max && value > props.max) {
      emit("update:modelValue", props.max);
    } else {
      emit("update:modelValue", value);
    }
  };
</script>

<style scoped>
  /* Remove number input arrows */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
