<template>
  <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-bold text-[#101828]">
          {{ isEdit ? "Edit FAQ" : "Tambah FAQ" }}
        </h2>
        <p class="text-sm text-[#6A7282] mt-0.5">
          {{ isEdit ? "Perbarui pertanyaan & jawaban" : "Tambahkan pertanyaan umum baru" }}
        </p>
      </div>
      <button
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        @click="emit('cancel')"
      >
        <X class="h-5 w-5 text-gray-400" />
      </button>
    </div>

    <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
      <!-- Question -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#344054]">
          Pertanyaan <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.question"
          placeholder="Tuliskan pertanyaan yang sering diajukan..."
          rows="3"
          class="w-full rounded-lg border border-[#D0D5DD] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition resize-none"
        />
        <p v-if="errors.question" class="text-xs text-red-500">{{ errors.question }}</p>
      </div>

      <!-- Answer -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#344054]">
          Jawaban <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.answer"
          placeholder="Tuliskan jawaban yang jelas dan informatif..."
          rows="5"
          class="w-full rounded-lg border border-[#D0D5DD] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#9DA4AE] focus:outline-none focus:ring-2 focus:ring-[#035925]/30 focus:border-[#035925] transition resize-none"
        />
        <p v-if="errors.answer" class="text-xs text-red-500">{{ errors.answer }}</p>
      </div>

      <!-- Active toggle -->
      <div class="flex items-center justify-between rounded-lg border border-[#E4E4E7] px-4 py-3">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-medium text-[#344054]">Tampilkan FAQ</span>
          <span class="text-xs text-[#6A7282]">FAQ akan muncul di halaman publik</span>
        </div>
        <button
          type="button"
          :class="[
            'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none',
            form.is_active ? 'bg-[#035925]' : 'bg-gray-200',
          ]"
          @click="form.is_active = !form.is_active"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200',
              form.is_active ? 'translate-x-5' : 'translate-x-0',
            ]"
          />
        </button>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-1">
        <button
          type="button"
          class="flex-1 h-10 rounded-full border border-[#D0D5DD] text-sm font-medium text-[#344054] hover:bg-gray-50 transition-colors"
          @click="emit('cancel')"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="flex-1 h-10 rounded-full bg-[#035925] text-sm font-medium text-white hover:bg-[#035925]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
          {{ isEdit ? "Simpan Perubahan" : "Tambah FAQ" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import { X, Loader2 } from "lucide-vue-next";
import type { FaqItem } from "~/queries/useFaq";

interface FaqFormData {
  question: string;
  answer: string;
  is_active: boolean;
}

interface Props {
  faq?: FaqItem | null;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  faq: null,
  submitting: false,
});

const emit = defineEmits<{
  cancel: [];
  submit: [data: FaqFormData];
}>();

const isEdit = computed(() => !!props.faq);

const form = reactive<FaqFormData>({
  question: "",
  answer: "",
  is_active: true,
});

const errors = reactive({ question: "", answer: "" });

const initForm = () => {
  if (props.faq) {
    form.question = props.faq.question;
    form.answer = props.faq.answer;
    form.is_active = props.faq.is_active;
  } else {
    form.question = "";
    form.answer = "";
    form.is_active = true;
  }
  errors.question = "";
  errors.answer = "";
};

watch(() => props.faq, initForm, { immediate: true });

const validate = (): boolean => {
  errors.question = "";
  errors.answer = "";
  let valid = true;
  if (!form.question.trim()) {
    errors.question = "Pertanyaan wajib diisi.";
    valid = false;
  }
  if (!form.answer.trim()) {
    errors.answer = "Jawaban wajib diisi.";
    valid = false;
  }
  return valid;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", { ...form });
};
</script>
