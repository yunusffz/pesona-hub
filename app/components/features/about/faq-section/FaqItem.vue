<template>
  <Collapsible class="bg-white rounded-[10px] p-4">
    <CollapsibleTrigger
      class="flex items-center justify-between w-full"
      @click="toggleOpen"
    >
      <div class="text-xl font-semibold pb-2">{{ question }}</div>
      <Icon
        :name="isOpen ? 'uil:minus' : 'uil:plus'"
        size="24px"
        class="transition-all duration-200"
      />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="text-md text-[#585858] border-t border-[#EBEBEB] py-6 px-4">
        {{ answer }}
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  import { Collapsible } from "~/components/ui/collapsible";
  import { CollapsibleTrigger } from "~/components/ui/collapsible";
  import { CollapsibleContent } from "~/components/ui/collapsible";

  interface Props {
    question: string;
    answer: string;
  }

  const props = defineProps<Props>();

  const isOpen = ref(false);

  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };
</script>
