import { Switch } from "@/components/ui/switch";
import type { DemoState } from "@/store/fixtures";
import { updateDemo } from "@/store/store";
import type { Column } from "./parts";

type ListKey = "knowledgeSources" | "scenarios" | "personalities";
type Row = { id: string; name: string; enabled: boolean };

/** The leading "Status" column: a gradient switch that turns the row on or off in the store. */
export function statusColumn<T extends Row>(key: ListKey): Column<T> {
  const setEnabled = (id: string, enabled: boolean) =>
    updateDemo((s) => ({ ...s, [key]: (s[key] as Row[]).map((r) => (r.id === id ? { ...r, enabled } : r)) }) as DemoState);
  return {
    label: "Status",
    width: 70,
    cell: (row) => (
      <Switch
        aria-label={`${row.name} status`}
        checked={row.enabled}
        onCheckedChange={(v) => setEnabled(row.id, v)}
        className="h-7 w-12 border-none data-[state=checked]:bg-(image:--color-ai-gradient)"
      />
    ),
  };
}
