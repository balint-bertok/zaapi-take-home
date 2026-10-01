import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

export const settingsRoutes: AppRoute[] = [
  { path: "/settings/billing", title: titles.settings, layout: "app", Page: lazy(() => import("./BillingPage")) },
];
