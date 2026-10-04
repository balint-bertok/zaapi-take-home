import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";
import { setupSteps } from "./content";

// One page behind the setup modal's URLs, so it stays mounted while the modal moves on.
const homePage = lazy(() => import("./SetupHomePage"));
const modal = (path: string): AppRoute => ({ path, title: titles.ai, layout: "setup", Page: homePage });

// The guided path to a merchant's first live AI Agent, in tour order. Every step, welcome through
// go live, is a screen of the setup modal (SetupModal, mounted by SetupShell) over one page; the done
// page stands alone. The `/filled` URLs are the same step with the form already filled in, so the
// tour can show both states.
export const setupRoutes: AppRoute[] = [
  modal("/ai/setup"),
  ...setupSteps.map((s) => modal(s.to)),
  modal("/ai/setup/persona/filled"),
  modal("/ai/setup/knowledge/filled"),
  // The end of the demo stands alone: no rail, no step list, only the way back to sign-up.
  { path: "/ai/setup/live/done", title: titles.ai, layout: "auth", Page: lazy(() => import("./LiveDonePage")) },
];
