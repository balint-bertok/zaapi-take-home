import { useNavigate } from "react-router";
import { PersonaForm, type Persona } from "./PersonaForm";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

const filled = "/ai/setup/persona/filled";
const empty: Persona = { name: "", style: "", guidelines: "", language: null };

/** Step 1, nothing entered yet. */
export default function PersonaPage() {
  const navigate = useNavigate();
  // The demo fills the form in for the viewer rather than making them type: touching any field
  // or language card moves to the filled page, carrying a picked language along.
  const fill = (patch?: Partial<Persona>) => navigate(filled, { state: patch?.language ? { language: patch.language } : undefined });
  return (
    <SetupPage
      step={1}
      title="Persona"
      description="Name your agent and decide how it sounds. Language defaults to what your customers write in."
      footer={
        <>
          <BackLink to="/ai/setup" />
          <ContinueButton to={filled} disabled />
        </>
      }
    >
      <PersonaForm value={empty} onChange={fill} onFocus={() => fill()} />
    </SetupPage>
  );
}
