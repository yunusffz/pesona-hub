<template>
  <section class="flex gap-[60px]">
    <div class="rounded-3xl flex-1">
      <NuxtImg
        src="/assets/images/product-1.png"
        alt="Catalog Detail 1"
        class="w-full h-full object-cover rounded-3xl max-h-[579px]"
      />
    </div>
    <div class="flex flex-col gap-6 w-[468px] h-[648px] overflow-y-auto">
      <div class="flex flex-col gap-4">
        <h1 class="text-[40px] font-medium leading-[48px]">
          Pupuk Cair Organik KUPS Agroforestri Danau Raya
        </h1>
        <div class="flex items-center gap-2">
          <Badge variant="grey" class="text-xs font-medium"
            >Pupuk Organik</Badge
          >
        </div>
        <p class="text-md text-[#585858] leading-6">
          Berikan yang terbaik untuk tanaman Anda dengan pupuk ramah lingkungan
          dari Nagari Danau Raya.
        </p>
      </div>
      <div class="flex flex-col gap-4 p-2">
        <div class="text-[18px] font-semibold text-neutral-900">
          Pilih varian
        </div>
        <div class="flex gap-2.5">
          <Button
            variant="outline"
            :class="[
              '!px-6 !py-[15px] border-2 rounded-xl inline-flex flex-col gap-1 h-auto',
              selectedVariant === 'bottle'
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 hover:border-neutral-400',
            ]"
            @click="selectedVariant = 'bottle'"
          >
            <span class="font-medium text-[13px]">Botol 500ml</span>
            <span class="font-semibold text-md">Rp. 50.000</span>
          </Button>

          <Button
            variant="outline"
            :class="[
              '!px-6 !py-[15px] border-2 rounded-xl inline-flex flex-col gap-1 h-auto',
              selectedVariant === 'sachet'
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 hover:border-neutral-400',
            ]"
            @click="selectedVariant = 'sachet'"
          >
            <span class="font-medium text-[13px]">Madu sachet 12ml</span>
            <span class="font-semibold text-md">Rp. 6.000</span>
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
            <span class="font-bold text-2xl"
              >Rp.
              {{
                quantity * (selectedVariant === "bottle" ? 50000 : 6000)
              }}</span
            >
          </div>
          <BaseButton @click="handleQuoteRequest">Ajukan Penawaran</BaseButton>
          <hr />
          <CatalogDetailInfo />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import QuantityCounter from "~/components/base/QuantityCounter.vue";
  import CatalogDetailInfo from "./CatalogDetailInfo.vue";
  import BaseButton from "~/components/base/BaseButton.vue";

  const quantity = ref(1);
  const selectedVariant = ref<"bottle" | "sachet">("bottle");

  const handleQuoteRequest = () => {
    const productName = "Pupuk Cair Organik KUPS Agroforestri Danau Raya";
    const variantName =
      selectedVariant.value === "bottle" ? "Botol 500ml" : "Madu sachet 12ml";
    const unitPrice = selectedVariant.value === "bottle" ? 50000 : 6000;
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
• Varian: ${variantName}
• Jumlah: ${quantity.value} ${
      selectedVariant.value === "bottle" ? "botol" : "sachet"
    }
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
