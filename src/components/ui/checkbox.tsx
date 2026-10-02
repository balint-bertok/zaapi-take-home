import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";

// The green Radix checkbox of the app's forms and pickers (saved create page and live popovers),
// rebuilt without the extra package. Size varies by place: size-5 in forms, size-6 in pickers.
export function Checkbox({
  checked,
  onCheckedChange,
  label,
  className = "size-5",
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer flex items-center justify-center shrink-0 rounded-md border-2 border-gray-200 focus-visible:opacity-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 hover:border-electric-green-500 focus-visible:ring-electric-green-500 data-[state=checked]:bg-electric-green-500 data-[state=checked]:border-electric-green-500",
        className,
      )}
    >
      {checked && <Icon name="check" variant="fas" className="size-3! text-white" />}
    </button>
  );
}
