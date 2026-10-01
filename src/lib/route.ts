import type { ComponentType } from "react";

/** Document titles from the catalog's seo.metaTitle, one per page family. */
export const titles = {
  login: "Welcome to Zaapi!",
  register: "Register - Zaapi",
  inbox: "Inbox - Zaapi",
  ai: "AI training center - Zaapi",
  automations: "Automations - Zaapi",
  settings: "Settings - Zaapi",
} as const;

/** One page of the demo. `app` pages sit under the trial banner; `auth` pages stand alone. */
export type AppRoute = {
  path: string;
  title: (typeof titles)[keyof typeof titles];
  layout: "app" | "auth";
  Page: ComponentType;
};
