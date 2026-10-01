# zaapi-take-home

This file is the index and the process. Detail lives in `docs/`. Keep it under 300 lines.

## What this is

A take-home assignment. Front-end only: no backend, no database, no cloud or VPS; nothing is deployed anywhere but GitHub (user decision, 2026-10-01). Reference material from the assignment (screenshots and saved pages of the Zaapi onboarding flow) sits in `Original files/`. Stack and first scope not yet decided (as of 2026-10-01). ADR 0001 is reserved for the stack decision.

## Where to find things

| Question | Doc |
|---|---|
| How do we work? (full practices, the source of this file's rules) | `docs/working-practices.md` |
| How does the system work, what must always hold, what was rejected? | `docs/architecture.md` |
| Which test suite guards which invariant? | `docs/testing.md` |
| What was measured, when, by what? | `docs/measurements.md` |
| Why was X decided? | `docs/decisions/` (index in `docs/decisions/README.md`) |
| Which external services and safe identifiers? | `docs/third-parties.md` |
| How to operate, rotate secrets, recover? | `RUNBOOK.md` only if something ever needs operating; none expected (user decision, 2026-10-01) |

## Commands

```bash
git config core.hooksPath .githooks   # once per clone; pre-commit secret scan, fails closed
scripts/gate                           # local gate: secret scan + tests; same command CI runs
```

Test and run commands are added here when the stack is chosen.

## Development process

One change = one session = one worktree = one branch = one PR = one squash merge. Never work on `main`.

1. **Scope (human gate 1).** One sentence: what the change is, what it must NOT do, sensitive yes/no.
2. **Worktree.** `git fetch origin && git worktree add ../zaapi-take-home-<slug> -b feat/<slug> origin/main`
3. **Threat model** in the PR description (four questions in the PR template).
4. **Invariant tests first** when a non-negotiable invariant is touched.
5. **Local gate green:** `scripts/gate`, then `/simplify`.
6. **Self-review:** `/security-review` and `/code-review`. Fix or waive every finding in the PR. No human diff read (user decision, 2026-10-01).
7. **Rebase, then CI:** `git fetch origin && git rebase origin/main && git push --force-with-lease`; CI must pass on that tree.
8. **Merge (human gate 2).** There is no server, so the squash merge to `main` is the release. Any publishing beyond GitHub (for example GitHub Pages) is the user's call. Live validation, deploy scripts, smoke tests and rollback from the full practices do not apply here (user decision, 2026-10-01).
9. **Docs in the same PR:** ADR, measurement, testing map as applicable. No docs-only PRs.

Human gates are exactly two: scope and deploy. Everything else the session does on its own.

## Git identity

GitHub account `balint-bertok`. Check `git config user.email` and `gh auth status` after creating a worktree and before every remote operation. Squash merge only, delete branch and worktree after. Fetch before diagnosing anything.

## Non-negotiable invariants

Named when the stack and architecture are chosen. Candidates from the practices: no secret reaches output or git; outbound calls match an allowlist; retries capped; responses bounded. Each gets one suite, marked non-negotiable in `docs/testing.md`. Never weakened to make a feature pass; renegotiate with the user.

## Cross-cutting rules

- Deny by default, fail closed.
- One home for each fact; quote by reference.
- Lean pass on every change: could this be smaller?
- No invented names; fixtures use "Brand One", "Brand Two".
- No numbers in prose; `docs/measurements.md` holds them with date and source.
- No infrastructure the user declined; see Alternatives considered in `docs/architecture.md`.
- `.env` is the only secret store; never `source` it, never paste a token anywhere.
- Waive explicitly: skipped steps and waived findings get a sentence in the PR.
- Out-of-scope findings become issues or spawned tasks, not bundled fixes.
- Lead with the outcome; say first what could not be verified.

## Vocabulary

- **Local gate:** `scripts/gate` plus `/simplify`, all green before a PR opens.
- **Sensitive change:** touches auth, permissions, credentials, data deletion, money.
- **Waived:** a step or finding deliberately skipped, with a written reason in the PR.
