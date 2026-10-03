import type { ComponentType } from "react";
import type { SectionKey } from "../shell/sections";

/** Document titles from the catalog's seo.metaTitle, one per page family. */
export const titles = {
  register: "Register - Zaapi",
  inbox: "Inbox - Zaapi",
  ai: "AI training center - Zaapi",
} as const;

/**
 * One page of the demo. `layout` picks the chrome around it: `auth` stands alone, `canvas` sits
 * under the trial banner only (the tickets inbox, which draws its own rail and sidebar), `setup`
 * adds the rail and the guided setup's step sidebar, a section key adds that section's rail and
 * sidebar.
 */
export type AppRoute = {
  path: string;
  title: (typeof titles)[keyof typeof titles];
  layout: "auth" | "canvas" | "setup" | SectionKey;
  Page: ComponentType;
};
