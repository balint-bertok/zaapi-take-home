import { useSearchParams } from "react-router";
import { Rail } from "@/shell/Rail";
import { GetStartedCard, OnboardingModals } from "../auth/onboarding";
import { useDemo } from "@/store/store";
import { asset } from "@/lib/asset";
import { Conversation } from "./Conversation";
import type { Ticket } from "./fixtures";
import { DetailsPanel } from "./DetailsPanel";
import { TicketList } from "./TicketList";
import { TicketsSidebar } from "./TicketsSidebar";

/**
 * The inbox at `/tickets?inbox=all&ticketId=…`, as app.zaapi.com addresses it. It brings its
 * own section menu (icons, live counts) next to the shared rail, so the route uses the banner-only
 * layout; the frame below mirrors ShellLayout.
 */
const none: Ticket[] = [];

export default function TicketsPage() {
  const [params, setParams] = useSearchParams();
  // Before onboarding the workspace has no conversation yet (as in the captured first visit, where
  // the empty card sits behind the modals); the visitor's ticket is there once onboarding is done.
  const onboarded = useDemo((s) => s.onboardingDone);
  const all = useDemo((s) => s.tickets);
  const tickets = onboarded ? all : none;
  const selected = tickets.find((t) => t.id === params.get("ticketId")) ?? null;

  return (
    <div className="flex bg-sidebar">
      <OnboardingModals />
      <div className="shrink-0 w-[296px]" />
      <Rail section="tickets" />
      <TicketsSidebar tickets={tickets} />
      <section className="rounded-lg border border-gray-200 bg-(--content-area-background) shadow-medium grow relative overflow-hidden mr-(--content-area-margin) my-[calc(var(--content-area-margin)-2px)]">
        <main className="flex w-full h-(--height-page-content-with-banner)">
          <div className="flex-[30.362_1_0px] min-w-0">
            <TicketList
              tickets={tickets}
              selectedId={selected?.id ?? null}
              onSelect={(id) => setParams({ inbox: "all", ticketId: id })}
            />
          </div>
          <div role="separator" className="w-px shrink-0 bg-gray-200" />
          <div className="flex-[69.638_1_0px] min-w-0 flex bg-white">
            {selected ? (
              <>
                <Conversation ticket={selected} />
                <DetailsPanel ticket={selected} />
              </>
            ) : onboarded ? (
              <NoTicketSelected />
            ) : (
              <GetStartedCard />
            )}
          </div>
        </main>
      </section>
    </div>
  );
}

/**
 * The chat pane with no ticket open (common["Start Chatting!"]). The app shows a grey Zaapi bolt
 * image that was not saved; this is the logo's bolt, desaturated and lightened to match it.
 */
function NoTicketSelected() {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center select-none">
      <div className="text-center">
        <svg width="144" height="144" role="img" aria-label="Start Chatting" className="pointer-events-none">
          {/* Maps the teal bolt's luminance onto the grey-blue ramp sampled from the app's image. */}
          <filter id="zaapi-symbol-gray" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values=".193 .649 .065 0 .129  .178 .599 .060 0 .205  .138 .466 .047 0 .366  0 0 0 1 0"
            />
          </filter>
          <svg x="33" y="21" width="77" height="103" viewBox="58 40 180 240">
            <image href={asset("images/logo.png")} width="684" height="323" filter="url(#zaapi-symbol-gray)" />
          </svg>
        </svg>
      </div>
      <div className="text-gray-300 mt-4 ml-2 text-center font-medium tracking-wide">Select a customer to open the ticket</div>
    </div>
  );
}
