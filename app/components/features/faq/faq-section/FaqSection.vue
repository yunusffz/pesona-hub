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
import { useFaqs } from "~/queries/useFaq";

const { data: faqsData } = useFaqs();

const activeFaqs = computed(() =>
  [...(faqsData.value ?? [])]
    .filter((f) => f.is_active)
    .sort((a, b) => a.order - b.order)
);

const leftColumnItems = computed(() =>
  activeFaqs.value.filter((_, i) => i % 2 === 0)
);

const rightColumnItems = computed(() =>
  activeFaqs.value.filter((_, i) => i % 2 === 1)
);
</script>
