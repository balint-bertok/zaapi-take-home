import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

// Pages load lazily so this table stays importable from the Playwright suites.
export const authRoutes: AppRoute[] = [
  { path: "/register", title: titles.register, layout: "auth", Page: lazy(() => import("./RegisterPage")) },
];
