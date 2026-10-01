// Building blocks shared by the AI Agent list pages and their sheets. Class lists are copied from
// the saved Knowledge Source, Scenario Handling and Personality pages.
import { Fragment, useState, type ReactNode } from "react";
import { Inert } from "@/components/Inert";
import { Button, buttonClass } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Icon, type IconName } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";

/** A catalog string with `<b>` markup, rendered as the app does (bold runs, newlines kept by the caller). */
export function Rich({ text, bold }: { text: string; bold?: string }) {
  return text.split(/<b>(.*?)<\/b>/).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    return bold ? <span key={i} className={bold}>{part}</span> : <b key={i}>{part}</b>;
  });
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search",
  className = "h-9 w-72",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-sm flex relative items-center flex-row-reverse", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none px-1 ml-2">
        <Icon name="magnifying-glass" className="size-4 text-gray-400" />
      </div>
      <input
        aria-label={placeholder}
        className="border-gray-200 placeholder-gray-400 outline-hidden focus:border-gray-300 inline h-full w-full rounded-md border bg-white pr-9 pl-9"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** Dashed filter chip. Its dropdown was never captured, so it renders inert. */
export function FilterChip({ icon, label, iconClassName = "size-4" }: { icon: IconName; label: string; iconClassName?: string }) {
  return (
    <Inert className={cn(buttonClass("outline"), "border-dashed rounded-md relative")}>
      <Icon name={icon} className={cn(iconClassName, "text-gray-800")} />
      <div className="font-medium">{label}</div>
    </Inert>
  );
}

export type Column<T> = {
  label: string;
  width: number;
  /** Sort arrows in the header: "desc" is the active sort (dark down arrow), "none" shows both gray. */
  sort?: "desc" | "none";
  cell: (row: T) => ReactNode;
};

const stickyShadow = { filter: "drop-shadow(rgba(0, 0, 0, 0.04) -12px 0px 8px)" } as const;

/**
 * The fixed-layout list table with a sticky, empty action column on the right. Column widths add up
 * to more than the content width on purpose, as in the app: the table scrolls sideways.
 */
export function DataTable<T extends { id: string }>({ columns, rows, sticky = false }: { columns: Column<T>[]; rows: T[]; sticky?: boolean }) {
  const lastCell = sticky ? { ...stickyShadow, position: "sticky" as const, right: 0, zIndex: 1 } : undefined;
  return (
    <div className="rounded-lg bg-white text-gray-800 overflow-auto border relative">
      <table className="w-full caption-bottom text-sm table-fixed">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {columns.map((c, i) => (
              <th key={i} className="text-left align-middle text-gray-700 font-medium p-1.5 bg-white h-[48px]" style={{ width: c.width }}>
                <div className="text-sm rounded-md flex items-center justify-between gap-2 whitespace-normal text-left h-full py-1 px-2 w-full">
                  <span className="block">{c.label}</span>
                  {c.sort && (
                    <div className="flex flex-col">
                      <Icon name="chevron-up" className="size-3 text-gray-400" />
                      <Icon name="chevron-down" className={cn("size-3 -mt-1", c.sort === "desc" ? "text-gray-800" : "text-gray-400")} />
                    </div>
                  )}
                </div>
              </th>
            ))}
            <th className="bg-white h-[48px] p-1.5" style={{ width: 48, ...lastCell }} />
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {rows.length ? (
            rows.map((row) => (
              <tr key={row.id} className="border-b transition-colors">
                {columns.map((c, i) => (
                  <td key={i} className="p-4 align-top pl-4 pr-3 py-4 truncate bg-white h-[52px]">
                    {c.cell(row)}
                  </td>
                ))}
                <td className="bg-white h-[52px]" style={lastCell} />
              </tr>
            ))
          ) : (
            <tr className="border-none">
              {[...columns, null].map((_, i) => (
                <td key={i} className="p-4 align-middle truncate bg-white py-0 h-96" />
              ))}
            </tr>
          )}
        </tbody>
      </table>
      {!rows.length && (
        // The app's "bg-loader-bg" veil: the empty table's headers show through it washed out.
        <div className="absolute top-0 left-0 w-full h-full text-sm text-gray-500 flex items-center justify-center bg-white/40 z-20">No data</div>
      )}
    </div>
  );
}

/** Pager under every list. The demo never has a second page, so it always reads "No data". */
export function Pagination({ className = "mt-4" }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-end", className)}>
      <div className="text-sm text-gray-800 mr-4">
        <span className="font-medium">No data</span>
      </div>
      <Button variant="outline" size="sm" className="mr-2" aria-label="Previous page" disabled>
        <Icon name="chevron-left" className="size-3 text-gray-500" />
      </Button>
      <Button variant="outline" size="sm" className="mr-2" aria-label="Next page" disabled>
        <Icon name="chevron-right" className="size-3 text-gray-500" />
      </Button>
    </div>
  );
}

/** Avatar plus name: the Zaapi lightning mark for system rows, the placeholder photo for people. */
export function PersonCell({ name }: { name: string }) {
  const system = name === "Zaapi System";
  return (
    <span className="flex gap-x-2.5 items-center">
      <img alt={name} width={24} height={24} className="rounded-full size-6" src={asset(system ? "images/favicon.png" : "images/avatar_placeholder.jpeg")} />
      <span className="text-sm text-gray-800">{name}</span>
    </span>
  );
}

/** The gradient "+" button of a list page and the create sheet it opens; `sheet` gets a close callback. */
export function AddSheetButton({ label, sheet }: { label: string; sheet: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonClass("ai")}>
        <Icon name="plus" variant="fas" className="text-white size-4" />
        {label}
      </SheetTrigger>
      {sheet(() => setOpen(false))}
    </Sheet>
  );
}

/** Title row and description of a list page, with the gradient "+" button on the right. */
export function ListHeader({
  title,
  titleClassName = "text-2xl font-medium",
  children,
  action,
}: {
  title: string;
  titleClassName?: string;
  children: ReactNode;
  action: ReactNode;
}) {
  return (
    <section className="flex items-center justify-between gap-8">
      <div>
        <h1 className={titleClassName}>{title}</h1>
        {children}
      </div>
      {action}
    </section>
  );
}

/** White card that groups one question in a sheet form. */
export function FormCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-lg bg-white p-4", className)}>{children}</div>;
}

export function Counter({ value, max, className = "mt-2" }: { value: string; max: number; className?: string }) {
  return (
    <div className={cn("flex justify-between", className)}>
      <span className="text-sm text-gray-400 ml-auto">
        {value.length}/{max}
      </span>
    </div>
  );
}

/** Bordered radio card, teal when selected (source type, how AI should respond). */
export function RadioCard({ checked, onSelect, children, className }: { checked: boolean; onSelect: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "flex flex-1 items-center space-x-2 border rounded-lg p-3 text-left transition-colors hover:bg-gray-100 hover:cursor-pointer",
        checked ? "border-electric-green-500" : "border-gray-200",
        className,
      )}
    >
      <RadioDot checked={checked} />
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
}

export function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "aspect-square h-[18px] w-[18px] shrink-0 rounded-full border-2 flex items-center justify-center",
        checked ? "border-electric-green-500" : "border-gray-300",
      )}
    >
      {checked && <span className="h-[8px] w-[8px] bg-electric-green-500 rounded-full" />}
    </span>
  );
}

const channelIcon = (channel: string) => asset(`images/channels/${channel}.svg`);

/** "Select integrations" button with the workspace's channel icons; opens a checklist of integrations. */
export function IntegrationPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const integrations = useDemo((s) => s.integrations);
  const toggle = (name: string) => onChange(value.includes(name) ? value.filter((n) => n !== name) : [...value, name]);
  return (
    <Popover>
      <PopoverTrigger className={cn(buttonClass("outline"), "h-10 rounded-lg px-4")}>
        <div className="flex">
          {integrations.map((i) => (
            <div key={i.id} className="rounded-full border border-white -mr-2">
              <img alt="widget icon" className="size-5" src={channelIcon(i.channel)} />
            </div>
          ))}
        </div>
        <span className="ml-2">{value.length ? value.join(", ") : "Select integrations"}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-1">
        {integrations.map((i) => {
          const on = value.includes(i.name);
          return (
            <button
              key={i.id}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => toggle(i.name)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
            >
              <span className={cn("size-4 rounded-[4px] border flex items-center justify-center", on ? "bg-electric-green-500 border-electric-green-500" : "border-gray-300")}>
                {on && <Icon name="check" className="size-3 text-white" />}
              </span>
              <img alt="" className="size-5" src={channelIcon(i.channel)} />
              <span>{i.name}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

/** Cancel plus the gradient submit; `large` is the h-10 px-8 "Create" of the personality sheet. */
export function SheetFooter({ onCancel, submitLabel, disabled, large }: { onCancel: () => void; submitLabel: string; disabled: boolean; large?: boolean }) {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="ai" size={large ? "lg" : "default"} disabled={disabled}>
        {submitLabel}
      </Button>
    </div>
  );
}
