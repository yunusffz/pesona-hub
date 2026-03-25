<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-semibold text-gray-900 text-lg">
      Peran Kolaborasi & Preferensi
    </h1>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900"
        >Bentuk Kerja Sama</label
      >
      <MultiSelectCombobox
        :model-value="form.collaborationType"
        @update:model-value="form.collaborationType = $event as string[]"
        :options="collaborationTypes"
        placeholder="Pilih bentuk kerja sama..."
        empty-text="Pilih bentuk kerja sama..."
        buttonClass="!bg-[#f8faf8] !text-[#717182] !rounded-2xl !border-transparent !py-2 !px-3 text-sm !font-normal"
        :chevron-directional="true"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900">
        Catatan Tambahan (opsional)
      </label>
      <textarea
        v-model="form.additionalInfo"
        rows="4"
        placeholder="Tuliskan catatan atau kebutuhan khusus..."
        class="border border-[#d9d9d9] rounded-lg px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none resize-none placeholder:text-[#717182] placeholder:font-normal"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
import { useCollaborations } from "~/queries/useCollaborations";
import type { ProfileFormData } from "~/components/features/cms/mitra/types";

const form = defineModel<ProfileFormData>({ required: true });

const { data: collaborationsData } = useCollaborations();

const collaborationTypes = computed(() => {
  const data =
    collaborationsData.value && "data" in collaborationsData.value
      ? collaborationsData.value.data
      : collaborationsData.value;

  if (!data || !Array.isArray(data)) return [];

  return data.map((c: any) => ({
    label: c.name ?? String(c.id ?? ""),
    value: String(c.id ?? c.name),
  }));
});
</script>
