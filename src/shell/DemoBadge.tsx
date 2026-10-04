export const demoBadgeLabel = "Demo · not the real Zaapi";

/** Corner label on every page, so the public demo cannot pass for app.zaapi.com; above the dialog overlays (z-50). */
export function DemoBadge() {
  return (
    <div className="pointer-events-none fixed top-3 right-4 z-60 rounded-full border border-amber-800/20 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 shadow-small">
      {demoBadgeLabel}
    </div>
  );
}
