<template>
  <button :class="cn(badgeVariants({ variant, size }), buttonClass)">
    <SvgIcon :name="icon" :class="cn('text-primary', iconClass)" size="18px" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
  import SvgIcon from "~/components/base/SvgIcon.vue";
  import { cn } from "~/lib/utils";
  import { cva, type VariantProps } from "class-variance-authority";

  const badgeVariants = cva(
    "flex items-center space-x-2 font-medium text-md px-3 py-1 border border-[#EBEBEB] rounded-full",
    {
      variants: {
        variant: {
          default: "",
          primary: "bg-primary text-white border-primary",
          secondary: "bg-secondary text-white border-secondary",
          outline: "border-gray-300 text-gray-700 hover:bg-gray-50",
          ghost: "border-transparent text-gray-600 hover:bg-gray-100",
          white: "bg-white",
        },
        size: {
          sm: "px-2 py-1 text-sm",
          default: "px-3 py-1 text-md",
          lg: "px-4 py-2 text-lg",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  );

  interface Props {
    label: string;
    icon: string;
    buttonClass?: string;
    iconClass?: string;
    variant?: VariantProps<typeof badgeVariants>["variant"];
    size?: VariantProps<typeof badgeVariants>["size"];
  }

  const props = withDefaults(defineProps<Props>(), {
    label: "",
    icon: "",
    buttonClass: "",
    iconClass: "",
    variant: "default",
    size: "default",
  });
</script>
