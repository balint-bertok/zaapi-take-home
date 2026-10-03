import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

// One page behind the setup modal's eight URLs, so it stays mounted while the modal moves on.
const homePage = lazy(() => import("./SetupHomePage"));

// The guided path to a merchant's first live AI Agent, in tour order. Every step, welcome through
// go live, is a screen of the setup modal (SetupModal, mounted by SetupShell) over one page; the done
// page stands alone. The `/filled` URLs are the same step with the form already filled in, so the
// tour can show both states.
export const setupRoutes: AppRoute[] = [
  { path: "/ai/setup", title: titles.ai, layout: "setup", Page: homePage },
  { path: "/ai/setup/persona", title: titles.ai, layout: "setup", Page: homePage },
  { path: "/ai/setup/persona/filled", title: titles.ai, layout: "setup", Page: homePage },
  { path: "/ai/setup/scenarios", title: titles.ai, layout: "setup", Page: homePage },
  { path: "/ai/setup/knowledge", title: titles.ai, layout: "setup", Page: homePage },
  { path: "/ai/setup/knowledge/filled", title: titles.ai, layout: "setup", Page: homePage },
  { path: "/ai/setup/test", title: titles.ai, layout: "setup", Page: homePage },
  { path: "/ai/setup/live", title: titles.ai, layout: "setup", Page: homePage },
  // The end of the demo stands alone: no rail, no step list, only the way back to sign-up.
  { path: "/ai/setup/live/done", title: titles.ai, layout: "auth", Page: lazy(() => import("./LiveDonePage")) },
];
