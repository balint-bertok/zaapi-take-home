// Copy and fixture values the guided setup shows. None of it comes from the catalog: the setup is
// this demo's proposal, not a captured page. Business values follow the fixture convention.
import type { Template } from "../ai/scenarioTemplates";

export type Language = "Thai" | "English";
export const languages: Language[] = ["Thai", "English"];

/** What the persona form holds once "filled": the merchant's own answers, suggested. */
export const personaSuggestion = {
  name: "Brand One assistant",
  style: "Friendly and concise, like a helpful shop assistant.",
  guidelines: "Keep answers short. Never promise a delivery date you don't know. Hand over to the team when a customer is upset.",
  language: "Thai" as Language,
  /** Shown under the language field: where the default comes from. */
  languageNote: "Most customers on Test (Demo) write in Thai.",
};

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
