<template>
  <div class="bg-white rounded-2xl border border-[#e7efea] shadow-lg w-[510px]">
    <div class="flex flex-col gap-4 p-6">
      <!-- Header -->
      <h2 class="font-semibold text-xl text-[#1e1e1e] tracking-tight">
        Tambah Produk Baru
      </h2>

      <!-- Form Body -->
      <div class="flex flex-col gap-6 pt-2">
        <!-- Image Upload -->
        <div class="flex flex-col gap-3">
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

        <!-- Komoditas, Wilayah, Nama KUPS -->
        <div class="flex gap-4">
          <div class="flex flex-col gap-2 w-[143px] shrink-0">
            <label class="text-sm font-medium text-[#1e1e1e]"
              >Komoditas *</label
            >
            <Input
              v-model="form.komoditas"
              placeholder="Kayu"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 flex-1">
            <label class="text-sm font-medium text-[#1e1e1e]">Wilayah *</label>
            <Input
              v-model="form.wilayah"
              placeholder="Contoh: LPHN Limo Koto"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 flex-1">
            <label class="text-sm font-medium text-[#1e1e1e]"
              >Nama KUPS *</label
            >
            <Input
              v-model="form.namaKups"
              placeholder="Contoh: KUPS Danau Raya"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
            />
          </div>
        </div>

        <!-- Varian, Satuan, Harga -->
        <div class="flex gap-4">
          <div class="flex flex-col gap-2 w-[143px] shrink-0">
            <label class="text-sm font-medium text-[#1e1e1e]">Varian</label>
            <Input
              v-model="form.varian"
              placeholder="Contoh: Botol, Sachet"
              class="bg-[#f8faf8] rounded-2xl border-transparent h-9 text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 w-[143px] shrink-0">
            <label class="text-sm font-medium text-[#1e1e1e]">Satuan</label>
            <BaseSelect
              v-model="form.satuan"
              placeholder="Pilih satuan"
              icon-type="chevron-down"
              background-color="bg-[#f8faf8]"
              class="rounded-2xl border-transparent h-9"
              :options="satuanOptions"
            />
          </div>
          <div class="flex flex-col gap-2 flex-1">
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
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Simpan
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseSelect from "~/components/base/BaseSelect.vue";
import ImageUploader from "~/components/base/ImageUploader.vue";
import { Input } from "~/components/ui/input";

const emit = defineEmits<{
  cancel: [];
  submit: [data: typeof form.value];
}>();

const images = ref<(string | null)[]>([null, null, null, null, null]);

const form = ref({
  kategori: "",
  kelasKups: "",
  namaProduk: "",
  deskripsi: "",
  komoditas: "",
  wilayah: "",
  namaKups: "",
  varian: "",
  satuan: "",
  harga: "",
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

const satuanOptions = [
  { label: "Kg", value: "kg" },
  { label: "Liter", value: "liter" },
  { label: "Pcs", value: "pcs" },
  { label: "Botol", value: "botol" },
  { label: "Sachet", value: "sachet" },
];

const isFormValid = computed(
  () =>
    !!form.value.kategori &&
    !!form.value.kelasKups &&
    !!form.value.namaProduk &&
    !!form.value.deskripsi &&
    !!form.value.komoditas &&
    !!form.value.wilayah &&
    !!form.value.namaKups &&
    !!form.value.harga
);

const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit("submit", form.value);
};
</script>
