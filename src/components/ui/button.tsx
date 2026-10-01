import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Class lists copied from the saved pages' buttons.
const base =
  "gap-x-2 inline-flex items-center justify-center whitespace-nowrap text-sm rounded-lg transition-all ease-(--ease-out-quart) duration-300 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:opacity-100";

const variants = {
  default:
    "bg-gray-800 text-white hover:bg-gray-600 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400",
  outline: "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200 disabled:opacity-50",
  ghost: "bg-transparent hover:bg-gray-100 disabled:opacity-50 aria-selected:bg-gray-100 aria-selected:hover:opacity-80",
  subscribe:
    "bg-[linear-gradient(79deg,#1D2939_50.01%,#52729F_101.43%)] hover:opacity-90 transition-opacity text-white disabled:opacity-50",
  ai: "bg-(image:--color-ai-gradient) hover:opacity-80 transition-opacity text-white disabled:opacity-50",
} as const;

const sizes = { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3", lg: "h-10 rounded-lg px-8", icon: "h-9 w-9" } as const;

export type ButtonProps = ComponentProps<"button"> & { variant?: keyof typeof variants; size?: keyof typeof sizes };

export function buttonClass(variant: keyof typeof variants = "default", size: keyof typeof sizes = "default") {
  return cn(base, variants[variant], sizes[size]);
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonClass(variant, size), className)} {...props} />;
}
