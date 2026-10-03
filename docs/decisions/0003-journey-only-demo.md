# 0003: A journey-only demo, pages outside it removed

- Date: 2026-10-03
- Status: accepted
- Decided by: the user ("pages outside the journey are removed, not just made inert", 2026-10-03).
- Code it touches: `src/routes.tsx`, `src/App.tsx`, `src/lib/route.ts`, `src/shell/sections.ts`, `src/shell/Rail.tsx`, `src/shell/Banner.tsx`, `src/store/`, `src/features/auth/`, `src/features/ai/TestPage.tsx`, `src/features/setup/LiveDonePage.tsx`, `package.json`; deletes `src/features/automations/` and `src/features/settings/`.
- Reopens: ADR 0002's "Go-live opens everything". Go-live now opens the AI Agent pages; the rest of the rail stays inert.

## Context

The demo exists to show the memo's journey: register, the inbox with its two onboarding modals, the AI Agent rail icon, the guided setup, and the done page, which leads to the inbox and to Scenario Handling and can restart the journey. Login, verify-email, settings with billing, automations and the flow builder were built from the captures before the journey existed. They sat outside it: they invited a viewer to wander off the path, and they carried code, a dependency (`@xyflow/react`) and suites of their own.

## Decision

- **Removed:** the login, verify-email, settings, billing, automations and flow builder pages, with their routes, document titles, sidebar sections, store slice and e2e suites.
- **Their entry points render inert.** The rail's Automations and Settings entries join Analytics, Broadcast and Contacts as `<Inert>` items, before and after go-live; the register page's "Log in" and the Test page's "Go to Flow Builder" render through `<Inert>` with their original classes. The trial banner always shows its button, since the billing page that hid it is gone.
- **`/` and unknown URLs land on `/register`,** where the journey starts.
- **The AI Agent pages stay** (Knowledge Source, Scenario Handling, Personality, Test): the setup writes into their store slices, and the done page links to them.

## Consequences

- Fewer routes and suites; `@xyflow/react` is uninstalled. Sizes are in `docs/measurements.md`.
- The store's saved shape changed, so its localStorage key is bumped and older saved state is ignored.
- The rail gate is simpler: before go-live AI Agent leads to the setup, after it to the AI Agent pages; Tickets always links.
- `docs/fidelity.md` drops the rows for the removed pages.

## Alternatives considered

| Rejected | Why | Whose decision |
|---|---|---|
| Keep the pages but make their entry points inert | Dead code: pages no click can reach, still built, tested and maintained | User |
| Remove the AI Agent pages too | The done page and the setup's store writes need them to show what the setup created | User |
