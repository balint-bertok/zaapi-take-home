import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

export const automationRoutes: AppRoute[] = [
  { path: "/automations/basic-automations", title: titles.automations, layout: "app", Page: lazy(() => import("./BasicAutomationsPage")) },
  { path: "/automations/basic-automations/create", title: titles.automations, layout: "app", Page: lazy(() => import("./CreateAutomationPage")) },
  { path: "/automations/flows", title: titles.automations, layout: "app", Page: lazy(() => import("./FlowsPage")) },
  { path: "/automations/flow-builder", title: titles.automations, layout: "app", Page: lazy(() => import("./FlowBuilderPage")) },
];
