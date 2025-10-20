<template>
  <section class="2xl:px-20 lg:px-10">
    <div class="flex gap-5">
      <div class="flex flex-col gap-[224px] justify-between">
        <div>
          <IconBadge label="Mengapa Kami Hadir" icon="plant" variant="white" />
        </div>
        <!-- <img src="/assets/images/us-1.png" /> -->
        <NuxtImg
          src="/assets/images/us-1.png"
          alt="Hero banner"
          class="rounded-[10px] h-[616px]"
        />
      </div>
      <div class="flex-1 flex flex-col justify-between">
        <div class="flex flex-col gap-5 max-w-[530px]">
          <h1 class="text-[40px] font-medium leading-[48px]">
            Lebih dari sekadar platform — kami adalah mitra tumbuh yang
            berkelanjutan.
          </h1>
          <p class="leading-6 text-md text-[#585858]">
            Pesona Hub Digi menghubungkan potensi masyarakat hutan dengan
            peluang ekonomi global. Kami percaya setiap kolaborasi dapat membawa
            dampak nyata bagi lingkungan dan kehidupan sosial.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-5 h-[616px]">
          <div class="flex flex-col gap-5">
            <UsCard
              :title="cards[0].title"
              v-if="cards[0]"
              :description="cards[0].description"
              :imageSrc="cards[0].imageSrc"
              :imageAlt="cards[0].imageAlt"
              :variant="cards[0].variant"
            />
            <UsCard
              :title="cards[1].title"
              v-if="cards[1]"
              :description="cards[1].description"
              :imageSrc="cards[1].imageSrc"
              :imageAlt="cards[1].imageAlt"
              :variant="cards[1].variant"
            />
          </div>
          <div class="flex flex-col gap-5">
            <UsCard
              :title="cards[2].title"
              v-if="cards[2]"
              :description="cards[2].description"
              :imageSrc="cards[2].imageSrc"
              :imageAlt="cards[2].imageAlt"
              :variant="cards[2].variant"
            />
            <UsCard
              :title="cards[3].title"
              v-if="cards[3]"
              :description="cards[3].description"
              :imageSrc="cards[3].imageSrc"
              :imageAlt="cards[3].imageAlt"
              :variant="cards[3].variant"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import IconBadge from "~/components/base/IconBadge.vue";
  import UsCard from "./UsCard.vue";

  interface UsCard {
    variant: "default" | "primary" | "secondary" | "accent";
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
  }

  const cards: UsCard[] = [
    {
      variant: "default",
      title: "Inovasi Efektif",
      description:
        "Kami menghadirkan solusi digital yang mempermudah promosi, distribusi, dan kolaborasi antar mitra Perhutanan sosial.",
      imageSrc: "/assets/images/about-1.png",
      imageAlt: "About 1",
    },
    {
      variant: "primary",
      title: "Dipercaya Banyak Pihak",
      description:
        "Didukung oleh KEMENTRIAN PERHUTANAN, Balai PS, dan mitra CSR di seluruh Indonesia — Pesona Hub Digi menjadi ruang kolaborasi yang kredibel dan aman.",
      imageSrc: "/assets/images/about-2.png",
      imageAlt: "About 2",
    },
    {
      variant: "secondary",
      title: "Praktik Berkelanjutan",
      description:
        "Setiap langkah kami mendukung pengelolaan hutan lestari dan ekonomi hijau di tingkat lokal.",
      imageSrc: "/assets/images/about-3.png",
      imageAlt: "About 3",
    },
    {
      variant: "default",
      title: "Keahlian Global, Akar Lokal",
      description:
        "Kami membawa pendekatan profesional dan teknologi terkini dengan semangat gotong royong masyarakat hutan.",
      imageSrc: "/assets/images/about-4.png",
      imageAlt: "About 4",
    },
  ];
</script>
