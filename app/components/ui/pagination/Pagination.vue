<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <!-- Items per page -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Baris per halaman</span>
        <select
          v-if="isItemsPerPage"
          :value="itemsPerPage"
          @change="handleItemsPerPageChange"
          class="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>

      <!-- Page info -->
      <div class="text-sm text-gray-600">
        Halaman {{ currentPage }} of {{ totalPages }}
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center gap-1">
        <button
          @click="goToFirstPage"
          :disabled="currentPage === 1"
          class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to first page"
        >
          <Icon name="uil:angle-double-left" class="w-5 h-5" />
        </button>
        <button
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to previous page"
        >
          <Icon name="uil:angle-left" class="w-5 h-5" />
        </button>
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to next page"
        >
          <Icon name="uil:angle-right" class="w-5 h-5" />
        </button>
        <button
          @click="goToLastPage"
          :disabled="currentPage === totalPages"
          class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to last page"
        >
          <Icon name="uil:angle-double-right" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    startItem: number;
    isItemsPerPage?: boolean;
  }

  interface Emits {
    "update:currentPage": [page: number];
    "update:itemsPerPage": [itemsPerPage: number];
  }

  const props = withDefaults(defineProps<Props>(), {
    isItemsPerPage: true,
  });
  const emit = defineEmits<Emits>();

  const goToFirstPage = () => {
    if (props.currentPage > 1) {
      emit("update:currentPage", 1);
    }
  };

  const goToPreviousPage = () => {
    if (props.currentPage > 1) {
      emit("update:currentPage", props.currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (props.currentPage < props.totalPages) {
      emit("update:currentPage", props.currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (props.currentPage < props.totalPages) {
      emit("update:currentPage", props.totalPages);
    }
  };

  const handleItemsPerPageChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit("update:itemsPerPage", parseInt(target.value));
  };
</script>
