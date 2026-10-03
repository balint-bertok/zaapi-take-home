# Testing map

Answers: which suite guards which invariant? One line per suite. Scenario detail lives in test docstrings, not here. Update only when a suite or invariant is added.

| Suite | Guards | Non-negotiable |
|---|---|---|
| `tests/e2e/no-outbound-network.spec.ts` | The built demo requests nothing outside its own origin, on every route in the table | yes |
| `tests/e2e/route-walk.spec.ts` | Every route in the table renders: 200, no console error, no page error, catalog title, no link outside the table; `/` lands on `/login` | yes |
| `tests/e2e/tickets.spec.ts` | The inbox click path on the store: select, reply, assign, close (toast, closed state, closed inbox by URL with its sidebar entry inert), reopen | no |
| Gitleaks in `.githooks/pre-commit`, `scripts/gate`, CI | No secret in git history | yes |
| `tests/e2e/flow-builder.spec.ts` | Flow Builder click path: template creates the captured graph, publish lists the flow switched on, no console error; Custom flow has only the trigger | no |
| `tests/unit/secrets.test.ts` | `.env` stays git-ignored; no credential-shaped literal in `src/` | yes |
| `tests/e2e/automations.spec.ts` | Basic Automations click paths: template sheet filter, assign-to-agents form gating, activation dialog adds an active or inactive row, search, edit, delete | no |
| `tests/e2e/auth-onboarding.spec.ts` | Prefilled register and login each land on the inbox in one click, login keeps its required-field check, both onboarding modals click through; the demo password never reaches storage or the URL; `?reset=1` brings onboarding back; the verify page, reached by URL, resends and redirects | no |
| `tests/e2e/setup-path.spec.ts` | The guided setup click path from sign-up to a live agent: the rail is gated before go-live and open after, the welcome, persona, scenarios and knowledge steps run in a modal while test and go live are pages, the modal's step bar marks the current step and the done ones, "Finish later" closes the modal and the page's Start reopens it, empty forms move to their filled twins on first touch or on Continue, picking a scenario template opens its prefilled scenario form in the same card and creating it adds the row once and checks the card, skipping scenarios states its consequence inline with no second dialog, the readiness summary reads the store, Continue appends to the personality and knowledge lists once, `?reset=1` restores the path, the done page's "start again" resets the store and lands on sign-up | no |
| `tests/e2e/ai-agent.spec.ts` | AI Agent click paths: each create sheet appends its row, the test chat replies from its script and clears | no |

`scripts/test` runs typecheck, lint (zero warnings), vitest, the production build, then Playwright against `vite preview` of that build. `scripts/gate` runs the secret scan and then `scripts/test`, locally and in CI.

Rules: no network, no clock, no live credentials in tests. Live validation is a named manual step before deploy, never in CI.
