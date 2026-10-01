import { useState } from "react";
import { Inert } from "@/components/Inert";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@/icons/Icon";
import { ShellPage } from "@/shell/ShellPage";
import { updateDemo, useDemo } from "@/store/store";
import { AddScenarioSheet } from "./AddScenarioSheet";
import type { Scenario } from "./fixtures";
import { handlingLabel, integrationsLabel } from "./format";
import { DataTable, FilterChip, gradientButton, ListHeader, PageBody, Pagination, PersonCell, StatusSwitch, type Column } from "./parts";

const setEnabled = (id: string, enabled: boolean) =>
  updateDemo((s) => ({ ...s, scenarios: s.scenarios.map((x) => (x.id === id ? { ...x, enabled } : x)) }));

const columns: Column<Scenario>[] = [
  { label: "Status", width: 70, cell: (x) => <StatusSwitch label={`${x.name} status`} checked={x.enabled} onCheckedChange={(v) => setEnabled(x.id, v)} /> },
  { label: "Scenario name", width: 320, cell: (x) => <span title={x.name}>{x.name}</span> },
  { label: "How to handle", width: 200, cell: (x) => handlingLabel[x.handling] },
  { label: "Integrations applied", width: 240, cell: (x) => integrationsLabel(x.integrations) },
  { label: "Last updated", width: 180, sort: "desc", cell: (x) => x.createdAt },
  { label: "Updated by", width: 120, cell: (x) => <PersonCell name={x.createdBy} /> },
  { label: "Created at", width: 180, sort: "none", cell: (x) => x.createdAt },
  { label: "Created by", width: 120, cell: (x) => <PersonCell name={x.createdBy} /> },
];

/** AI Agent > Train > Scenario handling (Step 10). */
export default function ScenarioHandlingPage() {
  const scenarios = useDemo((s) => s.scenarios);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rows = scenarios.filter((x) => x.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Train" }, { label: "Scenario handling" }]}>
      <PageBody>
        <ListHeader
          title="Scenario handling"
          action={
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className={`${gradientButton} h-9 px-4 py-2`}>
                <Icon name="plus" variant="fas" className="text-white size-4" />
                Add scenario
              </SheetTrigger>
              <AddScenarioSheet onDone={() => setOpen(false)} />
            </Sheet>
          }
        >
          <p className="text-sm text-gray-500 mt-2">
            Train your AI Agent to follow scenarios for common customer scenarios.{" "}
            {/* Help-centre article, outside the demo. */}
            <Inert className="underline">Learn how to set up your scenarios.</Inert>
          </p>
        </ListHeader>
        <div className="flex gap-2 overflow-auto pt-2">
          <div className="min-w-[320px] w-[320px] flex items-center gap-2 px-4 h-10 rounded-md border bg-white">
            <Icon name="magnifying-glass" className="size-4 shrink-0 text-gray-500" />
            <input
              aria-label="Search scenario name"
              placeholder="Search scenario name"
              className="text-sm w-full outline-hidden placeholder:text-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <FilterChip icon="rotate-exclamation" label="How to handle" />
          <FilterChip icon="link" label="Integrations" iconClassName="size-5" />
          <FilterChip icon="user" label="Created by" />
        </div>
        <div>
          <DataTable columns={columns} rows={rows} sticky />
          <Pagination className="mt-5" />
        </div>
      </PageBody>
    </ShellPage>
  );
}
