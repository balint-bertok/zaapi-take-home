# Testing map

Answers: which suite guards which invariant? One line per suite. Scenario detail lives in test docstrings, not here. Update only when a suite or invariant is added.

| Suite | Guards | Non-negotiable |
|---|---|---|
| `tests/e2e/no-outbound-network.spec.ts` | The built demo requests nothing outside its own origin, on every route in the table | yes |
| `tests/e2e/route-walk.spec.ts` | Every route in the table renders: 200, no console error, no page error, catalog title, no link outside the table; `/` lands on `/register` | yes |
| `tests/e2e/tickets.spec.ts` | The inbox click path on the store: select, reply, assign; Close, bulk close and the Closed entry stay inert and the contact fields are read-only text | no |
| Gitleaks in `.githooks/pre-commit`, `scripts/gate`, CI | No secret in git history | yes |
| `tests/unit/secrets.test.ts` | No credential-shaped literal in `src/`, which ships to a public page | yes |
| `tests/e2e/auth-onboarding.spec.ts` | Prefilled register lands on the inbox in one click and its "Log in" control is inert, both onboarding modals click through; the demo password never reaches storage or the URL; a reload keeps onboarding done and `?reset=1` brings it back; `/` lands on register | no |
| `tests/e2e/setup-path.spec.ts` | The guided setup click path from sign-up to a live agent: the rail is gated before go-live, and after it AI Agent leads to its pages while Automations and Settings stay inert, the welcome, persona, scenarios, knowledge and test steps run in a modal while go live is a page, the modal's step bar marks the current step and the done ones, "Finish later" is inert, empty forms move to their filled twins on first touch or on Continue, the persona step carries the sheet's help text and signature cards, picking a scenario template opens its prefilled scenario form in the same card and creating it adds the row once and checks the card, "Manual entry" opens the empty form, which fills itself in on first touch, and its scenario counts and enables Continue, skipping scenarios states its consequence inline with no second dialog, the knowledge step asks only the policies the picked scenarios need and its file-or-URL line becomes a website or file source with an inert upload button beside it, the readiness summary reads the store, go live lists the flow it publishes with the "Let AI handle" block following the picked share and the done page names that flow, Continue appends to the personality and knowledge lists once, `?reset=1` restores the path, the done page is the end of the demo, standing alone, and its "start again" resets the store and lands on sign-up, as arriving on sign-up does | no |
| `tests/e2e/ai-agent.spec.ts` | AI Agent click paths: each create sheet appends its row, the test chat replies from its script and clears | no |

`scripts/test` runs typecheck, lint (zero warnings), vitest, the production build, then Playwright against `vite preview` of that build. `scripts/gate` runs the secret scan and then `scripts/test`, locally and in CI.

Rules: no network, no clock, no live credentials in tests.
