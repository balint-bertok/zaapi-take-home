import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import type { Automation } from "../fixtures";
import { editPath, formatDate } from "./automation";
import { ConfirmDialog } from "./ConfirmDialog";
import { Avatar } from "./controls";

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
// Cells sit at the top of the row (the name cell's empty description line sets its height); each
// single-line cell centres its content on one 24px line, which matches the screenshot.
const td = "px-4.5 py-5 align-top";
const line = "flex items-center gap-x-2 min-h-7";
const stickyRight = { right: 0, position: "sticky", zIndex: 1, background: "white" } as const;
const stickyShadow = { ...stickyRight, filter: "drop-shadow(rgba(0, 0, 0, 0.04) -12px 0px 8px)" };

function SortHeader({ column, sort, onSort }: { column: Column; sort: Sort; onSort: (key: SortKey) => void }) {
  const active = column.sort && sort?.key === column.sort ? sort.dir : null;
  return (
    <button
      type="button"
      onClick={() => column.sort && onSort(column.sort)}
      className="text-sm transition-all duration-300 bg-transparent hover:bg-gray-100 rounded-md px-3 flex items-center justify-between gap-2 whitespace-normal text-left h-full py-1 w-full"
    >
      <div className="flex items-center gap-2">
        <span className="block">{column.label}</span>
      </div>
      {column.sort && (
        <div className="flex flex-col">
          <Icon name="chevron-up" className={cn("size-3", active === "asc" ? "text-gray-800" : "text-gray-400")} />
          <Icon name="chevron-down" className={cn("size-3 -mt-1", active === "desc" ? "text-gray-800" : "text-gray-400")} />
        </div>
      )}
    </button>
  );
}

type Sort = { key: SortKey; dir: "asc" | "desc" } | null;

function Row({ a, onDelete }: { a: Automation; onDelete: () => void }) {
  const navigate = useNavigate();
  const integrations = useDemo((s) => s.integrations);
  const [open, setOpen] = useState(false);
  const accounts = integrations.filter((i) => a.integrationIds.includes(i.id));
  const setEnabled = (enabled: boolean) =>
    updateDemo((s) => ({ ...s, automations: s.automations.map((x) => (x.id === a.id ? { ...x, enabled } : x)) }));

  return (
    <tr className="border-b transition-colors">
      <td className={td}>
        <div className={line}>
          <Switch checked={a.enabled} onCheckedChange={setEnabled} aria-label={a.name} />
        </div>
      </td>
      <td className={td}>
        <div className="flex gap-x-2">
          <Icon name="user-group" className="size-4 mt-0.5 text-gray-500 shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate">{a.name}</div>
            <div className="text-gray-500 truncate min-h-5 mt-1">{a.description}</div>
          </div>
        </div>
      </td>
      <td className={td}>
        <div className={line}>
          <div className="flex items-center justify-center rounded-md size-[24px] bg-pink-50 shrink-0">
            <Icon name="rotate" variant="fas" className="size-3.5! text-pink-500" />
          </div>
          <span>{typeLabel[a.type]}</span>
        </div>
      </td>
      <td className={td}>
        {accounts.length > 0 && (
          <>
            <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className={line}>
              <Icon
                name="chevron-right"
                className={cn("size-3 text-gray-400 transition-transform duration-200", open && "rotate-90")}
              />
              <img alt="widget icon" src={asset("images/channels/chat-widget.svg")} className="size-[20px]" />
              <span className="font-medium pl-1">Chat Widget ({accounts.length})</span>
            </button>
            {open && (
              <ul className="mt-2 pl-12 text-gray-500">
                {accounts.map((i) => (
                  <li key={i.id} className="truncate">
                    {i.name}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </td>
      <td className={td}>
        <div className={line}>
          <Avatar name={a.createdBy} />
          <span className="truncate pl-0.5">{a.createdBy}</span>
        </div>
      </td>
      <td className={td}>
        <div className={line}>
          {a.updatedBy ? (
            <>
              <Avatar name={a.updatedBy} />
              <span className="truncate pl-0.5">{a.updatedBy}</span>
            </>
          ) : (
            "-"
          )}
        </div>
      </td>
      <td className={td}>
        <div className={line}>{formatDate(a.updatedAt)}</div>
      </td>
      <td className="py-5 pr-4 align-top" style={stickyShadow}>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More"
            className="flex items-center justify-center size-7 rounded-md hover:bg-gray-100 ml-auto"
          >
            <Icon name="ellipsis-vertical" className="size-4! text-gray-800" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate(editPath(a.id))}>Edit</DropdownMenuItem>
            <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

/** The "All automations" table: sortable headers, horizontal scroll, sticky row menu. */
export function AutomationsTable({ query }: { query: string }) {
  const automations = useDemo((s) => s.automations);
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
    const id = deleting!.id;
    updateDemo((s) => ({ ...s, automations: s.automations.filter((a) => a.id !== id) }));
    setDeleting(null);
    toast.success("Successfully deleted automation");
  };

  return (
    <div className="rounded-lg bg-white text-gray-800 border relative overflow-x-auto">
      <table className="w-full caption-bottom text-sm table-fixed">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {columns.map((c) => (
              <th key={c.label} className={th} style={{ width: c.width }}>
                <SortHeader column={c} sort={sort} onSort={onSort} />
              </th>
            ))}
            <th className={th} style={{ width: 48, ...stickyShadow }} aria-label="Actions" />
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {rows.length === 0 ? (
            <tr className="border-b transition-colors">
              <td className="p-4 align-middle h-96 text-center" colSpan={8}>
                No automations
              </td>
            </tr>
          ) : (
            rows.map((a) => <Row key={a.id} a={a} onDelete={() => setDeleting(a)} />)
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
