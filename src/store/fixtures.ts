// Demo seed data, composed from one slice per feature so parallel feature PRs each edit only
// their own fixtures file. Names follow the fixture convention ("Brand One") or are copied from
// the reference screenshots; nothing here is real customer data.
import { aiSeed } from "../features/ai/fixtures";
import { authSeed } from "../features/auth/fixtures";
import { setupSeed } from "../features/setup/fixtures";
import { ticketsSeed } from "../features/tickets/fixtures";

export type Channel =
  | "chat-widget"
  | "facebook"
  | "instagram"
  | "line"
  | "whatsapp"
  | "shopee"
  | "lazada"
  | "tiktok-shop"
  | "gmail"
  | "outlook"
  | "shopify";

export type Integration = { id: string; channel: Channel; name: string };

/** State every section shares: who is signed in, where, with which channels and plan. */
const sharedSeed: {
  workspace: { name: string };
  user: { id: string; name: string };
  integrations: Integration[];
  aiTokens: number;
  freeTrialDaysLeft: number;
} = {
  workspace: { name: "Brand One" },
  user: { id: "user-1", name: "Balint" },
  integrations: [{ id: "integration-1", channel: "chat-widget", name: "Test (Demo)" }],
  aiTokens: 300,
  freeTrialDaysLeft: 6,
};

export const seed = { ...sharedSeed, ...authSeed, ...ticketsSeed, ...aiSeed, ...setupSeed };
export type DemoState = typeof seed;
