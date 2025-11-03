<template>
  <div class="flex flex-col gap-4">
    <div>
      <label class="text-sm font-medium"
        >Bentuk Kerja Sama yang Diharapkan</label
      >
      <p class="text-xs text-[#6B7280]">
        Pilih peran dan bentuk kolaborasi yang sesuai dengan kebutuhan Anda.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">Bentuk Kerja Sama</label>
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
        icon="tags"
        icon-size="24px"
        buttonClass="!py-2 !px-3 rounded-lg text-sm"
      />
    </div>

    <div>
      <label class="text-sm font-medium">Kelas KUPS Target</label>
      <select
        :value="modelValue.targetKupsClass"
        @change="
          updateValue(
            'targetKupsClass',
            ($event.target as HTMLSelectElement).value
          )
        "
        class="border border-[#d9d9d9] rounded-lg h-9 px-3 py-2 w-full text-sm bg-white focus-within:ring-2 focus-within:ring-primary focus:outline-none"
      >
        <option value="">Pilih kelas KUPS target</option>
        <option value="bronze">Bronze</option>
        <option value="silver">Silver</option>
        <option value="gold">Gold</option>
        <option value="platinum">Platinum</option>
      </select>
    </div>
    <div>
      <label class="text-sm font-medium">Catatan Tambahan (opsional)</label>
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

  interface FormData {
    companyName: string;
    partnerLevel: string;
    whatsappNumber: string;
    websiteUrl: string;
    interests: string[];
    focusArea: string;
    expertise: string;
    collaborationType: string[];
    availability: string;
    additionalInfo: string;
    commodities: (string | number)[];
    productionEstimate: string;
    productionUnit: string;
    materialType: string;
    targetKupsClass?: string;
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

  function updateValue(key: keyof FormData, value: any) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
  }
</script>
