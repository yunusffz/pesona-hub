<template>
  <div class="bg-white rounded-2xl border border-[#e7efea] shadow-lg w-[560px] max-h-[90vh] overflow-hidden">
    <div class="flex flex-col gap-5 p-6 overflow-y-auto max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-xl text-[#1e1e1e] tracking-tight">
          {{ product ? "Edit Produk" : "Tambah Produk Baru" }}
        </h2>
        <button
          type="button"
          class="rounded-lg p-1.5 text-[#6a7282] hover:bg-gray-100 hover:text-[#1e1e1e] transition-colors"
          @click="$emit('cancel')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Form Body -->
      <div class="flex flex-col gap-5">
        <!-- Image Upload -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]">
            Gambar Produk *
            <span class="text-[#6a7282] font-normal">(Max 5 gambar)</span>
          </label>
          <div class="flex items-center gap-2 flex-wrap">
            <ImageUploader
              v-for="i in 5"
              :key="i"
              v-model="images[i - 1]"
              label="Upload"
            />
          </div>
        </div>

        <!-- Nama Produk -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]"
            >Nama Produk *</label
          >
          <Input
            v-model="form.namaProduk"
            placeholder="Contoh: Pupuk Cair Organik KUPS Agroforestri Danau Raya"
            class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
          />
        </div>

        <!-- Deskripsi Produk -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]"
            >Deskripsi Produk *</label
          >
          <textarea
            v-model="form.deskripsi"
            placeholder="Masukkan deskripsi produk yang menarik..."
            rows="3"
            class="bg-[#f8faf8] rounded-2xl border-transparent px-3 py-2 text-sm text-[#1e1e1e] placeholder:text-[#717182] resize-none focus:outline-none focus:ring-1 focus:ring-[#035925]/30 w-full"
          />
        </div>

        <!-- Kategori & Kelas KUPS -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]">Kategori *</label>
            <BaseSelect
              v-model="form.kategori"
              placeholder="Pilih kategori"
              icon-type="chevron-down"
              background-color="bg-[#f8faf8]"
              class="rounded-2xl border-transparent h-9"
              :options="kategoriOptions"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]"
              >Kelas KUPS *</label
            >
            <BaseSelect
              v-model="form.kelasKups"
              placeholder="Pilih kelas"
              icon-type="chevron-down"
              background-color="bg-[#f8faf8]"
              class="rounded-2xl border-transparent h-9"
              :options="kelasKupsOptions"
            />
          </div>
        </div>

        <!-- Komoditas -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-[#1e1e1e]">Komoditas *</label>
          <ComboboxSelect
            v-model="form.commodityId"
            :options="commodityOptions"
            placeholder="Pilih komoditas"
            search-placeholder="Cari komoditas..."
          />
        </div>

        <!-- Nama KUPS & Wilayah -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]"
              >Nama KUPS *</label
            >
            <ComboboxSelect
              v-model="form.sfbgId"
              :options="sfbgOptions"
              placeholder="Pilih KUPS"
              search-placeholder="Cari KUPS..."
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
              v-model="form.satuan"
              placeholder="Contoh: kg, liter"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#1e1e1e]">Harga *</label>
            <Input
              v-model="form.harga"
              placeholder="Contoh: Rp 5.000"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-end gap-3 pt-1 border-t border-[#e5e7eb]"
      >
        <BaseButton
          variant="secondary"
          class="h-9 px-4 rounded-2xl text-sm border border-[#e7efea] text-[#1e1e1e]"
          @click="$emit('cancel')"
        >
          Batal
        </BaseButton>
        <BaseButton
          class="h-9 px-4 rounded-2xl text-sm bg-[#035925] hover:bg-[#024c20] text-white"
          :disabled="!isFormValid || isPending"
          @click="handleSubmit"
        >
          {{ isPending ? 'Menyimpan...' : 'Simpan' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseSelect from "~/components/base/BaseSelect.vue";
import ComboboxSelect from "~/components/base/ComboboxSelect.vue";
import ImageUploader from "~/components/base/ImageUploader.vue";
import { Input } from "~/components/ui/input";
import { X } from "lucide-vue-next";
import type { ProductWithRelations } from "~/types/product";
import { useCommodities } from "~/queries/useCommodities";
import { useSocialForestryBusinessGroups } from "~/queries/useSocialForestryBusinessGroups";
import { usePatchProduct } from "~/queries/useProducts";

const props = defineProps<{
  product?: ProductWithRelations | null;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [data: typeof form.value];
}>();

// Fetch options
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
    (g: any) => String(g.id) === form.value.sfbgId
  );
  return (found as any)?.location?.province ?? "";
});

const buildForm = (p?: ProductWithRelations | null) => ({
  kategori: p?.product_category ?? "",
  kelasKups: (p?.social_forestry_business_group as any)?.class_group ?? "",
  namaProduk: p?.name ?? "",
  deskripsi: p?.description ?? "",
  commodityId:
    (p as any)?.commodity?.id != null ? String((p as any).commodity.id) : "",
  sfbgId:
    p?.social_forestry_business_group?.id != null
      ? String(p.social_forestry_business_group.id)
      : "",
  varian: p?.product_usage ?? "",
  satuan: p?.unit ?? "",
  harga: p?.price != null ? String(p.price) : "",
});

const images = ref<(string | null)[]>(
  Array.from({ length: 5 }, (_, i) => {
    const t = props.product?.thumbnails?.[i];
    return typeof t === "string" ? t : null;
  })
);

const form = ref(buildForm(props.product));

watch(
  () => props.product,
  (p) => {
    form.value = buildForm(p);
    images.value = Array.from({ length: 5 }, (_, i) => {
      const t = p?.thumbnails?.[i];
      return typeof t === "string" ? t : null;
    });
  }
);

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

const isFormValid = computed(
  () =>
    !!form.value.kategori &&
    !!form.value.kelasKups &&
    !!form.value.namaProduk &&
    !!form.value.deskripsi &&
    !!form.value.commodityId &&
    !!form.value.sfbgId &&
    !!form.value.harga
);

const { mutateAsync: patchProduct, isPending } = usePatchProduct();

const handleSubmit = async () => {
  if (!isFormValid.value || !props.product?.id) return;

  await patchProduct({
    id: props.product.id,
    body: {
      name: form.value.namaProduk,
      description: form.value.deskripsi,
      product_category: form.value.kategori,
      product_usage: form.value.varian || null,
      price: form.value.harga ? Number(form.value.harga) : null,
      unit: form.value.satuan || null,
      commodity_id: Number(form.value.commodityId),
      social_forestry_business_group_id: Number(form.value.sfbgId),
      thumbnails: images.value.filter(Boolean) as string[],
    },
  });

  emit("submit", form.value);
};
</script>
