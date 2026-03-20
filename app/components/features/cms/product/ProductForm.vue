<template>
  <div class="flex flex-col gap-5">
    <!-- Image Upload -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-[#1e1e1e]">
        Gambar Produk *
        <span class="text-[#6a7282] font-normal">(Max 5 gambar)</span>
      </label>
      <div class="flex items-start gap-2 flex-wrap">
        <div v-for="i in 5" :key="i" class="relative w-[138px]">
          <ImageUploader
            :model-value="images[i - 1]"
            label="Upload Gambar"
            @update:model-value="updateImage(i - 1, $event)"
          />
          <!-- Gambar Utama badge -->
          <div
            v-if="i === 1"
            class="absolute top-[100px] left-0 right-0 z-10 pointer-events-none flex justify-center"
          >
            <span
              class="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full"
            >
              Gambar Utama
            </span>
          </div>
          <!-- Delete button -->
          <button
            v-if="images[i - 1]"
            class="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-lg bg-gray-100/90 text-red-500 hover:bg-red-100 transition-colors"
            @click.prevent="updateImage(i - 1, null)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Nama Produk -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-[#1e1e1e]">Nama Produk *</label>
      <Input
        :model-value="form.namaProduk"
        placeholder="Contoh: Pupuk Cair Organik KUPS Agroforestri Danau Raya"
        class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
        @update:model-value="update('namaProduk', $event)"
      />
    </div>

    <!-- Deskripsi Produk -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-[#1e1e1e]"
        >Deskripsi Produk *</label
      >
      <textarea
        :value="form.deskripsi"
        placeholder="Masukkan deskripsi produk yang menarik..."
        rows="3"
        class="bg-[#f8faf8] rounded-2xl border-transparent px-3 py-2 text-sm text-[#1e1e1e] placeholder:text-[#717182] resize-none focus:outline-none focus:ring-1 focus:ring-[#035925]/30 w-full"
        @input="
          update('deskripsi', ($event.target as HTMLTextAreaElement).value)
        "
      />
    </div>

    <!-- Kategori & Kelas KUPS -->
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]">Kategori *</label>
        <BaseSelect
          :model-value="form.kategori"
          placeholder="Pilih kategori"
          icon-type="chevron-down"
          background-color="bg-[#f8faf8]"
          class="rounded-2xl border-transparent h-9"
          :options="kategoriOptions"
          @update:model-value="update('kategori', $event)"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]">Kelas KUPS *</label>
        <BaseSelect
          :model-value="form.kelasKups"
          placeholder="Pilih kelas"
          icon-type="chevron-down"
          background-color="bg-[#f8faf8]"
          class="rounded-2xl border-transparent h-9"
          :options="kelasKupsOptions"
          @update:model-value="update('kelasKups', $event)"
        />
      </div>
    </div>

    <!-- Komoditas -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-[#1e1e1e]">Komoditas *</label>
      <ComboboxSelect
        :model-value="form.commodityId"
        :options="commodityOptions"
        placeholder="Pilih komoditas"
        search-placeholder="Cari komoditas..."
        @update:model-value="update('commodityId', $event)"
      />
    </div>

    <!-- Nama KUPS & Wilayah -->
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]">Nama KUPS *</label>
        <ComboboxSelect
          :model-value="form.sfbgId"
          :options="sfbgOptions"
          placeholder="Pilih KUPS"
          search-placeholder="Cari KUPS..."
          @update:model-value="update('sfbgId', $event)"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]">Wilayah</label>
        <Input
          :model-value="wilayah"
          disabled
          placeholder="-"
          class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm text-[#1e1e1e] opacity-60"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]">Satuan</label>
        <Input
          :model-value="form.satuan"
          placeholder="Contoh: kg, liter"
          class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
          @update:model-value="update('satuan', $event)"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1e1e1e]">Harga *</label>
        <Input
          :model-value="form.harga"
          placeholder="Contoh: Rp 5.000"
          class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
          @update:model-value="update('harga', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Trash2 } from "lucide-vue-next";
import BaseSelect from "~/components/base/BaseSelect.vue";
import ComboboxSelect from "~/components/base/ComboboxSelect.vue";
import ImageUploader from "~/components/base/ImageUploader.vue";
import { Input } from "~/components/ui/input";
import { useCommodities } from "~/queries/useCommodities";
import { useSocialForestryBusinessGroups } from "~/queries/useSocialForestryBusinessGroups";

export interface ProductFormData {
  kategori: string;
  kelasKups: string;
  namaProduk: string;
  deskripsi: string;
  commodityId: string;
  sfbgId: string;
  varian: string;
  satuan: string;
  harga: string;
}

const props = defineProps<{
  form: ProductFormData;
  images: (string | null)[];
}>();

const emit = defineEmits<{
  "update:form": [value: ProductFormData];
  "update:images": [value: (string | null)[]];
}>();

const update = (key: keyof ProductFormData, value: unknown) => {
  emit("update:form", {
    ...props.form,
    [key]: value != null ? String(value) : "",
  });
};

const updateImage = (index: number, value: string | null) => {
  const updated = [...props.images];
  updated[index] = value;
  emit("update:images", updated);
};

const { data: commoditiesData } = useCommodities({ fields: ["id", "name"] });
const { data: sfbgData } = useSocialForestryBusinessGroups({
  populate: ["location"],
  fields: ["id", "name"],
});

const commodityOptions = computed(() => {
  const list = (commoditiesData.value as any)?.data ?? [];
  return list.map((c: any) => ({ label: c.name, value: String(c.id) }));
});

const sfbgList = computed<any[]>(() => (sfbgData.value as any)?.data ?? []);

const sfbgOptions = computed(() =>
  sfbgList.value.map((g: any) => ({ label: g.name, value: String(g.id) }))
);

const wilayah = computed(() => {
  const found = sfbgList.value.find(
    (g: any) => String(g.id) === props.form.sfbgId
  );
  return (found as any)?.location?.province ?? "";
});

const kategoriOptions = [
  { label: "Produk", value: "PRODUK" },
  { label: "Ekowisata", value: "EKOWISATA" },
];

const kelasKupsOptions = [
  { label: "Blue", value: "BLUE" },
  { label: "Silver", value: "SILVER" },
  { label: "Gold", value: "GOLD" },
  { label: "Platinum", value: "PLATINUM" },
];
</script>
