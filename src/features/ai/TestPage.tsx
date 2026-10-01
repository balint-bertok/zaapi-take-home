import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Inert } from "@/components/Inert";
import { Button, buttonClass } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { ShellPage } from "@/shell/ShellPage";
import { AiAvatar } from "./AiAvatar";

type Message = { id: number; from: "customer" | "ai"; text: string };

// The two exchanges on screen in Step 14, verbatim from the saved page.
const seed: Message[] = [
  { id: 1, from: "customer", text: "Hello, I had a question" },
  { id: 2, from: "ai", text: "Hello! It is great to hear from you again. Please let me know how I can assist you today." },
  { id: 3, from: "customer", text: "what kind of products are available?" },
  {
    id: 4,
    from: "ai",
    text: "Hello again. I would be happy to provide an overview of our product offerings. Please note that all of our products are registered with the Thai FDA.\n\nCleansers: Rice Water Gentle Gel Cleanser, Mung Bean Clay Foam, and Melting Cleansing Balm.\n\nToners & Essences: Thai Tea Tree Calming Toner and Hydra-Boost Ceramide Essence.\n\nSerums: Glow 10% Niacinamide + Zinc Serum, Bright Vit C 15% Serum, Night Renew Retinal Serum 0.05%, and Centella Rescue Ampoule.\n\nMoisturizers: Cloud Water Gel Moisturizer and Barrier Repair Ceramide Cream.\n\nSun Protection: Daily Shield Invisible Sunscreen SPF50+ PA++++ and Mineral Tone-Up Sunscreen SPF50 PA+++.\n\nTreatments: Acne Spot Patch and Gentle Exfoliating Night Toner.\n\nSets & Bundles: Starter Routine Set, Oily Skin Hero Set, Sensitive Skin Rescue Set, and Travel Mini Kit.\n\nPlease let me know if you would like more details on any of these products.",
  },
];

// Scripted answers for anything typed in the demo, used in turn. Not from the catalog.
const cannedReplies = [
  "Thank you for your message! Could you share a few more details so I can help you better?",
  "Happy to help. All of our products are registered with the Thai FDA. Is there a specific product you would like to know more about?",
  "Thanks for reaching out. If you would like to speak with a member of our team, just let me know and I will pass your message on.",
];

const TYPING_DELAY_MS = 600;

const bubble = "py-2 px-3 w-fit text-sm rounded-xl";

/** Trash icon beside a bubble, shown while its row is hovered. */
function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Delete message"
      className="disabled:cursor-not-allowed mb-1.5 group-hover:opacity-80 opacity-0 focus-visible:opacity-80 transition-all duration-300"
      onClick={onClick}
    >
      <Icon name="trash" className="size-4 text-gray-800" />
    </button>
  );
}

/** Steps of the AI's reasoning, with the labels of common.aiReasoning. Content is illustrative. */
function Thinking({ question }: { question: string }) {
  const steps = [
    { title: "Retrieve knowledge", label: "Query", value: question },
    { title: "Generate response", label: "Used contexts", value: "Knowledge source" },
    { title: "Send response", label: "Output", value: "AI reply" },
  ];
  return (
    <div className="rounded-lg bg-white/70 p-3 space-y-2 text-gray-800">
      <div className="font-medium">AI thinking</div>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.title}>
            <div className="text-xs text-gray-400">
              Step {i + 1} · Action
            </div>
            <div className="font-medium">{s.title}</div>
            <div className="text-gray-500">
              {s.label}: {s.value}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AiMessage({ text, question, onDelete }: { text: string; question: string; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-end self-end flex-row-reverse gap-2 max-w-[60%] group">
      <AiAvatar />
      <div>
        <div className={cn("space-y-[12px] bg-(image:--color-ai-gradient-light) text-gray-800", bubble)}>
          <p className="whitespace-pre-line ai-gradient-text">{text}</p>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="font-inter text-sm text-gray-400 hover:text-gray-500 group/reasoning-btn flex items-center gap-1"
          >
            <Icon name="thought-bubble" className="size-3.5 text-gray-400 group-hover/reasoning-btn:text-gray-500" />
            Show thinking
          </button>
          {open && <Thinking question={question} />}
        </div>
      </div>
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

function CustomerMessage({ text, onDelete }: { text: string; onDelete: () => void }) {
  return (
    <div className="flex items-end gap-2 max-w-[60%] group">
      <div className={cn("whitespace-pre-line bg-gray-100 text-gray-800", bubble)}>{text}</div>
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

function Typing() {
  return (
    <div role="status" aria-label="AI agent is typing" className="flex items-end self-end flex-row-reverse gap-2">
      <AiAvatar />
      <div className={cn("flex gap-1 py-3 bg-(image:--color-ai-gradient-light)", bubble)}>
        {[0, 150, 300].map((delay) => (
          <span key={delay} className="size-1.5 rounded-full bg-electric-green-500 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </div>
  );
}

/** The tall message box with the send button; owns the draft so typing re-renders only itself. */
function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [draft, setDraft] = useState("");
  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }
  return (
    <form className="px-4 pb-4 relative" onSubmit={send}>
      <Textarea
        aria-label="Message"
        className="h-28 bg-white/80 resize-none pr-10"
        placeholder="Type a message..."
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) send(e);
        }}
      />
      <div className="absolute right-6 flex items-center gap-2 top-2">
        <Button type="submit" variant="ghost" size="icon" aria-label="Send">
          <Icon name="paper-plane-top" className="ai-gradient-icon size-5!" />
        </Button>
      </div>
    </form>
  );
}

/** AI Agent > Test (Step 14): a scripted test chat. Nothing is sent anywhere. */
export default function TestPage() {
  const [messages, setMessages] = useState<Message[]>(seed);
  const [autoResponse, setAutoResponse] = useState(true);
  const [typing, setTyping] = useState(false);
  const nextId = useRef(seed.length + 1);
  const replies = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const thread = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  // Follow new messages, but open on the start of the seeded conversation as the screenshot does.
  const shown = useRef(seed.length);
  useEffect(() => {
    if (typing || messages.length > shown.current) thread.current?.scrollTo({ top: thread.current.scrollHeight });
    shown.current = messages.length;
  }, [messages, typing]);

  const add = (from: Message["from"], text: string) => setMessages((m) => [...m, { id: nextId.current++, from, text }]);

  function send(text: string) {
    add("customer", text);
    if (!autoResponse) return;
    setTyping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      add("ai", cannedReplies[replies.current++ % cannedReplies.length]);
      setTyping(false);
    }, TYPING_DELAY_MS);
  }

  function clear() {
    window.clearTimeout(timer.current);
    setTyping(false);
    setMessages([]);
  }

  const remove = (id: number) => setMessages((m) => m.filter((x) => x.id !== id));
  // The question each AI reply answers: the latest customer message above it.
  const questions: string[] = [];
  for (const m of messages) questions.push(m.from === "customer" ? m.text : (questions.at(-1) ?? ""));

  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Test" }]} className="pb-7">
      {/* Stands in for the app's /images/ai-gradient-bg.png, which was not saved with the page. The app
          paints it on the scroll container; here it is absolute against the shell's content card (the
          nearest positioned ancestor), so it stays put while the page scrolls, as the original does. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 80% at 100% 100%, rgba(30, 209, 187, 0.45) 0%, rgba(60, 180, 220, 0.22) 40%, transparent 100%), radial-gradient(35% 45% at 100% 55%, rgba(94, 64, 225, 0.07) 0%, transparent 100%), radial-gradient(35% 40% at 40% 65%, rgba(30, 209, 187, 0.06) 0%, transparent 100%)",
        }}
      />
      {/* Positioned so the page paints above the gradient layer. */}
      <div className="relative space-y-8">
        <section>
          <h1 className="text-2xl font-medium">Test your AI agent</h1>
          <p className="text-sm text-gray-500 mt-2">
            Your AI agent's abilities will depend on the knowledge sources you provide and the scenarios you train it on.{" "}
            {/* Help-centre article, outside the demo. */}
            <Inert className="underline">Learn more about AI agent</Inert>
          </p>
        </section>

        <div className="p-3.5 rounded-md text-sm border-l-4 bg-(image:--color-ai-gradient-light) border-electric-green-500" role="alert">
          <div className="flex flex-row gap-2">
            <div className="mt-[2px]">
              <Icon name="ai-symbol" className="size-5! ai-gradient-icon shrink-0" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="ai-gradient-text">
                Activate AI by adding the ‘Let AI handle’ block in Flow Builder or by using one of our templates.{" "}
                <Link className="border-b border-purple-600" to="/automations/flows">
                  Go to Flow Builder
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white/70 backdrop-blur-md flex flex-col mx-auto max-w-[990px] h-[720px] rounded-lg border border-gray-100">
          <div className="flex flex-col flex-1 overflow-auto">
            <div className="p-4 flex justify-between">
              {/* Account picker: one integration exists and its list was never captured. */}
              <Inert className={cn(buttonClass("outline"), "w-[320px] justify-start")}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="relative size-5">
                      <img alt="Test (Demo)" className="rounded-full object-cover size-5" src={asset("images/default-chat-account.png")} />
                      <img alt="widget icon" className="absolute -right-1 -bottom-1 size-3" src={asset("images/channels/chat-widget.svg")} />
                    </div>
                    <div className="ml-3 font-medium">Test (Demo)</div>
                  </div>
                  <Icon name="angles-up-down" className="h-4 w-4" />
                </div>
              </Inert>
              <div className="flex items-center gap-4">
                <Tooltip content="If enabled, the AI agent will automatically generate a response when a customer message is sent.">
                  <div className="flex items-center gap-1.5">
                    <Switch id="autoResponse" checked={autoResponse} onCheckedChange={setAutoResponse} />
                    <label htmlFor="autoResponse" className="text-sm text-gray-700 whitespace-nowrap cursor-pointer">
                      AI auto-response
                    </label>
                  </div>
                </Tooltip>
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={clear}>
                  <Icon name="rotate-right" className="size-3.5 text-gray-500" />
                  Clear
                </Button>
              </div>
            </div>
            <div ref={thread} className="flex flex-col gap-2 flex-1 overflow-auto pt-3 p-4">
              {messages.map((m, i) =>
                m.from === "customer" ? (
                  <CustomerMessage key={m.id} text={m.text} onDelete={() => remove(m.id)} />
                ) : (
                  <AiMessage key={m.id} text={m.text} question={questions[i]} onDelete={() => remove(m.id)} />
                ),
              )}
              {typing && <Typing />}
              <div className="flex-1 flex items-end" />
            </div>
          </div>
          <Composer onSend={send} />
        </div>
      </div>
    </ShellPage>
  );
}
