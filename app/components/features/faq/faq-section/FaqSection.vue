<template>
  <section
    class="relative 2xl:-mx-[calc((100vw-1536px)/2)] 2xl:px-[calc((100vw-1536px)/2)]"
  >
    <div class="bg-[#FAFAFA] absolute inset-0"></div>
    <div class="2xl:p-20 lg:py-20 lg:px-10 p-4 flex flex-col gap-[60px]">
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div class="flex flex-col gap-5">
          <FaqItem
            v-for="faq in leftColumnItems"
            :key="faq.question"
            :question="faq.question"
            :answer="faq.answer"
          />
        </div>
        <div class="flex flex-col gap-5">
          <FaqItem
            v-for="faq in rightColumnItems"
            :key="faq.question"
            :question="faq.question"
            :answer="faq.answer"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import { computed } from "vue";
  import FaqItem from "./FaqItem.vue";

  interface FaqItem {
    question: string;
    answer: string;
  }

  const faqItems: FaqItem[] = [
    {
      question: "Apa itu Pesona Hub Digi?",
      answer:
        "Pesona Hub Digi adalah platform digital yang dikelola oleh Kementerian Kehutanan untuk menghubungkan Kelompok Usaha Perhutanan Sosial (KUPS) dengan mitra bisnis, investor, dan program CSR guna memperkuat ekonomi hijau yang inklusif dan berkelanjutan.",
    },
    {
      question: "Siapa saja yang bisa bergabung di platform ini?",
      answer:
        "Siapa pun dapat menjelajahi katalog produk dan wisata secara bebas. Namun untuk melihat harga, kapasitas, atau kontak supplier, Anda perlu mendaftar dan login sebagai Mitra Terverifikasi.",
    },
    {
      question: "Bagaimana cara menjadi Mitra?",
      answer:
        "Klik tombol “Gabung Mitra” di pojok kanan atas halaman. Lengkapi data usaha atau organisasi Anda, lalu tunggu proses verifikasi. Setelah akun aktif, Anda dapat mengakses harga produk, kontak supplier, dan peluang kerja sama.",
    },
    {
      question: "Produk apa saja yang tersedia di Pesona Hub Digi?",
      answer:
        "Anda dapat menemukan beragam produk ramah lingkungan hasil hutan sosial seperti madu, kopi, pupuk organik, teh herbal, kerajinan kayu, hingga destinasi ekowisata berbasis masyarakat.",
    },
    {
      question: "Mengapa saya harus login untuk melihat harga produk?",
      answer:
        "Untuk menjaga privasi dan keadilan perdagangan antar mitra, informasi harga dan kontak supplier hanya ditampilkan kepada pengguna yang sudah terdaftar dan terverifikasi.",
    },
    {
      question: "Bagaimana Pesona Hub Digi menjamin kualitas produk?",
      answer:
        "Seluruh produk dan kelompok usaha yang terdaftar telah melalui proses verifikasi oleh Balai Perhutanan Sosial di wilayah masing-masing. Hal ini memastikan produk yang tampil sudah teruji kualitas dan asal usahanya.",
    },
    {
      question: "Bagaimana cara menghubungi supplier?",
      answer:
        "Setelah login, Anda dapat langsung menghubungi supplier melalui tombol WhatsApp atau Telepon yang tersedia di halaman produk. Nomor kontak telah diverifikasi untuk memastikan komunikasi yang aman dan terpercaya.",
    },
    {
      question: "Dari wilayah mana saja produk Pesona Hub Digi berasal?",
      answer:
        "Produk dan wisata di Pesona Hub Digi berasal dari seluruh Indonesia — mulai dari Sumatera, Jawa, Kalimantan, Sulawesi, hingga Papua. Setiap halaman produk menampilkan Wilayah Asal agar Anda tahu sumber dan potensi lokalnya.",
    },
  ];

  // Split FAQ items into two columns
  const leftColumnItems = computed<FaqItem[]>(() => {
    return faqItems.filter((_, index) => index % 2 === 0);
  });

  const rightColumnItems = computed<FaqItem[]>(() => {
    return faqItems.filter((_, index) => index % 2 === 1);
  });
</script>
