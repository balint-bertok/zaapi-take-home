import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Form field classes from the saved register and AI pages.
export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring focus-visible:ring-gray-300 focus-visible:ring-offset-0 focus-visible:outline-none aria-[invalid=true]:border-error-500 rounded-lg",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring focus-visible:ring-gray-300 focus-visible:ring-offset-0 focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}
