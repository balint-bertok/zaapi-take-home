// Copy and fixture values the guided setup shows. None of it comes from the catalog: the setup is
// this demo's proposal, not a captured page. Business values follow the fixture convention.
import type { Template } from "../ai/scenarioTemplates";
import type { SetupStep } from "./fixtures";

/** The five steps in tour order, as the step list and the intro name them. "Go live" has no SetupStep; `agentLive` marks it done. */
export const setupSteps: { label: string; to: string; step?: SetupStep; text: string }[] = [
  { label: "Persona", to: "/ai/setup/persona", step: "persona", text: "Name your agent and pick how it sounds and which language it answers in." },
  { label: "Scenarios", to: "/ai/setup/scenarios", step: "scenarios", text: "Pick what the agent should handle, from ready-made templates." },
  { label: "Knowledge", to: "/ai/setup/knowledge", step: "knowledge", text: "Answer the few policy questions those scenarios need." },
  { label: "Test", to: "/ai/setup/test", step: "test", text: "See what's covered and try a conversation." },
  { label: "Go live", to: "/ai/setup/live", text: "Start on a small share of conversations, widen when you're ready." },
];

export type Language = "Thai" | "English";
export const languages: Language[] = ["Thai", "English"];

/** The language the channel's customers write in; the persona's default, which the readiness summary checks against. */
export const channelLanguage: Language = "Thai";

/** Shown under the persona's language field: where the default comes from. */
export const languageNote = `Most customers on Test (Demo) write in ${channelLanguage}.`;

/** What the persona form holds once "filled": the merchant's own answers, suggested. */
export const personaSuggestion = {
  name: "Brand One assistant",
  style: "Friendly and concise, like a helpful shop assistant.",
  guidelines: "Keep answers short. Never promise a delivery date you don't know. Hand over to the team when a customer is upset.",
  language: channelLanguage,
};

/** Go live's share options: the percentage of new conversations the agent takes. */
export const shares = [
  { value: 20, label: "1 in 5" },
  { value: 50, label: "Half" },
  { value: 100, label: "All" },
];

/** One policy the agent needs, which scenario template needs it, and Brand One's answer. */
export type Policy = {
  key: "shipping" | "returns" | "cancellations";
  label: string;
  question: string;
  neededBy: Template["id"];
  answer: string;
};

export const policies: Policy[] = [
  {
    key: "shipping",
    label: "Shipping times and areas",
    question: "How long does delivery take, and where do you ship?",
    neededBy: "checkOrderStatus",
    answer: "Bangkok: 1-2 business days. Rest of Thailand: 2-4 business days. We do not ship outside Thailand yet.",
  },
  {
    key: "returns",
    label: "Returns and refunds",
    question: "When can a customer return an order, and how is the refund made?",
    neededBy: "returnOrRefund",
    answer: "Returns within 14 days if unused and in the original packaging. Refunds go back to the original payment method within 5 business days of receiving the item.",
  },
  {
    key: "cancellations",
    label: "Cancellations",
    question: "Can a customer cancel an order, and until when?",
    neededBy: "returnOrRefund",
    answer: "Orders can be cancelled free of charge until they are dispatched. After dispatch, the returns policy applies.",
  },
];

/** The consequence of skipping scenarios, stated when the merchant tries to. */
export const skipConsequence = "Without a scenario, refunds and cancellations go to your team.";
