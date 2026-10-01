import { useSearchParams } from "react-router";
import { Rail } from "@/shell/Rail";
import { GetStartedCard, OnboardingModals } from "../auth/onboarding";
import { useDemo } from "@/store/store";
import { Conversation } from "./Conversation";
import { DetailsPanel } from "./DetailsPanel";
import { inboxFrom, inInbox } from "./inbox";
import { TicketList } from "./TicketList";
import { TicketsSidebar } from "./TicketsSidebar";

/**
 * The inbox at `/tickets?inbox=all|closed&ticketId=…`, as app.zaapi.com addresses it. It brings its
 * own section menu (icons, live counts) next to the shared rail, so the route uses the banner-only
 * layout; the frame below mirrors ShellLayout.
 */
export default function TicketsPage() {
  const [params, setParams] = useSearchParams();
  const inbox = inboxFrom(params.get("inbox"));
  const tickets = useDemo((s) => s.tickets);
  const selected = tickets.find((t) => t.id === params.get("ticketId")) ?? null;

  return (
    <div className="flex bg-sidebar">
      <OnboardingModals />
      <div className="shrink-0 w-[296px]" />
      <Rail section="tickets" />
      <TicketsSidebar inbox={inbox} />
      <section className="rounded-lg border border-gray-200 bg-(--content-area-background) shadow-medium grow relative overflow-hidden mr-(--content-area-margin) my-[calc(var(--content-area-margin)-2px)]">
        <main className="flex w-full h-(--height-page-content-with-banner)">
          <div className="flex-[30.362_1_0px] min-w-0">
            <TicketList
              inbox={inbox}
              tickets={tickets.filter((t) => inInbox(t, inbox))}
              selectedId={selected?.id ?? null}
              onSelect={(id) => setParams({ inbox, ticketId: id })}
            />
          </div>
          <div role="separator" className="w-px shrink-0 bg-gray-200" />
          <div className="flex-[69.638_1_0px] min-w-0 flex bg-white">
            {selected ? (
              <>
                <Conversation ticket={selected} />
                <DetailsPanel ticket={selected} />
              </>
            ) : (
              <GetStartedCard />
            )}
          </div>
        </main>
      </section>
    </div>
  );
}
