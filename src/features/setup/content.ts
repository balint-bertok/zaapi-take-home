// Copy and fixture values the guided setup shows. None of it comes from the catalog: the setup is
// this demo's proposal, not a captured page. Business values follow the fixture convention.
import type { IconName } from "@/icons/Icon";
import { templates, type Template } from "../ai/scenarioTemplates";

/** Go live's share options: the percentage of new conversations the agent takes. */
export const shares = [
  { value: 20, label: "1 in 5" },
  { value: 50, label: "Half" },
  { value: 100, label: "All" },
];

/** The share's label in lower case, for mid-sentence use. */
export const shareLabel = (value: number) => (shares.find((s) => s.value === value) ?? shares[0]).label.toLowerCase();

/**
 * The steps in tour order, as the step list and the intro name them. "Go live" has no SetupStep;
 * `agentLive` marks it done. The scenarios, knowledge and go-live steps each carry one of the memo's
 * features: `text` names it looking ahead, `feature` looking back, for the end-of-demo recap (user
 * decision 2026-10-04: the three features are said where they happen).
 */
const steps = [
  { label: "Persona", to: "/ai/setup/persona", step: "persona", text: "Name your agent and pick how it sounds and which language it answers in." },
  {
    label: "Scenarios",
    to: "/ai/setup/scenarios",
    step: "scenarios",
    text: "Pick what the agent should handle, from ready-made templates. This decides what we ask next.",
    feature: "Scenarios came before knowledge, so the knowledge step asked only for the policies those scenarios need.",
  },
  {
    label: "Knowledge",
    to: "/ai/setup/knowledge",
    step: "knowledge",
    text: "Check the policy answers we drafted from your Helpdesk chat history.",
    feature: "Those answers were drafted from the Helpdesk chat history, not typed onto a blank page.",
  },
  { label: "Test", to: "/ai/setup/test", step: "test", text: "See what's covered and try a conversation." },
  {
    label: "Go live",
    to: "/ai/setup/live",
    text: `Start on ${shares[0].label} conversations, widen in one click.`,
    feature: `Go live defaulted to ${shares[0].label} conversations, with full volume one click away.`,
  },
] as const satisfies { label: string; to: string; step?: string; text: string; feature?: string }[];

/** A step the store marks done; derived from the table, so a row is the only place a step exists. */
export type SetupStep = Extract<(typeof steps)[number], { step: string }>["step"];
export const setupSteps: readonly { label: string; to: string; step?: SetupStep; text: string; feature?: string }[] = steps;

/** The three features, in tour order, for the end-of-demo recap. */
export const shownFeatures = setupSteps.flatMap((s) => (s.feature ? [s.feature] : []));

/** The welcome's subtitle, on the page behind the modal and in the modal itself. */
export const stepsIntro = "Five short steps, then your agent answers customers on one channel.";

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
  signature: true,
};


/**
 * Go live's "when" options: the two "AI agent" templates of Flow Builder's "Create new flow"
 * gallery, each with the flow it creates. In the live app the agent answers customers only through
 * Flow Builder's "Let AI handle" block, so go live creates that flow for the merchant and publishes
 * it; the merchant picks when it answers, not a workflow (user decision 2026-10-04: a one-parameter
 * choice is a go-live setting, not a step). `trigger` is the catalog's own condition for AI
 * handling unassigned chats, narrowed to business hours for the second option.
 */
export type FlowTemplateId = "all-new" | "out-of-hours";
export type FlowTemplate = { id: FlowTemplateId; label: string; detail: string; name: string; trigger: string };
export const flowTemplates: FlowTemplate[] = [
  {
    id: "all-new",
    label: "Always",
    detail: "Every new conversation, any time of day.",
    name: "AI handles new conversations on Test (Demo)",
    trigger: "Customer sends a new message and the ticket is unassigned",
  },
  {
    id: "out-of-hours",
    label: "Outside business hours",
    detail: "Only when your team is away.",
    name: "AI handles out-of-hours conversations on Test (Demo)",
    trigger: "Customer sends a new message outside business hours and the ticket is unassigned",
  },
];
export const flowTemplate = (id: FlowTemplateId) => flowTemplates.find((t) => t.id === id) ?? flowTemplates[0];

/**
 * The flow's blocks in order. The share is a split before the AI block, as Flow Builder's own
 * percentage split would do it (checked against the live app, 2026-10-04); the product has the
 * mechanism, the path puts a default behind it.
 */
export const flowBlocks = (flow: FlowTemplate, share: number): { icon: IconName; iconClassName: string; label: string; detail: string }[] => [
  { icon: "bolt", iconClassName: "text-gray-500", label: "Trigger", detail: flow.trigger },
  { icon: "sitemap", iconClassName: "text-gray-500", label: "Split", detail: `${shareLabel(share)} of those conversations go to the agent` },
  { icon: "ai-symbol", iconClassName: "ai-gradient-icon", label: "Let AI handle", detail: "those conversations" },
  { icon: "user-group", iconClassName: "text-gray-500", label: "Assign to", detail: "your team: the rest, and any conversation the agent hands over" },
];

/** How the agent is switched off: by pausing its flow, as in the live app. */
export const pauseNote = "Pausing the agent is one click: pause the flow in Flow Builder.";

/**
 * A policy the knowledge step asks for. `answer` is pre-filled from the merchant's Helpdesk chat
 * history: `history` is the past reply, from the team to a customer on Test (Demo), it was drawn
 * from, shown under the answer so the merchant can check it (user decision 2026-10-04: the
 * checklist no longer starts blank). Fixture values, like the rest of the step.
 */
export type Policy = {
  key: "shipping" | "returns" | "complaints";
  label: string;
  question: string;
  neededBy: Template["id"];
  answer: string;
  history: { when: string; quote: string };
};

export const policies: Policy[] = [
  {
    key: "shipping",
    label: "Shipping times and areas",
    question: "How long does delivery take, and where do you ship?",
    neededBy: "checkOrderStatus",
    answer: "Bangkok: 1-2 business days. Rest of Thailand: 2-4 business days. We do not ship outside Thailand yet.",
    history: { when: "Sep 2026", quote: "Bangkok orders arrive in 1-2 business days, the rest of Thailand in 2-4. We don't ship abroad yet, sorry!" },
  },
  {
    key: "returns",
    label: "Returns and refunds",
    question: "When can a customer return an order, and how is the refund made?",
    neededBy: "returnOrRefund",
    answer: "Returns within 14 days if unused and in the original packaging. Refunds go back to the original payment method within 5 business days of receiving the item.",
    history: { when: "Aug 2026", quote: "You can return it within 14 days if it's unused and in the original box. The refund goes back to your card within 5 business days of us receiving it." },
  },
  {
    key: "complaints",
    label: "Complaints and handover",
    question: "When should a complaint go to your team, and what should the agent say until someone takes over?",
    neededBy: "customerComplaint",
    answer: "Every complaint goes to the team straight away. Until someone takes over, the agent apologises and says a person will follow up within one business day.",
    history: { when: "Sep 2026", quote: "I'm so sorry about this. I've passed it to a colleague who will get back to you within one business day." },
  },
];

/** The policies the picked scenarios need: one per template, matched by the scenario row's name. */
export const neededPolicies = (scenarioNames: string[]) =>
  policies.filter((p) => scenarioNames.includes(templates.find((t) => t.id === p.neededBy)?.form.name ?? ""));

/** Where the inline reference goes: a URL is a website source, anything else a file. */
export const referenceType = (reference: string): "website" | "file" => (/^(https?:\/\/|www\.)/i.test(reference.trim()) ? "website" : "file");

/** What the "Manual entry" scenario form holds once "filled": a scenario the merchant might write. */
export const writtenScenario: Template["form"] = {
  name: "Opening hours",
  trigger: "When a customer asks when the shop or the support team is available, or whether someone is there right now.",
  handling: "follow_instruction",
  instruction:
    "## 1. Give the hours\n\nMonday to Saturday, 9:00 to 18:00 Bangkok time. Closed on Sundays and public holidays.\n\n## 2. Outside those hours\n\nSay when the team is back and offer to pass the question on so someone replies first thing.",
};

/** The consequence of skipping scenarios, stated when the merchant tries to. */
export const skipConsequence = "Without a scenario, refunds and complaints go to your team.";
