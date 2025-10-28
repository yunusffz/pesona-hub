<template>
  <section class="flex gap-[60px]">
    <div class="rounded-3xl flex-1">
      <NuxtImg
        :src="productImage"
        :alt="product?.name || 'Product Image'"
        class="w-full h-full object-cover rounded-3xl max-h-[579px]"
      />
    </div>
    <div class="flex flex-col gap-6 w-[468px] h-[648px] overflow-y-auto">
      <div class="flex flex-col gap-4">
        <h1 class="text-[40px] font-medium leading-[48px]">
          {{ product?.name || "Nama Produk" }}
        </h1>
        <div class="flex items-center gap-2">
          <Badge variant="grey" class="text-xs font-medium">
            {{ product?.product_usage || "Kategori" }}
          </Badge>
        </div>
        <p class="text-md text-[#585858] leading-6">
          {{ product?.description || "Deskripsi produk tidak tersedia." }}
        </p>
      </div>
      <div class="flex flex-col gap-4 p-2">
        <div class="flex gap-2.5">
          <Button
            variant="outline"
            :class="[
              '!px-6 !py-[15px] border-2 rounded-xl inline-flex flex-col gap-1 h-auto',
              selectedVariant === 'default'
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 hover:border-neutral-400',
            ]"
            @click="selectedVariant = 'default'"
          >
            <span class="font-medium text-[13px]">{{
              props.product?.unit
            }}</span>
            <span class="font-semibold text-md">{{
              formatRupiah(productPrice)
            }}</span>
          </Button>
        </div>
        <div class="flex flex-col gap-4">
          <div class="font-semibold text-[18px] text-neutral-900">
            Tambah ke Keranjang
          </div>
          <QuantityCounter
            :model-value="quantity"
            @update:model-value="quantity = $event"
          />
          <div
            class="flex items-center justify-between bg-[#F3F3F3] px-3 py-4 rounded-xl"
          >
            <span class="font-medium text-[18px] text-neutral-900">Total</span>
            <span class="font-bold text-2xl">{{
              formatRupiah(quantity * productPrice)
            }}</span>
          </div>
          <BaseButton @click="handleQuoteRequest">Ajukan Penawaran</BaseButton>
          <hr />
          <CatalogDetailInfo :product="product" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
    import QuantityCounter from "~/components/base/QuantityCounter.vue";
    import CatalogDetailInfo from "./CatalogDetailInfo.vue";
    import BaseButton from "~/components/base/BaseButton.vue";
    import { formatRupiah } from "~/utils/format-number";
    import type { ProductWithRelations } from "~/types/product";

    interface Props {
      product?: ProductWithRelations

    const props = defineProps<Props>();

    const quantity = ref(1);
    const selectedVariant = ref<"default">("default");

    // Computed property for product image
    const productImage = computed(() => {
      if (
        props.product?.thumbnails &&
        Array.isArray(props.product.thumbnails) &&
        props.product.thumbnails.length > 0
      ) {
        // Assuming thumbnails is an array of image objects with url property
        const firstImage = props.product.thumbnails[0] as any;
        return firstImage?.url || "/assets/images/product-1.png";
      }
      return "/assets/images/product-1.png";
    });

    // Computed property for product price
    const productPrice = computed(() => {
      return props.product?.price || 0;
    });

    // Computed property for product unit
    const productUnit = computed(() => {
      return props.product?.unit || "unit";
    });

    const handleQuoteRequest = () => {
      const productName = props.product?.name || "Produk";
      const unitPrice =
        selectedVariant.value === "default"
          ? productPrice.value
          : productPrice.value;
      const totalPrice = quantity.value * unitPrice;

      // Format price with thousand separators
      const formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(totalPrice);

      const message = `Halo, saya tertarik dengan produk:

  • *${productName}*
  • Varian: ${productName}
  • Jumlah: ${quantity.value} ${productUnit.value}
  • Total Harga: ${formattedPrice}

  Mohon informasi lebih lanjut mengenai produk ini. Terima kasih!`;

      // WhatsApp number (dummy number for demo)
      const whatsappNumber = "<number-whatsapp-xxxx>";
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank");
    };
</script>
