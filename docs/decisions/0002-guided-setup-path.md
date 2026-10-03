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

Status stays accepted. The intro, persona, scenarios and knowledge steps now run in the inbox onboarding's modal frame (`ModalTour` and `StepCard` in `src/components/ModalTour.tsx`) over the setup page; go live stays a page. Each step keeps its URL, and the empty and filled twins still move on first touch. "Finish later" closed the modal onto the setup page until 2026-10-03; since then it renders inert, so the modal cannot be left before go live and the setup page is only its backdrop (user decision). Skipping scenarios asks inline, in the same card, because a dialog inside a modal is avoided. The file-or-website sheet is not offered inside the modal; Knowledge Source keeps it. Since 2026-10-03 (user decision) the knowledge step asks only the policies the picked scenarios need, one per template (complaints included), and takes a file name or website URL on one inline line, saved as a source; the "Upload a file" button beside it is inert, since no file leaves the browser (user decision 2026-10-03). Since 2026-10-03 (user decision) the test step runs in the modal too: the card grew a little on every screen (sizes in `docs/measurements.md`) and the test content, readiness summary and chat, sat in its body; go live stays a page. Later the same day (user decision: no scrolling to reach the next step) the card grew again and the persona, scenario-form and test screens went to two columns, with the reply-steps editor and the chat thread scrolling inside themselves, so no screen's body scrolls (sizes in `docs/measurements.md`). The first sizing fitted a desktop window only; on a laptop the whole card overflowed and the page scrolled, so the card was sized again for a laptop window (`docs/measurements.md`), and it is capped at the window's height with the title and footer fixed, so a shorter window scrolls the middle only (user decision, same day). Go live joined the modal the same day (user decision), in two columns like the others; only the end-of-demo page stands outside it. The card has a colour-coded step bar at its top and one size for every screen, so the footer does not move between steps. Continue on an empty form fills it, like touching a field. Picking a template in the modal opens that template's prefilled scenario form in the same card, as the live app's sheet does, and creating it adds the scenario row and returns to the cards. The sheet's "Manual entry" card is on the step too (user decision 2026-10-03): it opens the empty form, which fills itself in on first touch or on Create like the other empty forms (user decision 2026-10-03), and the scenarios it creates count on the card.

Why: the user wanted the first AI Agent click to feel like the product's existing onboarding pop-ups; go live stayed a page until 2026-10-03 because a modal suits short, focused steps (user decision, 2026-10-02).

## Amendment, 2026-10-03: go-live publishes the flow

Status stays accepted. In the live app the agent answers customers only through Flow Builder's "Let AI handle" block: the AI Agent section's Deploy entry and the Test page's callout both say so, and nothing goes live until such a flow is published. The go-live step now shows the flow it publishes (trigger, "Let AI handle" with the chosen share, "Assign to" the team) as a plain list under the share, names it, and the done page names it too. Switching the agent off is described as pausing that flow, not as a click on the AI Agent page. No step, route or Flow Builder page is added; the flow is text, and "Flow Builder" stays outside the journey (ADR 0003).

Why: the path should create the product's own go-live mechanism for the merchant rather than hide it, which is the memo's argument for every other step (user decision, 2026-10-03).

## Alternatives considered

| Rejected | Why | Whose decision |
|---|---|---|
| Knowledge before scenarios (the live app's order) | Loses the scenario-derived policy checklist; see the memo | User |
| Gating other features behind finishing the path, in the proposal | Adds a restriction to features that exist today; the reward for finishing is the live agent | User |
| Making the path mandatory, in the proposal | Contradicts the campaign-season finding (merchants must be able to leave) and hides the exit rate | User |
| Renaming the live app's "Set command" page | Out of scope; only the path uses "Scenarios" | User |
| All five steps in the modal | The test chat and go-live do not fit a modal | User |
| A sixth "Deploy" step mirroring the live Deploy page | That page was never captured, so it would be drawn blind; the memo's path has five steps | User |
| The Flow Builder canvas as the go-live screen | Reopens ADR 0003 and reinstalls the dependency it removed | User |

## Amendment, 2026-10-03: the inbox points at the path

After sign-up a viewer may click around the inbox instead of starting. A small "Start the demo here" callout beside the rail's AI Agent entry, with an arrow at it, links to the setup until the first step is done (user decision). It is positioned against the entry's measured box, since the rail's item list clips what overflows it, and it is gone the moment a step is done or the agent is live.
