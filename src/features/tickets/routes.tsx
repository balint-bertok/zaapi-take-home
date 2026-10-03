import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

// The inbox renders its own section menu (icons and live counts), so it takes the banner-only
// layout and composes the rail itself.
export const ticketRoutes: AppRoute[] = [
  { path: "/tickets", title: titles.inbox, layout: "canvas", Page: lazy(() => import("./TicketsPage")) },
];
