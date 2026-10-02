import { asset } from "@/lib/asset";
import { updateDemo } from "@/store/store";
import { TestChat } from "../ai/TestChat";
import { Readiness } from "./Readiness";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

const markTested = () =>
  updateDemo((s) => (s.setupDone.includes("test") ? s : { ...s, setupDone: [...s.setupDone, "test"] }));

/** Step 4: what the agent covers so far, then the AI Agent > Test chat to try it. */
export default function SetupTestPage() {
  return (
    <SetupPage
      step={4}
      title="Test"
      description="Here's what your agent can handle so far. Try a conversation before anyone else can."
      footer={
        <>
          <BackLink to="/ai/setup/knowledge" />
          <ContinueButton to="/ai/setup/live" onClick={markTested} />
        </>
      }
    >
      {/* The AI Agent > Test page's gradient, absolute against the content card. SetupPage's title
          sits outside this page's positioned wrapper, so the layer multiplies instead of covering:
          on the near-white card it shows the gradient, over the title the text stays dark. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-cover bg-left-top mix-blend-multiply"
        style={{ backgroundImage: `url(${asset("images/ai-gradient-bg.png")})` }}
      />
      {/* Positioned so the page paints above the gradient layer. */}
      <div className="relative space-y-8">
        <Readiness />
        <TestChat />
      </div>
    </SetupPage>
  );
}
