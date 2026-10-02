import { useNavigate } from "react-router";
import { KnowledgeForm } from "./KnowledgeForm";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

const empty = { shipping: "", returns: "", cancellations: "" };

/** Step 3, empty. The demo fills the form in for the viewer rather than making them type: focusing any answer opens the filled page. */
export default function KnowledgePage() {
  const navigate = useNavigate();
  return (
    <SetupPage
      step={3}
      title="Knowledge"
      description="Answer the policies your scenarios need. Short answers are fine; the agent fills in the wording."
      footer={
        <>
          <BackLink to="/ai/setup/scenarios" />
          <ContinueButton to="/ai/setup/test" disabled />
        </>
      }
    >
      <KnowledgeForm answers={empty} onFocus={() => navigate("/ai/setup/knowledge/filled")} />
    </SetupPage>
  );
}
