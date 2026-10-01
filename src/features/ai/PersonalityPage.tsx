import { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@/icons/Icon";
import { ShellPage } from "@/shell/ShellPage";
import { updateDemo, useDemo } from "@/store/store";
import { AddPersonalitySheet } from "./AddPersonalitySheet";
import type { Personality } from "./fixtures";
import { DataTable, FilterChip, gradientButton, ListHeader, PageBody, Pagination, PersonCell, SearchBox, StatusSwitch, type Column } from "./parts";

const setEnabled = (id: string, enabled: boolean) =>
  updateDemo((s) => ({ ...s, personalities: s.personalities.map((p) => (p.id === id ? { ...p, enabled } : p)) }));

const columns: Column<Personality>[] = [
  { label: "Status", width: 70, cell: (p) => <StatusSwitch label={`${p.name} status`} checked={p.enabled} onCheckedChange={(v) => setEnabled(p.id, v)} /> },
  { label: "Name", width: 200, cell: (p) => <span title={p.name}>{p.name}</span> },
  { label: "Integrations applied", width: 240, cell: (p) => (p.integrations.length ? p.integrations.join(", ") : "-") },
  { label: "Created by", width: 120, cell: (p) => <PersonCell name={p.createdBy} /> },
  { label: "Updated by", width: 120, cell: (p) => <PersonCell name={p.createdBy} /> },
  { label: "Created at", width: 180, cell: (p) => p.createdAt },
];

/** AI Agent > Train > Personality (Step 11). */
export default function PersonalityPage() {
  const personalities = useDemo((s) => s.personalities);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rows = personalities.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Train" }, { label: "Personality" }]}>
      <PageBody>
        <ListHeader
          title="Personality"
          titleClassName="text-2xl font-semibold text-gray-900 mb-2"
          action={
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className={`${gradientButton} h-9 px-4 py-2`}>
                <Icon name="plus" variant="fas" className="text-white size-4" />
                Add personality
              </SheetTrigger>
              <AddPersonalitySheet onDone={() => setOpen(false)} />
            </Sheet>
          }
        >
          <p className="text-gray-500 text-sm">
            Customize the tone and personality of your AI agent to reflect your brand. The AI will use this style to reply consistently across tickets.
          </p>
        </ListHeader>
        <div className="flex gap-2 items-center">
          <SearchBox value={query} onChange={setQuery} />
          <FilterChip icon="link" label="Integrations" iconClassName="size-5" />
          <FilterChip icon="user" label="Created by" />
        </div>
        <div>
          <DataTable columns={columns} rows={rows} />
          <Pagination className="mt-8" />
        </div>
      </PageBody>
    </ShellPage>
  );
}
