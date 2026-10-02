import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/menu";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { Flag } from "./flags";

// Form pieces shared by the register and login pages, class lists from the saved pages.

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-sm text-gray-800 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

/** Inline field error, as under the login password. */
export function FieldError({ children }: { children?: string }) {
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
}

/**
 * Password with the eye toggle. Uncontrolled and never read: the demo has no account, so whatever
 * is typed stays in this input and is dropped when the page changes.
 */
export function PasswordInput({ className, ...props }: ComponentProps<"input">) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative mt-1">
      <Input type={shown ? "text" : "password"} className={cn("mt-2", className)} {...props} />
      <button
        type="button"
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        onClick={() => setShown((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        <Icon name="eye" className="size-4" />
      </button>
    </div>
  );
}

// The countries the real picker pins to the top of its (scrolling) list, in its order.
const countries = [
  ["Thailand", "TH", "+66"],
  ["Singapore", "SG", "+65"],
  ["Philippines", "PH", "+63"],
  ["Malaysia", "MY", "+60"],
  ["United States", "US", "+1"],
  ["Taiwan", "TW", "+886"],
  ["China", "CN", "+86"],
  ["Hong Kong", "HK", "+852"],
  ["Indonesia", "ID", "+62"],
  ["India", "IN", "+91"],
] as const;

/** Country code picker plus number. Thailand is fixed; the list opens but choosing is inert. */
export function PhoneInput(props: ComponentProps<"input">) {
  return (
    <div className="flex mt-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          role="combobox"
          className="flex h-10 items-center justify-between rounded-md border px-3 py-2 text-sm data-[state=open]:border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 w-[140px] bg-white rounded-l-lg rounded-r-none border-r-0"
        >
          <span className="flex items-center w-full space-x-1 text-gray-800 text-sm py-1">
            <Flag code="TH" name="Thailand" />
            <span className="!ml-2">+66</span>
          </span>
          <Icon name="chevron-down" className="h-4 w-4 text-gray-800! ml-1" />
        </DropdownMenuTrigger>
        {/* The live picker is a Radix select: code and flag per row, min-w-32, scrolling list. */}
        <DropdownMenuContent align="start" sideOffset={0} className="min-w-32 max-h-96 p-0 overflow-y-auto rounded-md">
          {countries.map(([name, code, dial]) => (
            <DropdownMenuItem
              key={code}
              className="rounded-xs py-1.5 pr-2 pl-3 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100"
            >
              <span>
                <div className="flex items-center w-full space-x-1 text-gray-800 text-sm py-1">
                  <Flag code={code} name={name} />
                  <div className="!ml-2">{dial}</div>
                </div>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Input type="tel" name="phoneNumber" className="rounded-md rounded-r-lg rounded-l-none" {...props} />
    </div>
  );
}
