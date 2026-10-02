import { useState } from "react";
import { ShellPage } from "@/shell/ShellPage";
import { Pagination } from "@/components/Pagination";
import { useDemo } from "@/store/store";
import { AddPersonalitySheet } from "./AddPersonalitySheet";
import type { Personality } from "./fixtures";
import { byName } from "./format";
import { AddSheetButton, DataTable, FilterChip, ListHeader, PersonCell, SearchBox, type Column } from "./parts";
import { statusColumn } from "./statusColumn";

const columns: Column<Personality>[] = [
  statusColumn("personalities"),
  { label: "Name", width: 200, cell: (p) => <span title={p.name}>{p.name}</span> },
  // A personality applies only where it is assigned, so none reads "-" rather than "All integrations".
  { label: "Integrations applied", width: 240, cell: (p) => (p.integrations.length ? p.integrations.join(", ") : "-") },
  { label: "Created by", width: 120, cell: (p) => <PersonCell name={p.createdBy} /> },
  { label: "Updated by", width: 120, cell: (p) => <PersonCell name={p.createdBy} /> },
  { label: "Created at", width: 180, cell: (p) => p.createdAt },
];

/** AI Agent > Train > Personality (Step 11). */
export default function PersonalityPage() {
  const personalities = useDemo((s) => s.personalities);
  const [query, setQuery] = useState("");
  const rows = byName(personalities, query);

  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Train" }, { label: "Personality" }]} className="space-y-7 pb-7">
      <section className="space-y-8">
        <ListHeader
          title="Personality"
          titleClassName="text-2xl font-semibold text-gray-900 mb-2"
          action={<AddSheetButton label="Add personality" sheet={(close) => <AddPersonalitySheet onDone={close} />} />}
        >
          <p className="text-gray-500 text-sm">
            Customize the tone and personality of your AI agent to reflect your brand. The AI will use this style to reply consistently across tickets.
          </p>
        </ListHeader>
        <div className="flex gap-2 items-center">
          <SearchBox value={query} onChange={setQuery} />
          <FilterChip icon="link" label="Integrations" iconClassName="size-5" integrations />
          <FilterChip icon="user" label="Created by" />
        </div>
        <div>
          <DataTable columns={columns} rows={rows} />
          <Pagination count={rows.length} className="mt-8" />
        </div>
      </section>
    </ShellPage>
  );
}
