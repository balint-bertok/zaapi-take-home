import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

// The inbox renders its own section menu (icons and live counts), so it takes the banner-only
// layout and composes the rail itself. `?inbox=closed` (Completed / Closed) is the same page.
export const ticketRoutes: AppRoute[] = [
  { path: "/tickets", title: titles.inbox, layout: "canvas", Page: lazy(() => import("./TicketsPage")) },
];
