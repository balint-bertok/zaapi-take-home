import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Inert } from "@/components/Inert";
import { DialogClose, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SheetFrame } from "@/components/ui/sheet";
import { Icon, type IconName } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { createPath } from "./automation";

type Template = {
  title: string;
  description: string;
  icon: IconName;
  tile: string;
  badge?: "facebook" | "instagram";
  to?: string;
};

// Sections, cards, icons and texts as in the saved "Create new automation" sheet. Only "Assign to
// agents" has a captured target; the other cards render through <Inert>.
const indigo = "bg-indigo-50 text-indigo-500";
const categories: { title: string; templates: Template[] }[] = [
  {
    title: "Team Collaboration",
    templates: [
      {
        title: "Assign to agents",
        description: "Auto assignment based on pre-configured rules to specific team.",
        icon: "rotate",
        tile: "bg-pink-50 text-pink-500",
        to: createPath,
      },
    ],
  },
  {
    title: "Automatic messages",
    templates: [
      {
        title: "Greeting message",
        description: "Reply with a greeting when someone messages you for the first time.",
        icon: "message-smile",
        tile: indigo,
      },
      {
        title: "Out of hours message",
        description: "Reply to messages outside business hours.",
        icon: "clock",
        tile: indigo,
      },
      {
        title: "Closing message",
        description: "Send a message into the ticket when an agent marks it as closed",
        icon: "circle-check",
        tile: indigo,
      },
      {
        title: "Reply to Facebook comment",
        description: "Respond to comments with a Facebook reaction, public reply, or inbox message.",
        icon: "comment-check",
        tile: indigo,
        badge: "facebook",
      },
      {
        title: "Reply to Instagram comment",
        description: "Respond to comments with a public reply, or inbox message.",
        icon: "comment-check",
        tile: indigo,
        badge: "instagram",
      },
    ],
  },
  {
    title: "Ticket Management",
    templates: [
      {
        title: "Assign labels to conversations",
        description: "Automatically create labels for customers’ conversations with keywords.",
        icon: "tag",
        tile: "bg-success-50 text-success-500",
      },
    ],
  },
];

const ALL = "All templates";
const chip = "border border-gray-200 flex items-center justify-center px-4 py-1.5 rounded-[100px] hover:bg-gray-100";
const card =
  "bg-white border border-gray-200 h-full flex flex-col gap-y-4 pb-6 px-4 pt-4 relative rounded-lg shadow-xs text-left hover:border-electric-green-500 hover:ring-[3px] hover:ring-electric-green-500/20 transition-all duration-300 ease-in-out";

function TemplateCard({ t }: { t: Template }) {
  const body: ReactNode = (
    <>
    <div className={cn("flex items-center justify-center p-3 rounded-lg h-[64px] w-[64px] relative", t.tile)}>
      <Icon name={t.icon} variant="fas" className="size-7!" />
      {t.badge && (
        <img
          alt={`${t.badge} icon`}
          src={asset(`images/channels/${t.badge}.svg`)}
          className="absolute bottom-0 right-0 size-[20px]"
        />
      )}
    </div>
    <div>
      <div className="font-medium text-gray-800 text-sm">{t.title}</div>
      <div className="mt-2 text-gray-500 text-sm">{t.description}</div>
    </div>
    </>
  );
  return (
    <div className="min-w-56">
      {t.to ? (
        <Link to={t.to} className={cn(card, "cursor-pointer")}>
          {body}
        </Link>
      ) : (
        <Inert className={cn(card, "w-full")}>{body}</Inert>
      )}
    </div>
  );
}

/** The "Create new automation" sheet: category chips on the left filter the template sections. */
export function TemplatePicker() {
  return (
    <SheetFrame className="gap-4 max-w-[990px] w-3/4">
      <PickerBody />
    </SheetFrame>
  );
}

// Inside SheetFrame, which unmounts on close, so every reopen starts at "All templates".
function PickerBody() {
  const [category, setCategory] = useState(ALL);
  const shown = category === ALL ? categories : categories.filter((c) => c.title === category);
  return (
    <>
      <div className="flex flex-col space-y-2 text-left px-6 pt-4">
        <DialogTitle className="font-semibold text-gray-800 text-lg">Create new automation</DialogTitle>
        <DialogDescription className="text-gray-500 text-sm">
          If you don't know where to start, try our templates or read{" "}
          <Inert className="underline">how to create new automation</Inert>.
        </DialogDescription>
      </div>
      <div className="border-t border-gray-200 flex flex-1 overflow-hidden">
        <div className="border-r border-gray-200 p-6 hidden md:block md:min-w-[215px]">
          <p className="font-medium text-light-black">Templates</p>
          <div className="flex flex-col gap-y-3 items-start mt-4">
            {[ALL, ...categories.map((c) => c.title)].map((title) => (
              <button
                key={title}
                type="button"
                aria-pressed={title === category}
                onClick={() => setCategory(title)}
                className={cn(chip, title === category ? "bg-gray-100" : "bg-white")}
              >
                <span className="font-medium text-gray-800 text-sm">{title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-y-10 overflow-y-auto p-6">
          {shown.map((c) => (
            <section key={c.title} className="bg-white p-4 rounded-xl shadow-small flex flex-col gap-y-4">
              <div>
                <p className="font-medium text-light-black mb-4">{c.title}</p>
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {c.templates.map((t) => (
                    <TemplateCard key={t.title} t={t} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
      <DialogClose className="absolute flex right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden">
        <Icon name="x" className="size-4! m-auto" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </>
  );
}
