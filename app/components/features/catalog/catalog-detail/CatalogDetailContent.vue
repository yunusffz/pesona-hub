<template>
  <section class="flex flex-col lg:flex-row gap-6 lg:gap-[60px]">
    <ProductImageGallery :images="productImages" />
    <div
      class="flex flex-col gap-6 w-full lg:w-[468px] lg:h-[648px] lg:overflow-y-auto"
    >
      <div class="flex flex-col gap-4" v-if="product?.name">
        <h1
          class="text-2xl md:text-3xl lg:text-[40px] font-medium leading-tight lg:leading-[48px]"
        >
          {{ toTitleCase(product?.name) || "Nama Produk" }}
        </h1>
        <div class="flex items-center gap-2">
          <Badge
            variant="grey"
            class="text-xs font-medium py-1.5 px-3 border border-neutral-200"
            v-if="product?.product_usage"
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
            <span class="font-semibold text-xl md:text-2xl">
              {{ formatRupiah(productPrice) }}
            </span>
            <span class="font-semibold text-base md:text-lg text-neutral-700"
              >/{{ props.product?.unit }}</span
            >
          </div>
          <div class="flex flex-col gap-4">
            <div
              class="font-semibold text-base md:text-[18px] text-neutral-900"
            >
              Tambah ke Keranjang
            </div>
            <QuantityCounter
              :model-value="quantity"
              @update:model-value="quantity = $event"
            />
            <div
              class="flex items-center justify-between bg-[#F3F3F3] px-3 py-4 rounded-xl"
            >
              <span
                class="font-medium text-base md:text-[18px] text-neutral-900"
                >Total</span
              >
              <span class="font-bold text-xl md:text-2xl">{{
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
            class="absolute bottom-0 left-0 w-full h-full flex items-center justify-center px-4"
          >
            <div
              class="flex flex-col items-center justify-center w-full max-w-[350px]"
            >
              <div class="h-[100px] w-[120px] md:h-[130px] md:w-[150px]">
                <SvgIcon
                  name="lock"
                  preserveOriginalColors
                  size="150px"
                  class="w-full h-full"
                />
              </div>
              <p
                class="text-sm font-medium text-neutral-700 text-center leading-6"
              >
                Harga dan kontak supplier hanya tersedia untuk Mitra Terdaftar.
                Login atau buat akun untuk mengakses informasi lengkap produk
                ini.
              </p>
              <NuxtLink to="/login">
                <BaseButton
                  variant="primary"
                  class="mt-8 md:mt-12 w-full md:w-auto"
                >
                  Login Sekarang
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Profile Complete Dialog -->
  <ProfileCompleteDialog
    v-model:open="showConfirmDialog"
    description="Untuk mengajukan kerjasama, Anda perlu melengkapi profil organisasi dan informasi kebutuhan Anda terlebih dahulu."
    @confirm="confirmQuoteRequest"
  />
</template>

<script setup lang="ts">
import QuantityCounter from "~/components/base/QuantityCounter.vue";
import CatalogDetailInfo from "./CatalogDetailInfo.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import { formatRupiah } from "~/utils/format-number";
import type { ExtendedProduct } from "~/types/product";
import SvgIcon from "~/components/base/SvgIcon.vue";
import { useAuth } from "~/composables/useAuth";
import { useApi } from "~/composables/useApi";
import RankBadges from "~/components/base/RankBadges.vue";
import { useProductActivityLogger } from "~/composables/useProductActivityLogger";
import { canUserCollaborate } from "~/utils/user-profile";
import ProfileCompleteDialog from "~/components/common/ProfileCompleteDialog.vue";
import ProductImageGallery from "./ProductImageGallery.vue";

const { isAuthenticated, user: authUser } = useAuth();
const { logProductCollaboration } = useProductActivityLogger();
const client = useApi();
const { toTitleCase } = useTitleCase();

interface Props {
  product?: ExtendedProduct;
}

const props = defineProps<Props>();

const quantity = ref(1);
const selectedVariant = ref<"default">("default");
const showConfirmDialog = ref(false);
const userWithDetails = ref<any>(null);

// Computed property for product images
const productImages = computed(() => {
  if (
    props.product?.thumbnails &&
    Array.isArray(props.product.thumbnails) &&
    props.product.thumbnails.length > 0
  ) {
    // Map thumbnails to image objects with url property
    return props.product.thumbnails.map((thumbnail: any, index: number) => ({
      url: thumbnail || "/assets/images/product-1.png",
      alt: `${props.product?.name || "Product"} - Image ${index + 1}`,
    }));
  }

  // Return multiple mock images if no thumbnails available (for testing)
  return [
    {
      url: "/assets/images/product-1.png",
      alt: `${props.product?.name || "Product"} - Image 1`,
    },
    {
      url: "/assets/images/product-2.png",
      alt: `${props.product?.name || "Product"} - Image 2`,
    },
    {
      url: "/assets/images/product-3.png",
      alt: `${props.product?.name || "Product"} - Image 3`,
    },
  ];
});

// Computed property for product price
const productPrice = computed(() => {
  return props.product?.price || 0;
});

// Computed property for product unit
const productUnit = computed(() => {
  return props.product?.unit || "unit";
});

const handleCollaborationRequest = async () => {
  // Fetch fresh user data with details populated
  try {
    const { data, error } = await client.GET("/me", {
      params: {
        query: {
          "populate[0]": "details",
        },
      },
    });

    if (error) {
      console.error("Failed to fetch user data:", error);
      alert("Gagal memuat data profil. Silakan coba lagi.");
      return;
    }

    // Extract user data from response
    if (data && typeof data === "object" && "data" in data) {
      userWithDetails.value = (data as any).data;
    } else {
      userWithDetails.value = data;
    }

    // Check if user profile is complete
    if (!canUserCollaborate(userWithDetails.value)) {
      // Show dialog to complete profile
      showConfirmDialog.value = true;
      return;
    }

    // Profile is complete, proceed with WhatsApp request
    handleQuoteRequest();
  } catch (error) {
    console.error("Error checking user profile:", error);
    alert("Terjadi kesalahan. Silakan coba lagi.");
  }
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
