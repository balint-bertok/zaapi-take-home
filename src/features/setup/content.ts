// Copy and fixture values the guided setup shows. None of it comes from the catalog: the setup is
// this demo's proposal, not a captured page. Business values follow the fixture convention.
import type { IconName } from "@/icons/Icon";
import { templates, type Template } from "../ai/scenarioTemplates";
import type { SetupStep } from "./fixtures";

/** The steps in tour order, as the step list and the intro name them. "Go live" has no SetupStep; `agentLive` marks it done. */
export const setupSteps: { label: string; to: string; step?: SetupStep; text: string }[] = [
  { label: "Persona", to: "/ai/setup/persona", step: "persona", text: "Name your agent and pick how it sounds and which language it answers in." },
  { label: "Scenarios", to: "/ai/setup/scenarios", step: "scenarios", text: "Pick what the agent should handle, from ready-made templates." },
  { label: "Knowledge", to: "/ai/setup/knowledge", step: "knowledge", text: "Answer the few policy questions those scenarios need." },
  { label: "Test", to: "/ai/setup/test", step: "test", text: "See what's covered and try a conversation." },
  { label: "Workflow", to: "/ai/setup/workflow", step: "workflow", text: "Pick the flow that connects your agent to the channel, from a template." },
  { label: "Go live", to: "/ai/setup/live", text: "Start on a small share of conversations, widen when you're ready." },
];

/** The welcome's subtitle, on the page behind the modal and in the modal itself. */
export const stepsIntro = "Six short steps, then your agent answers customers on one channel.";

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

/** Go live's share options: the percentage of new conversations the agent takes. */
export const shares = [
  { value: 20, label: "1 in 5" },
  { value: 50, label: "Half" },
  { value: 100, label: "All" },
];

/** The share's label in lower case, for mid-sentence use. */
export const shareLabel = (value: number) => (shares.find((s) => s.value === value) ?? shares[0]).label.toLowerCase();

/**
 * The workflow step's templates: the two "AI agent" cards of Flow Builder's "Create new flow"
 * gallery, title and description verbatim from the saved page, each with the flow it creates. In
 * the live app the agent answers customers only through Flow Builder's "Let AI handle" block, so
 * the path creates that flow for the merchant and go live publishes it. `trigger` is the catalog's
 * own condition for AI handling unassigned chats, narrowed to business hours for the second card.
 */
export type FlowTemplateId = "all-new" | "out-of-hours";
export type FlowTemplate = { id: FlowTemplateId; title: string; description: string; icon: IconName; name: string; trigger: string };
export const flowTemplates: FlowTemplate[] = [
  {
    id: "all-new",
    title: "AI handles all new tickets",
    description: "Let the AI Agent handle all new tickets, and escalate to a human agent when it can no longer reply.",
    icon: "ai-symbol",
    name: "AI handles new conversations on Test (Demo)",
    trigger: "Customer sends a new message and the ticket is unassigned",
  },
  {
    id: "out-of-hours",
    title: "AI handles out of hours tickets",
    description: "Let the AI handle all tickets outside of business hours.",
    icon: "hourglass-clock",
    name: "AI handles out-of-hours conversations on Test (Demo)",
    trigger: "Customer sends a new message outside business hours and the ticket is unassigned",
  },
];
export const flowTemplate = (id: FlowTemplateId) => flowTemplates.find((t) => t.id === id) ?? flowTemplates[0];

/** The flow's blocks in order; "Let AI handle" takes the share picked at go live, left out before it is. */
export const flowBlocks = (flow: FlowTemplate, share?: number): { icon: IconName; iconClassName: string; label: string; detail: string }[] => [
  { icon: "bolt", iconClassName: "text-gray-500", label: "Trigger", detail: flow.trigger },
  {
    icon: "ai-symbol",
    iconClassName: "ai-gradient-icon",
    label: "Let AI handle",
    detail: share === undefined ? "the share of those conversations you pick at go live" : `${shareLabel(share)} of those conversations`,
  },
  { icon: "user-group", iconClassName: "text-gray-500", label: "Assign to", detail: "your team: the rest, and any conversation the agent hands over" },
];

/** The gallery's "Custom flow" row, verbatim; the canvas is outside the journey, so it is inert. */
export const customFlow = { title: "Custom flow", description: "Start fresh by choosing triggers, conditions, and actions to design your own flow and steps." };

/** How the agent is switched off: by pausing its flow, as in the live app. */
export const pauseNote = "Pausing the agent is one click: pause the flow in Flow Builder.";

/** One policy the agent needs, which scenario template needs it, and Brand One's answer. */
export type Policy = {
  key: "shipping" | "returns" | "complaints";
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
    key: "complaints",
    label: "Complaints and handover",
    question: "When should a complaint go to your team, and what should the agent say until someone takes over?",
    neededBy: "customerComplaint",
    answer: "Every complaint goes to the team straight away. Until someone takes over, the agent apologises and says a person will follow up within one business day.",
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
