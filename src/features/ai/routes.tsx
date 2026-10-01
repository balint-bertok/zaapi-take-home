import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

export const aiRoutes: AppRoute[] = [
  { path: "/ai/train/knowledge-source", title: titles.ai, layout: "ai", Page: lazy(() => import("./KnowledgeSourcePage")) },
  { path: "/ai/train/scenario-handling", title: titles.ai, layout: "ai", Page: lazy(() => import("./ScenarioHandlingPage")) },
  { path: "/ai/train/personality", title: titles.ai, layout: "ai", Page: lazy(() => import("./PersonalityPage")) },
  { path: "/ai/testing", title: titles.ai, layout: "ai", Page: lazy(() => import("./TestPage")) },
];
