import { cn } from "@/lib/cn";

// Radio cards of the Assign-to-agents form, class lists from the saved create page
// (Radix checkbox and radio-group markup, rebuilt without the extra packages).

export type RadioOption<T extends string> = { value: T; title: string; description?: string; disabled?: boolean };

/** A titled row of bordered cards, each a radio; the checked card gets the green border. */
export function RadioCards<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly RadioOption<T>[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-sm font-medium mb-3">{label}</div>
      <div role="radiogroup" aria-label={label} className="flex flex-col md:flex-row gap-4">
        {options.map((o) => {
          const checked = o.value === value;
          return (
            <div
              key={o.value}
              onClick={() => !o.disabled && onChange(o.value)}
              className={cn(
                "flex flex-1 space-x-2 border rounded-lg p-3 transition-colors hover:bg-gray-100 hover:cursor-pointer",
                o.description ? "items-start" : "items-center",
                checked ? "border-electric-green-500" : "border-gray-200",
                o.disabled && "pointer-events-none opacity-60",
              )}
            >
              <button
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={o.title}
                disabled={o.disabled}
                data-state={checked ? "checked" : "unchecked"}
                className={cn(
                  "aspect-square h-[18px] w-[18px] shrink-0 rounded-full border-2 text-electric-green-500 focus:outline-hidden disabled:cursor-not-allowed",
                  checked ? "border-electric-green-500" : "border-gray-300",
                )}
              >
                {checked && (
                  <span className="flex items-center justify-center">
                    <span className="h-[8px] w-[8px] bg-electric-green-500 rounded-full" />
                  </span>
                )}
              </button>
              <div className="cursor-pointer text-sm font-medium">
                {o.description ? (
                  <div className="flex flex-col pl-1">
                    <div className="mb-1">{o.title}</div>
                    <div className="text-gray-500 font-normal">{o.description}</div>
                  </div>
                ) : (
                  o.title
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
