<template>
  <div class="flex flex-col gap-4">
    <div>
      <label class="text-sm text-neutral-900"
        >Bentuk Kerja Sama yang Diharapkan
        <span class="text-red-500">*</span></label
      >
      <p class="text-xs text-[#6B7280]">
        Pilih peran dan bentuk kolaborasi yang sesuai dengan kebutuhan Anda.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900"
        >Bentuk Kerja Sama</label
      >
      <p class="text-xs text-[#6B7280]">
        Pilih bentuk kolaborasi yang sesuai dengan kebutuhan Anda. Bisa lebih
        dari satu.
      </p>
      <MultiSelectCombobox
        :model-value="modelValue.collaborationType"
        @update:model-value="updateValue('collaborationType', $event)"
        :options="collaborationTypes"
        placeholder="Pilih bentuk kerja sama..."
        empty-text="Pilih bentuk kerja sama..."
        buttonClass="!py-2 !px-3 rounded-lg text-sm"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-neutral-900"
        >Catatan Tambahan (opsional)</label
      >
      <textarea
        :value="modelValue.additionalInfo"
        @change="
          updateValue(
            'additionalInfo',
            ($event.target as HTMLTextAreaElement).value
          )
        "
        rows="4"
        placeholder="Tuliskan catatan atau kebutuhan khusus..."
        class="border border-[#d9d9d9] rounded-lg px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none resize-none"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useCollaborations } from "~/queries/useCollaborations";
  import MultiSelectCombobox from "~/components/common/multi-select-combobox/MultiSelectComboBox.vue";
  import BaseSelect from "~/components/base/BaseSelect.vue";

  interface FormData {
    // Step 1 - Identity
    thumbnail: string | null;
    companyName: string;
    partnerLevel: string;
    whatsappNumber: string;
    websiteUrl: string;
    // Step 2 - Interests
    commodities: (string | number)[];
    // Step 3 - Collaboration
    collaborationType: string[];
    additionalInfo: string;
  }

  interface Props {
    modelValue: FormData;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    "update:modelValue": [value: FormData];
  }>();

  // Fetch collaborations from API
  const { data: collaborationsData, isLoading: isLoadingCollaborations } =
    useCollaborations();

  // Transform collaborations data to options format
  const collaborationTypes = computed(() => {
    const data =
      collaborationsData.value && "data" in collaborationsData.value
        ? collaborationsData.value.data
        : collaborationsData.value;

    if (!data) return [];

    // The rest of the logic will use `data`
    if (Array.isArray(data)) {
      return data.map((collab: any) => ({
        label: collab.name ?? String(collab.id ?? ""),
        value: collab.id ?? collab.name,
      }));
    }

    // Handle single object response
    if (data && typeof data === "object") {
      return [
        {
          label: (data as any).name ?? String((data as any).id ?? ""),
          value: (data as any).id ?? (data as any).name,
        },
      ];
    }

    return [];
  });

  const targetKupsClasses = [
    { label: "Bronze", value: "bronze" },
    { label: "Silver", value: "silver" },
    { label: "Gold", value: "gold" },
    { label: "Platinum", value: "platinum" },
  ];

  function updateValue(key: keyof FormData, value: any) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
  }
</script>
