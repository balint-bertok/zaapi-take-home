// The route table. Each feature owns its list; this file only concatenates them, so parallel
// feature PRs never edit the same lines. The Playwright invariant suites walk exactly this table.
import { aiRoutes } from "./features/ai/routes";
import { authRoutes } from "./features/auth/routes";
import { setupRoutes } from "./features/setup/routes";
import { ticketRoutes } from "./features/tickets/routes";
import type { AppRoute } from "./lib/route";

export const routes: AppRoute[] = [
  ...authRoutes,
  ...ticketRoutes,
  ...aiRoutes,
  ...setupRoutes,
];
