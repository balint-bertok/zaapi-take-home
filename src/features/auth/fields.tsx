import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/menu";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

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

// The first entries of the saved page's country list, which the real picker pins to the top.
const countries = [
  ["Thailand", "+66"],
  ["Singapore", "+65"],
  ["Philippines", "+63"],
  ["Malaysia", "+60"],
  ["United States", "+1"],
  ["Taiwan", "+886"],
  ["China", "+86"],
  ["Hong Kong", "+852"],
  ["Indonesia", "+62"],
  ["India", "+91"],
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
            <img alt="Thailand" className="h-4 w-4 rounded-full" width="20" src={asset("images/TH.svg")} />
            <span className="!ml-2">+66</span>
          </span>
          <Icon name="chevron-down" className="h-4 w-4 text-gray-800! ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px] p-1">
          {countries.map(([name, code]) => (
            <DropdownMenuItem key={name} className="justify-between">
              <span>{name}</span>
              <span className="text-gray-500">{code}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Input type="tel" name="phoneNumber" className="rounded-md rounded-r-lg rounded-l-none" {...props} />
    </div>
  );
}
