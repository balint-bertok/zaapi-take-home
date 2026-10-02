import { useState } from "react";
import { Inert } from "@/components/Inert";
import { ShellPage } from "@/shell/ShellPage";
import { Pagination } from "@/components/Pagination";
import { useDemo } from "@/store/store";
import { AddScenarioSheet } from "./AddScenarioSheet";
import type { Scenario } from "./fixtures";
import { byName, handlingLabel, integrationsLabel } from "./format";
import { AddSheetButton, DataTable, FilterChip, ListHeader, PersonCell, RowSearchBox, type Column } from "./parts";
import { statusColumn } from "./statusColumn";

const columns: Column<Scenario>[] = [
  statusColumn("scenarios"),
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
  // Newest first, as the "Last updated" sort arrow says: rows are stored in creation order.
  const rows = byName(scenarios, query).reverse();

  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Train" }, { label: "Scenario handling" }]} className="space-y-7 pb-7">
      <section className="space-y-8">
        <ListHeader title="Scenario handling" action={<AddSheetButton label="Add scenario" sheet={(close) => <AddScenarioSheet onDone={close} />} />}>
          <p className="text-sm text-gray-500 mt-2">
            Train your AI Agent to follow scenarios for common customer scenarios.{" "}
            {/* Help-centre article, outside the demo. */}
            <Inert className="underline">Learn how to set up your scenarios.</Inert>
          </p>
        </ListHeader>
        <div className="flex gap-2 overflow-auto pt-2">
          <RowSearchBox value={query} onChange={setQuery} placeholder="Search scenario name" />
          <FilterChip icon="rotate-exclamation" label="How to handle" />
          <FilterChip icon="link" label="Integrations" iconClassName="size-5" integrations />
          <FilterChip icon="user" label="Created by" />
        </div>
        <div>
          <DataTable columns={columns} rows={rows} sticky />
          <Pagination count={rows.length} className="mt-5" />
        </div>
      </section>
    </ShellPage>
  );
}
