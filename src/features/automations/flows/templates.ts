import type { IconName } from "@/icons/Icon";
import type { BuilderTemplate } from "./model";

// The "Create new flow" gallery, card by card in the saved page's order, strings verbatim.
// `tint` is the end colour of the preview tile's gradient; `opens` marks the two cards whose
// builder was captured, every other card renders inert.

export type CategoryKey = "ai" | "engagement" | "shopify" | "marketplace" | "conversion" | "internal";

type Glyph = { name: IconName; className: string };

export type TemplateCard = {
  title: string;
  description: string;
  icon: Glyph;
  /** A small glyph pinned to the big one (fulfilled, cancelled, failed delivery). */
  badgeIcon?: Glyph;
  tint: "teal" | "green";
  /** Channel logos beside the title: a single logo, or the overlapping marketplace stack. */
  logos?: { files: string[]; stacked: boolean; size: number };
  opens?: BuilderTemplate;
};

type TemplateGroup = { title?: string; cards: TemplateCard[] };
type TemplateSection = { key: CategoryKey; title: string; groups: TemplateGroup[] };

export const categories: { key: CategoryKey; label: string; icon?: IconName; image?: string }[] = [
  { key: "ai", label: "AI agent", icon: "ai-symbol" },
  { key: "engagement", label: "Engagement", icon: "message-smile" },
  { key: "shopify", label: "Shopify Triggers", image: "images/channels/shopify.svg" },
  { key: "marketplace", label: "Marketplace Triggers", icon: "box" },
  { key: "conversion", label: "Conversion", icon: "message-dollar" },
  { key: "internal", label: "Internal workflow", icon: "list-check" },
];

const teal = "text-electric-green-500";
const green = "text-green-500";
const shopify = { files: ["images/channels/shopify.svg"], stacked: false, size: 22 };
const marketplaces = {
  files: ["images/channels/lazada.svg", "images/channels/shopee_icon.svg", "images/channels/tiktok_shop_icon.svg"],
  stacked: true,
  size: 16,
};
const lazadaShopee = { files: ["images/channels/lazada.svg", "images/channels/shopee_icon.svg"], stacked: true, size: 16 };
const pinned = "absolute bottom-0 rounded-full border border-white -right-1 bg-white";

export const sections: TemplateSection[] = [
  {
    key: "ai",
    title: "AI agent",
    groups: [
      {
        cards: [
          {
            title: "AI handles all new tickets",
            description: "Let the AI Agent handle all new tickets, and escalate to a human agent when it can no longer reply.",
            icon: { name: "ai-symbol", className: "ai-gradient-icon" },
            tint: "teal",
            opens: "ai-handles-all-new-tickets",
          },
          {
            title: "AI handles out of hours tickets",
            description: "Let the AI handle all tickets outside of business hours.",
            icon: { name: "hourglass-clock", className: "ai-gradient-icon" },
            tint: "teal",
          },
        ],
      },
    ],
  },
  {
    key: "engagement",
    title: "Engagement",
    groups: [
      {
        cards: [
          {
            title: "Customer welcome flow",
            description: "Automatically greet customers and share resources or options to explore.",
            icon: { name: "message-smile", className: teal },
            tint: "teal",
          },
          {
            title: "LINE OA new friend welcome flow",
            description: "Automatically welcome new friends on LINE OA and share resources or options to explore.",
            icon: { name: "message-smile", className: green },
            tint: "green",
            logos: { files: ["images/channels/line.svg"], stacked: false, size: 18 },
          },
        ],
      },
    ],
  },
  {
    key: "shopify",
    title: "Shopify Triggers",
    groups: [
      {
        cards: [
          {
            title: "Shopify order placed",
            description: "Starts a flow when a new order is placed.",
            icon: { name: "box", className: green },
            tint: "green",
            logos: shopify,
          },
          {
            title: "Shopify checkout abandoned",
            description: "Starts a flow when a customer abandons their checkout.",
            icon: { name: "cart-xmark", className: green },
            tint: "green",
            logos: shopify,
          },
          {
            title: "Shopify order fulfilled",
            description: 'Starts a flow when an order\'s fulfillment status is updated to "fulfilled".',
            icon: { name: "box", className: `${green} translate-y-1` },
            badgeIcon: { name: "circle-check", className: `${green} ${pinned}` },
            tint: "green",
            logos: shopify,
          },
          {
            title: "Shopify new customer",
            description: "Starts a flow when a new customer account is created in Shopify.",
            icon: { name: "user-plus", className: green },
            tint: "green",
            logos: shopify,
          },
          {
            title: "Shopify order cancelled",
            description: "Starts a flow when an order is cancelled.",
            icon: { name: "box", className: `${green} translate-y-1` },
            badgeIcon: { name: "circle-xmark", className: `${green} ${pinned}` },
            tint: "green",
            logos: shopify,
          },
        ],
      },
    ],
  },
  {
    key: "conversion",
    title: "Conversion",
    groups: [
      {
        cards: [
          {
            title: "Lead qualification flow",
            description: "Automatically qualify new leads based on responses to relevant criteria",
            icon: { name: "check", className: teal },
            tint: "teal",
          },
        ],
      },
    ],
  },
  {
    key: "internal",
    title: "Internal workflow",
    groups: [
      {
        cards: [
          {
            title: "Assign to agents based on message content",
            description: "Route tickets to the right agents based on customer messages.",
            icon: { name: "user-headset", className: teal },
            tint: "teal",
          },
        ],
      },
    ],
  },
  {
    key: "marketplace",
    title: "Marketplace Triggers",
    groups: [
      {
        title: "Order & Delivery",
        cards: [
          {
            title: "Order confirmation message",
            description: "Send an automatic message to confirm that an order has been successfully placed.",
            icon: { name: "message-check", className: teal },
            tint: "teal",
            logos: marketplaces,
          },
          {
            title: "Order shipped status update",
            description: "Notify customers when their order has been shipped.",
            icon: { name: "cart-flatbed", className: teal },
            tint: "teal",
            logos: marketplaces,
          },
          {
            title: "Order delivered update",
            description: "Notify customers when their order has been successfully delivered.",
            icon: { name: "truck-fast", className: teal },
            tint: "teal",
            logos: marketplaces,
          },
          {
            title: "Shipment delay apology and update",
            description: "Inform customers about shipment delays and provide an updated delivery status.",
            icon: { name: "message-medical", className: teal },
            tint: "teal",
            logos: marketplaces,
          },
          {
            title: "Delivery failure follow-up",
            description: "Follow up with customers when a delivery attempt fails and provide next steps.",
            icon: { name: "truck", className: teal },
            badgeIcon: { name: "xmark", className: "text-white absolute top-2.5 left-[7px]" },
            tint: "teal",
            logos: lazadaShopee,
          },
        ],
      },
      {
        title: "Return/Refund",
        cards: [
          {
            title: "Send Return/Refund Instruction",
            description: "Provide customers with instructions for returning items or requesting a refund.",
            icon: { name: "arrows-repeat", className: teal },
            tint: "teal",
            logos: marketplaces,
          },
        ],
      },
      {
        title: "Growth & Retention",
        cards: [
          {
            title: "Payment Pending Reminder",
            description: "Remind customers to complete payment for pending orders.",
            icon: { name: "credit-card", className: teal },
            tint: "teal",
            logos: marketplaces,
          },
          {
            title: "Reply to review by ratings",
            description: "Automatically send a reply based on the customer's star rating.",
            icon: { name: "star", className: teal },
            tint: "teal",
            logos: { files: ["images/channels/lazada.svg", "images/channels/shopee_icon.svg"], stacked: false, size: 18 },
          },
        ],
      },
    ],
  },
];
