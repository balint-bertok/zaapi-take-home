import { cn } from "@/lib/cn";
import { registry } from "./registry";
import type { IconGlyph, IconStyle } from "./types";

export type IconName = keyof typeof registry;

// Style used when the caller does not name one: regular first, as most of the app's chrome is far.
const fallbackOrder: IconStyle[] = ["far", "fas", "fal", "fak"];

type Props = { name: IconName; variant?: IconStyle; className?: string };

/**
 * One saved Font Awesome glyph as inline SVG. Carries the real `svg-inline--fa` class, whose
 * unlayered rule in index.css (copied from the saved pages) beats non-important Tailwind sizes,
 * exactly as on app.zaapi.com; that is why the saved markup writes `size-4.5!` where size matters.
 */
export function Icon({ name, variant, className }: Props) {
  const styles: Partial<Record<IconStyle, IconGlyph>> = registry[name];
  const glyph = (variant && styles[variant]) || styles[fallbackOrder.find((s) => styles[s])!]!;
  return (
    <svg viewBox={glyph.viewBox} aria-hidden="true" focusable="false" className={cn("svg-inline--fa", className)}>
      {glyph.paths.map((p, i) => (
        <path key={i} fill="currentColor" d={p.d} opacity={p.opacity} />
      ))}
    </svg>
  );
}
