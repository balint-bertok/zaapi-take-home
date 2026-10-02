import { useState } from "react";
import { useNavigate } from "react-router";
import { Inert } from "@/components/Inert";
import { Pagination } from "@/components/Pagination";
import { Person } from "@/components/Person";
import { Button, buttonClass } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/menu";
import { tableRow } from "@/components/ui/table";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { ShellPage } from "@/shell/ShellPage";
import { useDemo } from "@/store/store";
import type { Flow } from "./fixtures";
import { CheckItem } from "./flows/Checkbox";
import { toggleIn } from "./flows/shared";
import { CreateFlowSheet } from "./flows/CreateFlowSheet";
import { StatusBadge } from "./flows/StatusBadge";
import { formatDate } from "./basic/automation";

type StatusFilter = "active" | "paused" | "draft";
const statusLabels: Record<StatusFilter, string> = { active: "Active", paused: "Paused", draft: "Draft" };
const statusOf = (f: Flow): StatusFilter => (f.status === "draft" ? "draft" : f.enabled ? "active" : "paused");

type Sort = { key: "name" | "updatedAt"; dir: "asc" | "desc" };

// Header classes from the saved list page; column widths are its inline styles.
const th = "text-left align-middle text-gray-700 font-medium p-1.5 bg-white h-[48px]";
const thInner =
  "text-sm transition-all ease-(--ease-out-quart) duration-300 bg-transparent rounded-md px-3 flex items-center justify-between gap-2 whitespace-normal text-left h-full w-full";

/** /automations/flows: the "All flows" table, with the "Create new flow" sheet behind "New flow". */
export default function FlowsPage() {
  const flows = useDemo((s) => s.flows);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<StatusFilter[]>([]);
  const [sort, setSort] = useState<Sort>({ key: "updatedAt", dir: "desc" });

  const rows = flows
    .filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((f) => statuses.length === 0 || statuses.includes(statusOf(f)))
    .sort((a, b) => (sort.dir === "asc" ? 1 : -1) * a[sort.key].localeCompare(b[sort.key]));

  const sortBy = (key: Sort["key"]) => setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));

  return (
    <ShellPage breadcrumb={[{ label: "Automations" }, { label: "Flow Builder" }]}>
      <div className="flex justify-between pb-7">
        <h1 className="text-2xl font-medium">Flow Builder</h1>
        <div className="flex gap-x-4">
          <Inert className={buttonClass("outline")}>
            <Icon name="lightbulb-on" variant="fal" className="w-4 h-4" />
            Tutorial
          </Inert>
          <CreateFlowSheet
            trigger={
              <Button>
                <Icon name="plus" className="h-4 w-4" />
                New flow
              </Button>
            }
          />
        </div>
      </div>
      <div className="text-gray-500 text-sm mt-[-14px]">
        Create custom chatbot flows with keyword-based assignments, AI automation, lead qualification, and more.
      </div>

      <div className="space-y-7 mt-7">
        <div className="space-y-2">
          <h2 className="font-medium text-lg text-gray-800">All flows</h2>
          <div className="flex gap-3 items-center">
            <div className="text-sm flex relative items-center flex-row-reverse h-9 w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none px-1 ml-2">
                <Icon name="magnifying-glass" className="size-4 text-gray-400" />
              </div>
              <input
                aria-label="Search by name"
                className="border-gray-200 placeholder-gray-400 outline-hidden focus:border-gray-300 inline h-full w-full rounded-md border bg-white pr-9 pl-9"
                placeholder="Search by name"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger className={cn(buttonClass("outline"), "border-dashed relative")}>
                <Icon name="circle-half-stroke" className="size-4 text-gray-800" />
                <div className="font-medium">Status</div>
                {statuses.length > 0 && (
                  <span className="rounded-sm bg-gray-100 px-1.5 text-xs font-medium text-gray-800">{statuses.length}</span>
                )}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-48 p-1">
                {(Object.keys(statusLabels) as StatusFilter[]).map((s) => (
                  <CheckItem key={s} checked={statuses.includes(s)} onToggle={() => setStatuses((cur) => toggleIn(cur, s))}>
                    {statusLabels[s]}
                  </CheckItem>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <div className="rounded-lg bg-white text-gray-800 border border-gray-200 relative overflow-hidden">
            <table className="w-full caption-bottom text-sm table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className={th} style={{ width: 70 }}>
                    <div className={thInner}>Status</div>
                  </th>
                  <th className={th} style={{ width: 360 }}>
                    <SortButton label="Name & rule" dir={sort.key === "name" ? sort.dir : null} onClick={() => sortBy("name")} />
                  </th>
                  <th className={th} style={{ width: 120 }}>
                    <div className={thInner}>Created by</div>
                  </th>
                  <th className={th} style={{ width: 120 }}>
                    <div className={thInner}>Updated by</div>
                  </th>
                  <th className={th} style={{ width: 150 }}>
                    <SortButton label="Last updated" dir={sort.key === "updatedAt" ? sort.dir : null} onClick={() => sortBy("updatedAt")} />
                  </th>
                  <th className={th} style={{ width: 48 }} />
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {rows.length === 0 ? (
                  <tr className="border-b border-gray-200">
                    <td colSpan={6} className="p-4 align-middle h-16">
                      <div className="w-full flex items-center justify-center">No data</div>
                    </td>
                  </tr>
                ) : (
                  rows.map((f) => (
                    <tr
                      key={f.id}
                      onClick={() => navigate(`/automations/flow-builder?id=${f.id}`)}
                      className={tableRow}
                    >
                      <td className={td}>
                        <StatusBadge status={f.status} label={statusLabels[statusOf(f)]} />
                      </td>
                      <td className={td}>
                        <div className="space-y-1.5">
                          <h3 className="font-medium text-gray-800 truncate">{f.name}</h3>
                          <p className="text-gray-500 truncate" />
                        </div>
                      </td>
                      <td className={td}>
                        <Person name={f.createdBy} />
                      </td>
                      <td className={td}>{f.status === "draft" ? "-" : <Person name={f.updatedBy} />}</td>
                      <td className={td}>{formatDate(f.updatedAt.slice(0, 10))}</td>
                      <td className={td}>
                        <div className="text-end">
                          <Inert
                            aria-label="More"
                            onClick={(e) => e.stopPropagation()}
                            className={cn(buttonClass("ghost"), "hover:opacity-100 size-7 p-0")}
                          >
                            <Icon name="ellipsis-vertical" variant="fas" className="size-4" />
                          </Inert>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination count={rows.length} className="mt-6" />
        </div>
      </div>
    </ShellPage>
  );
}

// Cell classes from the live list (the saved page had no rows).
const td = "p-4 border-t align-top truncate py-4 h-[80px] bg-white";

function SortButton({ label, dir, onClick }: { label: string; dir: Sort["dir"] | null; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(thInner, "cursor-pointer active:scale-[0.98]")}>
      <span className="block">{label}</span>
      <span className="flex flex-col">
        <Icon name="chevron-up" className={cn("size-3", dir === "asc" ? "text-gray-800" : "text-gray-400")} />
        <Icon name="chevron-down" className={cn("size-3 -mt-1", dir === "desc" ? "text-gray-800" : "text-gray-400")} />
      </span>
    </button>
  );
}
