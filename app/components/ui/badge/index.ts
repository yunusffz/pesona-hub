import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center  border px-3 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        info: "border border-[#E8E8E8A6] font-semibold bg-[#A6B8F473] text-[#2955A9] [a&]:hover:bg-[#A6B8F473]/90 leading-[24px]",
        white:
          "border border-[#E8E8E840] font-semibold bg-[#FFFFFFBF] text-neutral-1000 [a&]:hover:bg-[#FFFFFFBF]/90 leading-[24px]",
        transparent:
          "border border-[#EBEBEB8C] bg-[#FFFFFF14] text-md font-medium  text-[#FFFFFF]  [a&]:hover:bg-[#FFFFFFBF] leading-[24px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
