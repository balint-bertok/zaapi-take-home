// Building blocks shared by the AI Agent list pages and their sheets. Class lists are copied from
// the saved Knowledge Source, Scenario Handling and Personality pages.
import { Fragment, useState, type ReactNode } from "react";
import { Inert } from "@/components/Inert";
import { Person } from "@/components/Person";
import { Checkbox } from "@/components/ui/checkbox";
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

/** Scenario Handling's search: a bordered row holding the icon and a bare input (live markup). */
export function RowSearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="min-w-[320px] w-[320px] flex items-center gap-2 px-4 h-10 rounded-md border bg-white">
      <Icon name="magnifying-glass" variant="far" className="size-4 shrink-0 text-gray-500" />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        className="text-sm w-full outline-hidden"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/**
 * Dashed filter chip. Its dropdown was never captured, so it renders inert. The integrations
 * filter is a different component in the app, with the smaller radius.
 */
export function FilterChip({
  icon,
  label,
  iconClassName = "size-4",
  integrations = false,
}: {
  icon: IconName;
  label: string;
  iconClassName?: string;
  integrations?: boolean;
}) {
  return (
    <Inert className={cn(buttonClass("outline"), "border-dashed relative", integrations ? "rounded-md" : "rounded-lg")}>
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

/** Avatar plus name: the Zaapi lightning mark for system rows, the initial on gray for people. */
export function PersonCell({ name }: { name: string }) {
  if (name !== "Zaapi System") return <Person name={name} />;
  return (
    <span className="flex gap-x-2.5 items-center">
      <img alt={name} width={24} height={24} className="rounded-full size-[24px]" src={asset("images/favicon.png")} />
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
const channelLabel: Record<string, string> = { "chat-widget": "Chat Widget" };

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
              <div className="relative">
                <img alt="widget icon" className="size-[20px]" src={channelIcon(i.channel)} />
              </div>
            </div>
          ))}
        </div>
        <span className="ml-2">{value.length ? value.join(", ") : "Select integrations"}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 p-4 shadow-md">
        <div className="bg-white text-sm">
          <div className="flex flex-col px-4">
            <h3 className="font-semibold">Integrations</h3>
            <div className="flex justify-between items-center">
              <p>{value.length} Integrations Selected</p>
              <Checkbox
                label="All integrations"
                checked={value.length === integrations.length && integrations.length > 0}
                onCheckedChange={() => onChange(value.length === integrations.length ? [] : integrations.map((i) => i.name))}
              />
            </div>
            <div className="border-b mt-3" />
          </div>
          <div className="divide-y *:py-3 *:last:pb-0 max-h-[400px] px-4 overflow-auto">
            {[...new Set(integrations.map((i) => i.channel))].map((channel) => {
              const accounts = integrations.filter((i) => i.channel === channel);
              const all = accounts.every((i) => value.includes(i.name));
              return (
                <div key={channel} className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="flex justify-center transition-transform duration-200">
                        <Icon name="chevron-down" className="w-4 h-4" />
                      </div>
                      <div className="relative shrink-0">
                        <img alt="" className="select-none object-cover size-[20px]" src={channelIcon(channel)} />
                      </div>
                      <span className="select-none">{channelLabel[channel] ?? channel}</span>
                    </div>
                    <Checkbox
                      label={channelLabel[channel] ?? channel}
                      checked={all}
                      onCheckedChange={() =>
                        onChange(all ? value.filter((n) => !accounts.some((i) => i.name === n)) : [...new Set([...value, ...accounts.map((i) => i.name)])])
                      }
                    />
                  </div>
                  <div className="transition-all duration-300 pl-[24px] flex flex-col space-y-3 *:first:mt-3">
                    {accounts.map((i) => (
                      <div key={i.id}>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex min-w-0 items-center grow gap-3">
                            <div className="relative shrink-0">
                              <img alt="" className="rounded-full object-cover select-none size-[20px]" src={asset("images/default-chat-account.png")} />
                            </div>
                            <span className="truncate text-gray-800 min-w-0">{i.name}</span>
                          </div>
                          <div className="shrink-0">
                            <Checkbox label={i.name} checked={value.includes(i.name)} onCheckedChange={() => toggle(i.name)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

const toolbar: { icon: IconName; label: string; menu?: boolean }[][] = [
  [
    { icon: "rotate-left", label: "Undo" },
    { icon: "rotate-right", label: "Redo" },
  ],
  [
    { icon: "heading", label: "Heading", menu: true },
    { icon: "list-ul", label: "List", menu: true },
    { icon: "block-quote", label: "Blockquote" },
    { icon: "square-code", label: "Code Block" },
    { icon: "table", label: "Table", menu: true },
  ],
  [
    { icon: "bold", label: "Bold" },
    { icon: "italic", label: "Italic" },
    { icon: "strikethrough", label: "Strikethrough" },
    { icon: "code", label: "Code" },
    { icon: "underline", label: "Underline" },
    { icon: "link", label: "Link" },
  ],
];

const editor =
  "min-h-[200px] w-full px-4 py-3 text-sm text-gray-800 focus:outline-none [&_h2]:my-2 [&_h2]:text-lg [&_h2]:font-bold [&_p]:my-2 [&>*:first-child]:mt-0! [&>*:last-child]:mb-0!";

/**
 * The app's rich-text editor (tiptap) as captured: toolbar plus a 200px editing area. The demo's
 * editing area is plain contenteditable; `onText` reports its text.
 * `className` fixes the editor's height where the form must not grow (the setup modal); the text then scrolls inside.
 */
export function RichTextEditor({ label, children, onText, className }: { label: string; children?: ReactNode; onText?: (text: string) => void; className?: string }) {
  return (
    <div className={cn("flex flex-col rounded-md border border-gray-200 bg-white", className)}>
      {/* Formatting controls render as captured; the demo editor is plain contenteditable. */}
      <div className="flex flex-wrap shrink-0 items-center gap-0.5 border-b border-gray-200 px-2 py-1">
        {toolbar.map((group, g) => (
          <div key={g} className="contents">
            {g > 0 && <div className="mx-1 h-5 w-px bg-gray-200" />}
            {group.map((b) => (
              <Inert key={b.label} aria-label={b.label} className={cn(buttonClass("ghost", "icon"), "text-gray-700", b.menu && "gap-x-0.5 pl-2 pr-1")}>
                <Icon name={b.icon} variant="fal" className="size-3.5" />
                {b.menu && <Icon name="caret-down" className="size-2! text-gray-600" />}
              </Inert>
            ))}
          </div>
        ))}
      </div>
      <div className="min-h-0 flex-auto scroll-fade-b overflow-y-auto">
        <div
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onText?.(e.currentTarget.textContent ?? "")}
          className={editor}
        >
          {children ?? <p />}
        </div>
      </div>
    </div>
  );
}
