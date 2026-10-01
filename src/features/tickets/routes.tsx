import { lazy } from "react";
import { titles, type AppRoute } from "../../lib/route";

export const ticketRoutes: AppRoute[] = [
  { path: "/tickets", title: titles.inbox, layout: "app", Page: lazy(() => import("./TicketsPage")) },
];
