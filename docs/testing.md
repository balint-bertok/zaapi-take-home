# Testing map

Answers: which suite guards which invariant? One line per suite. Scenario detail lives in test docstrings, not here. Update only when a suite or invariant is added.

| Suite | Guards | Non-negotiable |
|---|---|---|
| `tests/e2e/no-outbound-network.spec.ts` | The built demo requests nothing outside its own origin, on every route in the table | yes |
| `tests/e2e/route-walk.spec.ts` | Every route in the table renders: 200, no console error, no page error, catalog title, no link outside the table; `/` lands on `/login` | yes |
| Gitleaks in `.githooks/pre-commit`, `scripts/gate`, CI | No secret in git history | yes |
| `tests/e2e/flow-builder.spec.ts` | Flow Builder click path: template creates the captured graph, publish lists the flow switched on, no console error; Custom flow has only the trigger | no |
| `tests/unit/secrets.test.ts` | `.env` stays git-ignored; no credential-shaped literal in `src/` | yes |
| `tests/e2e/automations.spec.ts` | Basic Automations click paths: template sheet filter, assign-to-agents form gating, activation dialog adds an active or inactive row, search, edit, delete | no |

`scripts/test` runs typecheck, lint (zero warnings), vitest, the production build, then Playwright against `vite preview` of that build. `scripts/gate` runs the secret scan and then `scripts/test`, locally and in CI.

Rules: no network, no clock, no live credentials in tests. Live validation is a named manual step before deploy, never in CI.
