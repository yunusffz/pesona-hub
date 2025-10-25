<template>
  <button :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </button>
</template>

<script setup lang="ts">
  import type { VariantProps } from "class-variance-authority";
  import { cva } from "class-variance-authority";
  import type { HTMLAttributes } from "vue";
  import { cn } from "@/lib/utils";

  const buttonVariants = cva(
    "inline-flex items-center gap-2 justify-center text-md font-medium rounded-full px-5 py-[18px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      variants: {
        variant: {
          primary:
            "text-white bg-primary hover:bg-primary/80 hover:bg-[#B0C834]",
          secondary:
            "bg-[#FFFFFF33] border border-neutral-200 text-neutral-1000 hover:bg-white hover:bg-[#B0C834] hover:text-white",
          solid:
            "bg-white border border-neutral-200 text-neutral-1000 hover:bg-[#B0C834] hover:text-white",
        },
        size: {
          default: "px-5 py-[18px]",
          sm: "px-5 py-2.5 text-sm",
          lg: "px-6 py-5 text-lg",
        },
      },
      defaultVariants: {
        variant: "primary",
        size: "default",
      },
    }
  );

  type ButtonVariants = VariantProps<typeof buttonVariants>;

  interface Props {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "default",
  });
</script>
