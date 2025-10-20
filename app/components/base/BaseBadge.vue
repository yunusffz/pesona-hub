<template>
  <span :class="cn(badgeVariants({ variant, size }), props.class)">
    <slot />
  </span>
</template>

<script setup lang="ts">
  import type { VariantProps } from "class-variance-authority";
  import { cva } from "class-variance-authority";
  import type { HTMLAttributes } from "vue";
  import { cn } from "@/lib/utils";

  const badgeVariants = cva(
    "inline-flex items-center justify-center border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full",
    {
      variants: {
        variant: {
          default:
            "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
          secondary:
            "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive:
            "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          outline:
            "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
          info: "border border-[#E8E8E8A6] font-semibold bg-[#A6B8F473] text-[#2955A9] hover:bg-[#A6B8F473]/90",
          "white-transparent":
            "border border-[#E8E8E840] font-semibold bg-[#FFFFFFBF] text-neutral-1000 hover:bg-[#FFFFFFBF]/90",
          white:
            "border border-[#E8E8E8] font-semibold bg-[#FFFFFF] text-neutral-1000 hover:bg-[#FFFFFF]/90",
          transparent:
            "border border-[#EBEBEB8C] bg-[#FFFFFF14] text-[#FFFFFF] hover:bg-[#FFFFFFBF]",
          grey: "border border-[#E8E8E8] bg-[#F5F5F5] text-neutral-800 hover:bg-[#F5F5F5]/90",
        },
        size: {
          default: "px-3 py-0.5 text-xs",
          xs: "px-1.5 py-0.5 text-xs",
          sm: "px-2 py-0.5 text-xs",
          lg: "px-4 py-1 text-sm",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  );

  type BadgeVariants = VariantProps<typeof badgeVariants>;

  interface Props {
    variant?: BadgeVariants["variant"];
    size?: BadgeVariants["size"];
    class?: HTMLAttributes["class"];
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    size: "default",
  });
</script>
