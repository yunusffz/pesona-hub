<template>
  <div
    class="bg-white rounded-2xl border border-[#e7efea] shadow-lg w-[560px] max-h-[90vh] overflow-hidden"
  >
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

      <!-- Form -->
      <ProductForm v-model:form="form" v-model:images="images" />

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
          {{ isPending ? "Menyimpan..." : product ? "Simpan" : "Tambah" }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import ProductForm from "~/components/features/cms/product/ProductForm.vue";
import type { ProductFormData } from "~/components/features/cms/product/ProductForm.vue";
import { X } from "lucide-vue-next";
import type { ProductWithRelations } from "~/types/product";
import { usePatchProduct, usePostProduct } from "~/queries/useProducts";

const props = defineProps<{
  product?: ProductWithRelations | null;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [];
}>();

const buildForm = (p?: ProductWithRelations | null): ProductFormData => ({
  kategori: p?.product_category ?? "",
  kelasKups: (p?.social_forestry_business_group as any)?.class_group ?? "",
  namaProduk: p?.name ?? "",
  deskripsi: p?.description ?? "",
  commodityId: (p as any)?.commodity?.id != null ? String((p as any).commodity.id) : "",
  sfbgId: p?.social_forestry_business_group?.id != null ? String(p.social_forestry_business_group.id) : "",
  varian: p?.product_usage ?? "",
  satuan: p?.unit ?? "",
  harga: p?.price != null ? String(p.price) : "",
});

const form = ref<ProductFormData>(buildForm(props.product));
const images = ref<(string | null)[]>(
  Array.from({ length: 5 }, (_, i) => {
    const t = props.product?.thumbnails?.[i];
    return typeof t === "string" ? t : null;
  })
);

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

const { mutateAsync: patchProduct, isPending: isPatchPending } = usePatchProduct();
const { mutateAsync: postProduct, isPending: isPostPending } = usePostProduct();

const isPending = computed(() => isPatchPending.value || isPostPending.value);

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  const body = {
    name: form.value.namaProduk,
    description: form.value.deskripsi,
    product_category: form.value.kategori,
    product_usage: form.value.varian || null,
    price: form.value.harga ? Number(form.value.harga) : null,
    unit: form.value.satuan || null,
    commodity_id: Number(form.value.commodityId),
    social_forestry_business_group_id: Number(form.value.sfbgId),
    thumbnails: images.value.filter(Boolean) as string[],
    status: "ACTIVE",
    is_highlight: false,
  };

  if (props.product?.id) {
    await patchProduct({ id: props.product.id, body });
  } else {
    await postProduct(body);
  }

  emit("submit");
};
</script>
