import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Inert } from "@/components/Inert";
import { SheetFrame } from "@/components/ui/sheet";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { createFlow, type BuilderTemplate } from "./model";
import { categories, sections, type CategoryKey, type TemplateCard } from "./templates";

// Class lists from the saved "Create new flow" sheet.
const categoryButton =
  "inline-flex items-center whitespace-nowrap rounded-lg transition-all ease-(--ease-out-quart) duration-300 active:scale-[0.98] focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:opacity-100 h-9 px-4 py-2 min-w-48 text-base w-full gap-3 justify-start group hover:opacity-100 hover:text-gray-800 hover:bg-gray-100";

const tints = { teal: "235, 252, 250", green: "240, 253, 244" };
const tileBackground = (rgb: string, stop: string) =>
  `linear-gradient(112deg, rgba(255, 255, 255, 0.8) 0.12%, rgba(${rgb}, 0.8) ${stop}), linear-gradient(rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 165.25%)`;

/**
 * The right-hand "Create new flow" sheet. Two templates open the builder; the rest are inert.
 */
export function CreateFlowSheet({ trigger }: { trigger: ReactNode }) {
  const [category, setCategory] = useState<CategoryKey | "all">("all");
  const user = useDemo((s) => s.user.name);
  const navigate = useNavigate();

  const open = (template: BuilderTemplate) => navigate(`/automations/flow-builder?id=${createFlow(template, user)}`);
  const shown = category === "all" ? sections : sections.filter((s) => s.key === category);

  return (
    <DialogPrimitive.Root onOpenChange={() => setCategory("all")}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <SheetFrame className="max-w-[990px] w-3/4">
          <div className="flex flex-col text-center sm:text-left px-7 py-4 border-b space-y-1">
            <DialogPrimitive.Title className="font-semibold text-gray-800 text-lg">Create new flow</DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-gray-500 text-sm">
              If you don't know where to start, try our templates or{" "}
              <Inert className="underline cursor-pointer!">read how to create custom workflow</Inert>.
            </DialogPrimitive.Description>
          </div>
          <div className="flex flex-1 overflow-auto">
            <section className="px-5 hidden md:block py-4">
              <ul className="space-y-2">
                <li>
                  <CategoryButton active={category === "all"} onClick={() => setCategory("all")}>
                    <Icon name="shapes" variant="fal" className="size-4" />
                    All templates
                  </CategoryButton>
                </li>
                {categories.map((c) => (
                  <li key={c.key}>
                    <CategoryButton active={category === c.key} onClick={() => setCategory(c.key)}>
                      {c.icon ? (
                        <Icon name={c.icon} variant="fal" className="size-4" />
                      ) : (
                        <img alt="shopify" width={20} height={20} src={asset(c.image!)} className="-ml-1" />
                      )}
                      {c.label}
                    </CategoryButton>
                  </li>
                ))}
              </ul>
            </section>
            <section className="grow px-7 py-5 space-y-7 overflow-auto bg-gray-50">
              {category === "all" && (
                <button
                  type="button"
                  onClick={() => open("custom")}
                  className="group relative w-full transition-all flex items-center gap-4 p-4 rounded-lg bg-white shadow-none hover:shadow-small cursor-pointer"
                >
                  <div className="size-14 flex items-center rounded-lg justify-center bg-gray-50">
                    <Icon name="pencil" variant="fas" className="size-6! text-gray-500" />
                  </div>
                  <div className="flex-1 text-left text-sm">
                    <h4 className="font-medium text-gray-800 transition-colors duration-200 group-hover:text-electric-green-600">Custom flow</h4>
                    <p className="text-gray-400 font-normal mt-1 text-sm">
                      Start fresh by choosing triggers, conditions, and actions to design your own flow and steps.
                    </p>
                  </div>
                  <Icon name="arrow-right" variant="fas" className="size-4 text-gray-400 ml-auto" />
                </button>
              )}
              {shown.map((section) => (
                <div key={section.key} className="border-gray-200 rounded-lg space-y-4 bg-white border-0 p-4 shadow-none">
                  <h2 className="text-base font-medium text-gray-800">{section.title}</h2>
                  {section.groups.map((group, i) => (
                    <div key={group.title ?? i} className="space-y-4">
                      {group.title && <h3 className="text-sm font-medium text-gray-400 border-b pb-3 border-gray-200">{group.title}</h3>}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {group.cards.map((card) => (
                          <Card key={card.title} card={card} onOpen={open} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          </div>
          <DialogPrimitive.Close className="absolute flex right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden">
            <Icon name="x" className="size-4! m-auto" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
      </SheetFrame>
    </DialogPrimitive.Root>
  );
}

function CategoryButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(categoryButton, active ? "text-gray-800 bg-gray-100" : "bg-transparent text-gray-600")}
    >
      {children}
    </button>
  );
}

function Card({ card, onOpen }: { card: TemplateCard; onOpen: (t: BuilderTemplate) => void }) {
  const rgb = tints[card.tint];
  const body = (
    <>
      <div className="relative h-[140px] w-full rounded-t-lg flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 rounded-t-lg opacity-100 group-hover:opacity-0 transition-opacity duration-300"
          style={{ backgroundImage: tileBackground(rgb, "100%") }}
        />
        <div
          className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundImage: tileBackground(rgb, "40%") }}
        />
        <div className="relative z-10">
          <div className="relative">
            <Icon name={card.icon.name} variant="fas" className={cn("size-12!", card.icon.className)} />
            {card.badgeIcon && <Icon name={card.badgeIcon.name} variant="fas" className={cn("size-4!", card.badgeIcon.className)} />}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[6px] px-4 pb-4 text-left">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-gray-800 leading-4 transition-colors duration-200 group-hover:text-electric-green-600">
            {card.title}
          </h4>
          {card.logos && <Logos {...card.logos} />}
        </div>
        <p className="text-sm font-normal text-gray-500 leading-4">{card.description}</p>
      </div>
    </>
  );
  const className = "group relative transition-all flex flex-col gap-[11px] rounded-lg shadow-none bg-white";
  const opens = card.opens;
  return opens ? (
    <button type="button" className={cn(className, "cursor-pointer")} onClick={() => onOpen(opens)}>
      {body}
    </button>
  ) : (
    <Inert className={className}>{body}</Inert>
  );
}

function Logos({ files, stacked, size }: { files: string[]; stacked: boolean; size: number }) {
  const alt = (f: string) => f.split("/").pop()!.replace(/(_icon)?\.svg$/, "");
  return (
    <div className="flex items-center shrink-0">
      {files.map((f, i) =>
        stacked ? (
          <div key={f} className="rounded-full border border-white -mr-2">
            <img alt={`${alt(f)} icon`} src={asset(f)} style={{ width: size, height: size }} />
          </div>
        ) : (
          <img key={f} alt={alt(f)} width={size} height={size} src={asset(f)} className={cn("rounded-full border border-white", i > 0 && "-ml-1")} />
        ),
      )}
    </div>
  );
}
