# 0002: A guided setup path for the first AI Agent, with the dashboard gated until go-live

- Date: 2026-10-02
- Status: accepted
- Decided by: the user, on the memo's proposal (step order, step naming, scope) and on how the demo tours it (navigable from sign-up to a live agent only).
- Code it touches: `src/features/setup/`, the `setup` layout in `src/lib/route.ts` and `src/App.tsx`, the rail gate in `src/shell/Rail.tsx`, the `scenarioTemplates.ts` and `TestChat.tsx` extractions under `src/features/ai/`.

## Context

The memo to leadership proposes one product change: a guided path to a merchant's first live agent, because the live app's six setup steps are side-nav pages that never say which order to do them in, which are required, or when the agent is ready. The demo exists to show that proposal. None of its pages was captured from app.zaapi.com, because none exists there; the live app's "Enable" page was never captured either (ADR 0001: uncaptured pages are not built), so go-live is drawn fresh in the app's own style.

## Decision

- **Step order is persona, scenarios, knowledge, test, go live.** Scenarios come before knowledge on purpose: the knowledge step then asks only for the policies the picked scenarios need, which is the mechanism the memo relies on. The step is labelled "Scenarios", the term the memo uses; the live app's "Set command" name is not reused.
- **Each form state is its own route.** An empty page and a `/filled` twin, so the route-walk and no-network suites cover both and browser Back works. Focusing a field on the empty page moves to the filled one: the demo fills the form in for the viewer rather than making them type.
- **Existing content is reused, not rebuilt.** The three scenario templates, the knowledge sheet and the test chat are the live app's own; the path changes where they appear. Continue on a step appends to the existing store slices, so the Personality, Scenario Handling and Knowledge Source pages show what the path created.
- **The tour is gated.** Until `agentLive` is set, the rail's AI Agent entry leads to the path and every section but Tickets renders inert; the step list links only to done steps and the current one; the memo's "skip the setup" exit is shown but inert. Go-live opens everything. This is the opposite of the memo's rule for the real product (the path is default-on, nothing is gated behind it); it is a demo-tour constraint so a viewer cannot get lost (user decision, 2026-10-02).
- **Copy on these pages is not from the catalog** and is listed as such in the PR; business values follow the fixture convention.

## Consequences

- `?reset=1` restores the path, as it restores onboarding.
- The e2e suites that open other sections by URL are unaffected; only rail clicks are gated.
- A viewer who knows the product will not find these pages on app.zaapi.com; `docs/fidelity.md` carries the waiver.

## Amendment, 2026-10-02: hybrid modal

Status stays accepted. The intro, persona, scenarios and knowledge steps now run in the inbox onboarding's modal frame (`ModalTour` and `StepCard` in `src/components/ModalTour.tsx`) over the setup page; test and go live stay pages. Each step keeps its URL, and the empty and filled twins still move on first touch. "Finish later" closes the modal onto the setup page, and the page's button (at the first step not done) or the step list reopens it. Skipping scenarios asks inline, in the same card, because a dialog inside a modal is avoided. The file-or-website sheet is not offered inside the modal; Knowledge Source keeps it.

Why: the user wanted the first AI Agent click to feel like the product's existing onboarding pop-ups; the heavier steps stay pages because a modal suits short, focused steps (user decision, 2026-10-02).

## Alternatives considered

| Rejected | Why | Whose decision |
|---|---|---|
| Knowledge before scenarios (the live app's order) | Loses the scenario-derived policy checklist; see the memo | User |
| Gating other features behind finishing the path, in the proposal | Adds a restriction to features that exist today; the reward for finishing is the live agent | User |
| Making the path mandatory, in the proposal | Contradicts the campaign-season finding (merchants must be able to leave) and hides the exit rate | User |
| Renaming the live app's "Set command" page | Out of scope; only the path uses "Scenarios" | User |
| All five steps in the modal | The test chat and go-live do not fit a modal | User |
