import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Person } from "@/components/Person";
import { buttonClass } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";
import { tableRow } from "@/components/ui/table";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import type { Integration } from "@/store/fixtures";
import type { Automation } from "../fixtures";
import { editPath, formatDate, updateAutomations } from "./automation";
import { ConfirmDialog } from "./ConfirmDialog";

type SortKey = "name" | "type" | "createdBy" | "updatedBy" | "updatedAt";
type Column = { label: string; width: number; sort?: SortKey };

// Header labels and widths from the saved list page; the last column is the sticky row menu.
const columns: Column[] = [
  { label: "Status", width: 90 },
  { label: "Automation name & description", width: 240, sort: "name" },
  { label: "Automation type", width: 185, sort: "type" },
  { label: "Integrations applied", width: 180 },
  { label: "Created by", width: 150, sort: "createdBy" },
  { label: "Updated by", width: 120, sort: "updatedBy" },
  { label: "Last updated", width: 120, sort: "updatedAt" },
];
const typeLabel: Record<Automation["type"], string> = { "assign-to-agents": "Assign to agents" };

const th = "text-left align-middle font-medium p-1.5 bg-white h-[48px] text-gray-800";
// Cell classes from the live list: padded cells at the top of the row.
const td = "border-b p-1.5 align-top bg-white";
const sticky = {
  right: 0,
  position: "sticky",
  zIndex: 1,
  background: "white",
  filter: "drop-shadow(rgba(0, 0, 0, 0.04) -12px 0px 8px)",
} as const;

function SortHeader({ column, sort, onSort }: { column: Column; sort: Sort; onSort: (key: SortKey) => void }) {
  const box = "text-sm rounded-md px-3 flex items-center justify-between gap-2 whitespace-normal text-left h-full py-1 w-full";
  const label = (
    <div className="flex items-center gap-2">
      <span className="block">{column.label}</span>
    </div>
  );
  // Unsortable columns are plain text, not a button that does nothing.
  if (!column.sort) return <div className={box}>{label}</div>;
  const key = column.sort;
  const active = sort?.key === key ? sort.dir : null;
  return (
    <button
      type="button"
      onClick={() => onSort(key)}
      className={cn(box, "transition-all duration-300 bg-transparent hover:bg-gray-100")}
    >
      {label}
      <div className="flex flex-col">
        <Icon name="chevron-up" className={cn("size-3", active === "asc" ? "text-gray-800" : "text-gray-400")} />
        <Icon name="chevron-down" className={cn("size-3 -mt-1", active === "desc" ? "text-gray-800" : "text-gray-400")} />
      </div>
    </button>
  );
}

type Sort = { key: SortKey; dir: "asc" | "desc" } | null;

function Row({ a, integrations, onDelete }: { a: Automation; integrations: Integration[]; onDelete: () => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const accounts = integrations.filter((i) => a.integrationIds.includes(i.id));
  const setEnabled = (enabled: boolean) =>
    updateAutomations((list) => list.map((x) => (x.id === a.id ? { ...x, enabled } : x)));

  return (
    <tr className={tableRow}>
      <td className={td}>
        <div className="px-3 py-4">
          <Switch checked={a.enabled} onCheckedChange={setEnabled} aria-label={a.name} className="h-7 w-12" />
        </div>
      </td>
      <td className={td}>
        <div className="px-3 py-4">
          <div className="flex gap-x-2">
            <Icon name="users" variant="far" className="h-4 min-w-4 text-gray-500" />
            <p className="font-medium leading-4 text-gray-800 text-sm truncate">{a.name}</p>
          </div>
          <p className="leading-4 mt-2 text-gray-500 text-sm truncate">{a.description}</p>
        </div>
      </td>
      <td className={td}>
        <div className="flex items-center gap-2 px-3 py-4 text-gray-800 text-sm">
          <div className="shrink-0 size-7 rounded-lg flex items-center justify-center bg-pink-50">
            <Icon name="rotate" variant="fas" className="size-4 text-pink-500" />
          </div>
          <div>{typeLabel[a.type]}</div>
        </div>
      </td>
      <td className={td}>
        <div className="px-3 py-4">
          {accounts.length > 0 && (
            <div className="w-full">
              <h3 className="flex">
                <button
                  type="button"
                  aria-expanded={open}
                  data-state={open ? "open" : "closed"}
                  onClick={() => setOpen(!open)}
                  className="flex flex-1 gap-x-2 items-center justify-start py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-90 pt-0"
                >
                  <Icon name="chevron-right" variant="fas" className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center">
                      <img alt="widget icon" src={asset("images/channels/chat-widget.svg")} className="size-[20px]" />
                    </div>
                    <span className="text-gray-800 text-start">Chat Widget ({accounts.length})</span>
                  </div>
                </button>
              </h3>
              {open && (
                <ul className="pl-12 text-gray-500">
                  {accounts.map((i) => (
                    <li key={i.id} className="truncate">
                      {i.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </td>
      <td className={td}>
        <div className="px-3 py-4">
          <Person name={a.createdBy} />
        </div>
      </td>
      <td className={td}>
        <div className="px-3 py-4">{a.updatedBy ? <Person name={a.updatedBy} /> : "-"}</div>
      </td>
      <td className={td}>
        <div className="leading-5 px-3 py-4 text-gray-800 text-sm">{formatDate(a.updatedAt)}</div>
      </td>
      <td className={td} style={sticky}>
        <div className="pr-3 py-3 text-end">
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="More" className={cn(buttonClass("ghost"), "h-7 p-0 w-7")}>
              <Icon name="ellipsis-vertical" variant="fas" className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => navigate(editPath(a.id))}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

/** The "All automations" table: sortable headers, horizontal scroll, sticky row menu. */
export function AutomationsTable({ query }: { query: string }) {
  const automations = useDemo((s) => s.automations);
  const integrations = useDemo((s) => s.integrations);
  const [sort, setSort] = useState<Sort>(null);
  const [deleting, setDeleting] = useState<Automation | null>(null);

  const q = query.trim().toLowerCase();
  const rows = automations.filter((a) => a.name.toLowerCase().includes(q));
  if (sort) {
    const value = (a: Automation) => (sort.key === "type" ? typeLabel[a.type] : (a[sort.key] ?? ""));
    rows.sort((x, y) => value(x).localeCompare(value(y)) * (sort.dir === "asc" ? 1 : -1));
  }
  const onSort = (key: SortKey) =>
    setSort((cur) => (cur?.key === key && cur.dir === "asc" ? { key, dir: "desc" } : { key, dir: "asc" }));

  const remove = () => {
    // The dialog stays clickable while it animates out; a second click finds nothing to delete.
    if (!deleting) return;
    updateAutomations((list) => list.filter((a) => a.id !== deleting.id));
    setDeleting(null);
    toast.success("Successfully deleted automation");
  };

  return (
    <div className="rounded-lg bg-white text-gray-800 border relative overflow-x-auto">
      <table className="w-full caption-bottom text-sm table-fixed">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {columns.map((c) => (
              <th
                key={c.label}
                className={th}
                style={{ width: c.width }}
                aria-sort={c.sort ? (sort?.key === c.sort ? `${sort.dir}ending` : "none") : undefined}
              >
                <SortHeader column={c} sort={sort} onSort={onSort} />
              </th>
            ))}
            <th className={th} style={{ width: 48, ...sticky }} aria-label="Actions" />
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {rows.length === 0 ? (
            <tr className="border-b transition-colors">
              <td className="p-4 align-middle h-96 text-center" colSpan={columns.length + 1}>
                No automations
              </td>
            </tr>
          ) : (
            rows.map((a) => <Row key={a.id} a={a} integrations={integrations} onDelete={() => setDeleting(a)} />)
          )}
        </tbody>
      </table>
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Are you sure you want to delete this automation?"
        description="This cannot be undone. All data associated to this automation will be removed."
        secondary="Cancel"
        onSecondary={() => setDeleting(null)}
        primary="Delete automation"
        onPrimary={remove}
      />
    </div>
  );
}
