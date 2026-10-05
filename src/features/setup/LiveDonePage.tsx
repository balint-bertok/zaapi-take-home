import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { useDemo } from "@/store/store";
import { flowTemplate, pauseNote, shareLabel, shownFeatures } from "./content";

/**
 * After "Go live": the end of the demo. It stands alone, with nothing to click but a restart to the
 * sign-up page, which puts the demo back to its fixtures on arrival, so a viewer can run it again
 * without seeing this run's scenarios or knowledge (user decision, 2026-10-03). It recaps the three
 * features the path carried, for the memo's reader (user decision 2026-10-04: said here, outside the
 * product's own screens).
 */
export default function LiveDonePage() {
  // Opened by URL before going live, the page describes the seeded share.
  const share = useDemo((s) => s.agentShare);
  const flow = useDemo((s) => flowTemplate(s.flowTemplate));
  const navigate = useNavigate();
  const restart = () => navigate("/register");
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[560px] rounded-lg bg-white border border-gray-200 shadow-medium px-8 py-10 flex flex-col items-center text-center gap-4">
        <img alt="Zaapi" className="h-10 w-auto" src={asset("images/logo.png")} />
        <div className="size-16 rounded-full bg-(image:--color-ai-gradient-light) flex items-center justify-center">
          <Icon name="ai-symbol" className="ai-gradient-icon size-7!" />
        </div>
        <h1 className="text-2xl font-medium text-gray-800">Your agent is live. That's the end of the demo.</h1>
        <p className="text-sm text-gray-500">
          It answers {shareLabel(share)} of the new conversations on Chat Widget for Test (Demo), through the flow “{flow.name}”. {pauseNote}
        </p>
        <section className="w-full rounded-lg bg-gray-50 px-5 py-4 text-left">
          <h2 id="shown" className="text-sm font-medium text-gray-800">
            What this demo showed
          </h2>
          <ol aria-labelledby="shown" className="mt-2 space-y-1.5 text-sm text-gray-600 list-decimal pl-5">
            {shownFeatures.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>
        <p className="text-sm text-gray-500">Nothing from this run is kept. Start again to walk the journey from sign-up with a fresh workspace.</p>
        <Button variant="ai" onClick={restart} className="mt-2">
          Start again from sign-up
        </Button>
      </div>
    </main>
  );
}
