import { Link } from "react-router";
import { Inert } from "@/components/Inert";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { ShellPage } from "@/shell/ShellPage";
import { TestChat } from "./TestChat";

/** AI Agent > Test (Step 14): a scripted test chat. Nothing is sent anywhere. */
export default function TestPage() {
  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Test" }]} className="pb-7">
      {/* The app paints /images/ai-gradient-bg.png (cover, top left) on the scroll container. That
          file was not saved; this one is a low-resolution resampling of the live image, scaled up
          the same way. It is absolute against the shell's content card (the nearest positioned
          ancestor), so it stays put while the page scrolls, as the original does. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-cover bg-left-top"
        style={{ backgroundImage: `url(${asset("images/ai-gradient-bg.png")})` }}
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

        <TestChat />
      </div>
    </ShellPage>
  );
}
