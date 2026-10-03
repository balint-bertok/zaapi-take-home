import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, buttonClass } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/menu";
import { Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
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

/**
 * The scripted test chat of AI Agent > Test (Step 14): account picker, auto-response switch, Clear,
 * the thread and the composer. Shared with the guided setup's Test step. Nothing is sent anywhere.
 * `className` overrides the frame's height where it sits inside a scrolling body (the setup modal).
 */
export function TestChat({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>(seed);
  const [autoResponse, setAutoResponse] = useState(true);
  const [picking, setPicking] = useState(false);
  // One timer per customer message awaiting its reply; the AI is "typing" while any is pending.
  const [pending, setPending] = useState(0);
  const typing = pending > 0;
  const nextId = useRef(seed.length + 1);
  const replies = useRef(0);
  const timers = useRef(new Set<number>());
  const thread = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pendingTimers = timers.current;
    return () => pendingTimers.forEach((t) => window.clearTimeout(t));
  }, []);
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
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      add("ai", cannedReplies[replies.current++ % cannedReplies.length]);
      setPending((n) => n - 1);
    }, TYPING_DELAY_MS);
    timers.current.add(t);
    setPending((n) => n + 1);
  }

  function cancelReplies() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.clear();
    setPending(0);
  }

  function toggleAutoResponse(on: boolean) {
    setAutoResponse(on);
    if (!on) cancelReplies();
  }

  function clear() {
    cancelReplies();
    setMessages([]);
  }

  const remove = (id: number) => setMessages((m) => m.filter((x) => x.id !== id));
  // The question each AI reply answers: the latest customer message above it.
  const questions: string[] = [];
  for (const m of messages) questions.push(m.from === "customer" ? m.text : (questions.at(-1) ?? ""));

  return (
    <div className={cn("relative bg-white/70 backdrop-blur-md flex flex-col mx-auto max-w-[990px] h-[720px] rounded-lg border border-gray-100", className)}>
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="p-4 flex justify-between">
          {/* Account picker: the workspace's one chat account, already selected. */}
          <Popover open={picking} onOpenChange={setPicking}>
            <PopoverTrigger className={cn(buttonClass("outline"), "w-[320px] h-[36px] justify-start")}>
              <div className="flex items-center justify-between w-full">
                <AccountLabel />
                <Icon name="angles-up-down" className="h-4 w-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="rounded-md border bg-white text-gray-800 shadow-md w-[320px] p-0">
              <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
                <div className="flex items-center border-b px-3">
                  <Icon name="magnifying-glass" variant="fal" className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    aria-label="Search"
                    placeholder="Search"
                    className="flex w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-gray-800 h-[36px]"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                  <div className="overflow-hidden p-1 text-gray-800">
                    <button
                      type="button"
                      onClick={() => setPicking(false)}
                      className="relative w-full cursor-default select-none rounded-md px-2 py-1.5 text-sm outline-hidden hover:bg-gray-100 flex items-center h-[36px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <AccountLabel bold={false} />
                        <Icon name="check" className="ml-auto h-4 w-4" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-4">
            <Tooltip content="If enabled, the AI agent will automatically generate a response when a customer message is sent.">
              <div className="flex items-center gap-1.5">
                <Switch id="autoResponse" checked={autoResponse} onCheckedChange={toggleAutoResponse} />
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
  );
}

/** The selected chat account: its avatar with the channel badge, and its name. */
export function AccountLabel({ bold = true }: { bold?: boolean }) {
  return (
    <div className="flex items-center">
      <div className="relative">
        <img alt="Test (Demo)" className="rounded-full object-cover size-[20px]" src={asset("images/default-chat-account.png")} />
        <div className="absolute -right-1 -bottom-1">
          <img alt="widget icon" className="size-[12px]" src={asset("images/channels/chat-widget.svg")} />
        </div>
      </div>
      <div className={cn("ml-3", bold && "font-medium")}>Test (Demo)</div>
    </div>
  );
}
