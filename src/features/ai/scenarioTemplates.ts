// Scenario templates of the "Add scenario" sheet, shared with the guided setup's Scenarios step.
import type { IconName } from "@/icons/Icon";
import type { ScenarioHandling } from "./fixtures";

export type Template = {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  form: { name: string; trigger: string; handling: ScenarioHandling; instruction?: string };
};

// ai.scenarioTraining.templates.*, verbatim. The complaint template has no reply steps in the
// catalog: it hands the ticket to a person ("requires human interaction").
export const templates: Template[] = [
  {
    id: "checkOrderStatus",
    icon: "truck",
    title: "Check order status",
    description: "Use this scenario when a customer asks a question about the status of their order.",
    form: {
      name: "Check order status",
      trigger:
        "You said:\nWhen a customer asks about the status of their order, delivery progress, tracking information, or expected arrival date.\n\nE.g., “Where is my order?”, “Has my package shipped?”, “I want to track my order.”",
      handling: "follow_instruction",
      instruction:
        "## 1. Greet the customer politely\n\nAcknowledge their question and thank them for reaching out.\n\n## 2. Acknowledge their question and thank them for reaching out\n\nPrompt the customer to provide their order number or relevant tracking details, if not already given.\n\n## **3. Check order status**\n\nUse the provided order number to look up the order in the system. Retrieve the current status (e.g., shipped, out for delivery, delivered, delayed).\n\n## 4. Share the status clearly\n\nRespond with a friendly summary of the order status. Include key details like estimated delivery time, tracking link, or delay reason if applicable.\n\n## 5. Offer further help\n\nAsk if there’s anything else the customer needs help with before ending the conversation.",
    },
  },
  {
    id: "returnOrRefund",
    icon: "hand-holding-box",
    title: "Return or refund",
    description: "Use this scenario when a customer requests a return or a refund for their order.",
    form: {
      name: "Return or refund",
      trigger:
        "Use this scenario when a customer asks about returning a product or getting a refund for their order.\n\nE.g., “I want to return my order”, “How do I get a refund?”, “Refund request”, “Send back my purchase”",
      handling: "follow_instruction",
      instruction:
        "## 1. Greet the customer politely\n\nStart with a friendly greeting to acknowledge their message.\n\n## 2. Request relevant order information\n\nAsk for the order number and product they wish to return.\n\n## 3. Check if the item qualifies for a return/refund\n\nUse return policy rules (e.g., within 30 days, unused, original packaging).\n\n## 4. Provide clear return/refund instructions\n\nShare next steps: where to send the item, how refunds are processed, or provide a return label.\n\n## 5. Confirm once done\n\nLet the customer know you’ve submitted their request or what to expect next.",
    },
  },
  {
    id: "customerComplaint",
    icon: "user-headset",
    title: "Customer complaint",
    description: "Use this scenario when a customer lodges a complaint that requires human interaction",
    form: {
      name: "Customer complaint",
      trigger:
        "Use this scenario when a customer expresses dissatisfaction, frustration, or issues with a product, service, or experience.\nE.g., “I’m not happy with this”, “This doesn’t work”, “I want to make a complaint”, “Terrible service”, “I’m upset about my order”",
      handling: "escalate_to_human_agent",
    },
  },
];

export const scratch: Template["form"] = { name: "", trigger: "", handling: "follow_instruction" };
