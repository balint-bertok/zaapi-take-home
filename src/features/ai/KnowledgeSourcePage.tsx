import { useState } from "react";
import { Inert } from "@/components/Inert";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@/icons/Icon";
import { ShellPage } from "@/shell/ShellPage";
import { updateDemo, useDemo } from "@/store/store";
import { AddKnowledgeSourceSheet } from "./AddKnowledgeSourceSheet";
import type { KnowledgeSource, KnowledgeSourceType } from "./fixtures";
import {
  DataTable,
  FilterChip,
  gradientButton,
  ListHeader,
  PageBody,
  Pagination,
  PersonCell,
  SearchBox,
  StatusSwitch,
  type Column,
} from "./parts";
import { integrationsLabel } from "./format";

const STORAGE_LIMIT = 7_500_000;

// ai.knowledgeSource.type.*, plus the system quick-replies source (common "Quick Replies").
const typeLabel: Record<KnowledgeSourceType, string> = {
  quickReplies: "Quick replies",
  file: "File",
  website: "Website",
  manual_input: "Manual Input",
};

const setEnabled = (id: string, enabled: boolean) =>
  updateDemo((s) => ({ ...s, knowledgeSources: s.knowledgeSources.map((k) => (k.id === id ? { ...k, enabled } : k)) }));

const columns: Column<KnowledgeSource>[] = [
  { label: "Status", width: 70, cell: (k) => <StatusSwitch label={`${k.name} status`} checked={k.enabled} onCheckedChange={(v) => setEnabled(k.id, v)} /> },
  { label: "Source name", width: 140, cell: (k) => <span title={k.name}>{k.name}</span> },
  {
    label: "Sources",
    width: 200,
    cell: (k) =>
      // The quick-replies link leads to Settings > Quick Replies, which was never captured.
      k.type === "quickReplies" ? (
        <Inert className="block w-fit hover:opacity-80 truncate font-medium">{k.detail}</Inert>
      ) : (
        <span title={k.detail} className="block w-fit truncate font-medium">
          {k.detail}
        </span>
      ),
  },
  { label: "Source type", width: 150, cell: (k) => typeLabel[k.type] ?? "-" },
  { label: "Integrations applied", width: 240, cell: (k) => <div>{integrationsLabel(k.integrations ?? [])}</div> },
  { label: "Characters", width: 120, cell: (k) => (k.characters ? k.characters.toLocaleString("en-US") : "-") },
  { label: "Uploaded by", width: 150, cell: (k) => <PersonCell name={k.source} /> },
  { label: "Updated by", width: 120, cell: () => "-" },
  {
    label: "Status",
    width: 130,
    cell: () => (
      <div className="w-fit py-0.5 shrink-0 rounded-2xl text-center font-medium font-inter bg-green-50 text-green-600 text-[12px] px-2">Completed</div>
    ),
  },
  { label: "Created at", width: 180, cell: (k) => k.createdAt ?? "-" },
];

/** AI Agent > Train > Knowledge source (Step 9). */
export default function KnowledgeSourcePage() {
  const sources = useDemo((s) => s.knowledgeSources);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const used = sources.reduce((sum, k) => sum + (k.characters ?? 0), 0);
  const rows = sources.filter((k) => k.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Train" }, { label: "Knowledge source" }]}>
      <PageBody>
        <ListHeader
          title="Knowledge source"
          action={
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className={`${gradientButton} h-9 px-4 py-2`}>
                <Icon name="plus" variant="fas" className="text-white size-4" />
                Add knowledge source
              </SheetTrigger>
              <AddKnowledgeSourceSheet onDone={() => setOpen(false)} />
            </Sheet>
          }
        >
          <div className="flex flex-col text-gray-500 text-sm gap-2 mt-2">
            <p>Help the AI respond better by adding key info—like policies, FAQs, and details about your business, products, or services.</p>
            <p className="flex gap-1 items-center -mt-1">
              <span>Storage:</span>
              <span className="font-medium flex gap-1 items-center">{used.toLocaleString("en-US")}</span>
              <span>/</span>
              <span>{STORAGE_LIMIT.toLocaleString("en-US")}</span>
              <span>characters.</span>
            </p>
          </div>
        </ListHeader>
        <div className="flex gap-2 items-center">
          <SearchBox value={query} onChange={setQuery} />
          <FilterChip icon="file" label="Source type" />
          <FilterChip icon="link" label="Integrations" iconClassName="size-5" />
          <FilterChip icon="user" label="Created by" />
        </div>
        <div>
          <DataTable columns={columns} rows={rows} sticky />
          <Pagination className="mt-8" />
        </div>
      </PageBody>
    </ShellPage>
  );
}
