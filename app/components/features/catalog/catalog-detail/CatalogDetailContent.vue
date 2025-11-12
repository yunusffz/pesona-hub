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
          <Badge
            variant="grey"
            class="text-xs font-medium py-1.5 px-3 border border-neutral-200"
          >
            {{ product?.product_usage || "Kategori" }}
          </Badge>
          <RankBadges
            v-if="product?.social_forestry_business_group?.class_group"
            :rank="product?.social_forestry_business_group?.class_group as 'silver' | 'gold' | 'platinum'"
            class="bg-[#F4F4F4] border border-neutral-200"
          />
        </div>
        <p class="text-md text-[#585858] leading-6">
          {{ product?.description || "Deskripsi produk tidak tersedia." }}
        </p>
      </div>
      <div class="relative min-h-[500px]">
        <div v-if="isAuthenticated" class="flex flex-col gap-4">
          <div class="flex items-end gap-1">
            <span class="font-semibold text-2xl">
              {{ formatRupiah(productPrice) }}
            </span>
            <span class="font-semibold text-lg text-neutral-700"
              >/{{ props.product?.unit }}</span
            >
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
              <span class="font-medium text-[18px] text-neutral-900"
                >Total</span
              >
              <span class="font-bold text-2xl">{{
                formatRupiah(quantity * productPrice)
              }}</span>
            </div>
            <div className="bg-[#f4f9f6] relative rounded-[12px] size-full">
              <div
                aria-hidden="true"
                className="absolute border border-[#024c26] border-solid inset-0 pointer-events-none rounded-[12px]"
              />
              <div className="flex flex-row items-center size-full">
                <div
                  className="box-border content-stretch flex gap-[16px] items-center px-[12px] py-[16px] relative size-full"
                >
                  <Icon
                    name="bi:info-circle-fill"
                    class="text-primary fill-primary"
                    size="20px"
                  />
                  <div
                    className="basis-0 flex flex-col font-medium grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-neutral-900 text-sm tracking-[-0.28px]"
                  >
                    <p className="leading-[21px]">
                      Jalin kerjasama lebih lanjut dengan mengklik tombol
                      dibawah
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <BaseButton @click="handleCollaborationRequest"
              >Ajukan Kerjasama</BaseButton
            >
            <hr />
            <CatalogDetailInfo :product="product" />
          </div>
        </div>

        <div v-else>
          <NuxtImg
            src="/assets/images/blur-detail.png"
            alt="Blur Detail"
            class="absolute bottom-0 left-0 top-20 w-full h-[400px] object-cover blur-2xl overflow-hidden"
          />
          <div
            class="absolute bottom-0 left-0 w-full h-full flex items-center justify-center"
          >
            <div class="flex flex-col items-center justify-center w-[350px]">
              <div class="h-[130px] w-[150px]">
                <SvgIcon name="lock" preserveOriginalColors size="150px" />
              </div>
              <p
                class="text-sm font-medium text-neutral-700 text-center leading-6"
              >
                Harga dan kontak supplier hanya tersedia untuk Mitra Terdaftar.
                Login atau buat akun untuk mengakses informasi lengkap produk
                ini.
              </p>
              <NuxtLink to="/login">
                <BaseButton variant="primary" class="mt-12">
                  Login Sekarang
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Confirmation Dialog -->
  <Dialog
    :open="showConfirmDialog"
    @update:open="(value) => (showConfirmDialog = value)"
  >
    <DialogContent class="max-w-md py-4 px-4 rounded-xl w-[444px]">
      <DialogHeader>
        <div class="flex flex-col gap-2 justify-center items-center mb-4">
          <div class="rounded-full bg-[#FEF3C6] p-3 mb-6">
            <CircleAlert class="w-6 h-6 text-[#E17100]"></CircleAlert>
          </div>
          <span class="font-semibold text-[18px] text-neutral-1000 text-center">
            Lengkapi Data Profil Terlebih Dahulu
          </span>
          <p class="text-[#717182] text-center text-sm">
            Untuk mengajukan kerjasama, Anda perlu melengkapi profil organisasi
            dan informasi kebutuhan Anda terlebih dahulu.
          </p>
        </div>
      </DialogHeader>
      <DialogFooter class="gap-2 flex !justify-center text-center items-center">
        <BaseButton
          variant="secondary"
          @click="showConfirmDialog = false"
          size="sm"
        >
          Nanti Saja
        </BaseButton>
        <a href="/profil">
          <BaseButton variant="primary" @click="confirmQuoteRequest" size="sm"
            >Lengkapi Data Sekarang
          </BaseButton>
        </a>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import QuantityCounter from "~/components/base/QuantityCounter.vue";
  import CatalogDetailInfo from "./CatalogDetailInfo.vue";
  import BaseButton from "~/components/base/BaseButton.vue";
  import { formatRupiah } from "~/utils/format-number";
  import type { ProductWithRelations } from "~/types/product";
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import { useAuth } from "~/composables/useAuth";
  import RankBadges from "~/components/base/RankBadges.vue";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { useProductActivityLogger } from "~/composables/useProductActivityLogger";
  import { canUserCollaborate } from "~/utils/user-profile";

  const { isAuthenticated, user } = useAuth();
  const { logProductCollaboration } = useProductActivityLogger();

  interface Props {
    product?: ProductWithRelations & {
      social_forestry_business_group?: {
        contact?: {
          chief_contact: string;
        };
      };
    };
  }

  const props = defineProps<Props>();

  const quantity = ref(1);
  const selectedVariant = ref<"default">("default");
  const showConfirmDialog = ref(false);

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

  const handleCollaborationRequest = () => {
    // Check if user profile is complete
    if (!canUserCollaborate(user.value)) {
      // Show dialog to complete profile
      showConfirmDialog.value = true;
      return;
    }

    // Profile is complete, proceed with WhatsApp request
    handleQuoteRequest();
  };

  const confirmQuoteRequest = () => {
    showConfirmDialog.value = false;
    // Navigate to profile completion page
    navigateTo("/profil");
  };

  const handleQuoteRequest = () => {
    if (!props.product) return;

    const productName = props.product.name || "Produk";
    const unitPrice = productPrice.value;
    const totalPrice = quantity.value * unitPrice;

    // Log collaboration request using the new composable
    logProductCollaboration(props.product, quantity.value, {
      accessType: "public",
      message: "WhatsApp collaboration request",
    });

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
    const whatsappNumber =
      props.product?.social_forestry_business_group?.contact?.chief_contact;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");
  };
</script>
