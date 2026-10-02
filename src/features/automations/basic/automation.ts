import { updateDemo } from "@/store/store";
import type { Automation } from "../fixtures";

export const listPath = "/automations/basic-automations";
// The only template whose create page was captured; the query value is the app's own.
export const createPath = `${listPath}/create?type=chatAssignment`;
export const editPath = (id: string) => `${createPath}&id=${encodeURIComponent(id)}`;

/** The Assign-to-agents settings with the app's defaults for anything an older saved state lacks. */
export function automationSettings(a: Automation | undefined) {
  return {
    name: a?.name ?? "",
    description: a?.description ?? "",
    integrationIds: a?.integrationIds ?? [],
    outsideHours: a?.outsideHours ?? "stop",
    preference: a?.preference ?? "round_robin_only",
    assigneeIds: a?.assigneeIds ?? [],
  } satisfies Partial<Automation>;
}

/** Replace the automations list with `update(current)`; the store's only automations writer. */
export const updateAutomations = (update: (current: Automation[]) => Automation[]) =>
  updateDemo((s) => ({ ...s, automations: update(s.automations) }));

/** A day (today by default) as an ISO date in the viewer's time zone, the shape `updatedAt` stores. */
export function today(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "2026-10-01" as the list shows it: 01/10/2026. */
export const formatDate = (iso: string) => iso.split("-").reverse().join("/");
