import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

// The guided path to a merchant's first live AI Agent, in tour order. The `/filled` pages are the
// same step with the form already filled in, so the tour can show both states.
export const setupRoutes: AppRoute[] = [
  { path: "/ai/setup", title: titles.ai, layout: "setup", Page: lazy(() => import("./IntroPage")) },
  { path: "/ai/setup/persona", title: titles.ai, layout: "setup", Page: lazy(() => import("./PersonaPage")) },
  { path: "/ai/setup/persona/filled", title: titles.ai, layout: "setup", Page: lazy(() => import("./PersonaFilledPage")) },
  { path: "/ai/setup/scenarios", title: titles.ai, layout: "setup", Page: lazy(() => import("./ScenariosPage")) },
  { path: "/ai/setup/knowledge", title: titles.ai, layout: "setup", Page: lazy(() => import("./KnowledgePage")) },
  { path: "/ai/setup/knowledge/filled", title: titles.ai, layout: "setup", Page: lazy(() => import("./KnowledgeFilledPage")) },
  { path: "/ai/setup/test", title: titles.ai, layout: "setup", Page: lazy(() => import("./SetupTestPage")) },
  { path: "/ai/setup/live", title: titles.ai, layout: "setup", Page: lazy(() => import("./GoLivePage")) },
  { path: "/ai/setup/live/done", title: titles.ai, layout: "setup", Page: lazy(() => import("./LiveDonePage")) },
];
