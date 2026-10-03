# zaapi-take-home

This file is the index and the process for working sessions. `README.md` is the front door for a reader. Detail lives in `docs/`. Keep it under 300 lines.

## What this is

A take-home assignment. Front-end only: no backend, no database, no cloud or VPS; nothing is deployed anywhere but GitHub (user decision, 2026-10-01). Reference material from the assignment (screenshots and saved pages of the Zaapi onboarding flow) sits in `Original files/`. A clickable, non-functional recreation of the Zaapi dashboard, published on GitHub Pages. Stack: Vite + React + TypeScript + Tailwind v4, static, no network (ADR 0001). Build plan: `Original files/extracted/PLAN.md` (git-ignored with the rest).

## Where to find things

The doc map is the "Reading further" table in `README.md`. Session-only additions: `docs/third-parties.md` for external services and safe identifiers.

## Commands

```bash
git config core.hooksPath .githooks   # once per clone; pre-commit secret scan, fails closed
npm ci                                 # install exactly what package-lock.json pins
npm run dev                            # dev server, at /zaapi-take-home/ like Pages
npm run build                          # dist/ under the Pages base path, plus 404.html for deep links
scripts/gate                           # local gate: secret scan + scripts/test; same command CI runs
node scripts/extract-icons.mjs "<path to Original files>"   # regenerate src/icons/registry.ts
```

## Development process

One change = one session = one worktree = one branch = one PR = one squash merge. Never work on `main`.

1. **Scope (human gate 1).** One sentence: what the change is, what it must NOT do.
2. **Worktree.** `git fetch origin && git worktree add ../zaapi-take-home-<slug> -b feat/<slug> origin/main`
3. **Invariants touched** in the PR description (the questions in the PR template).
4. **Invariant tests first** when a non-negotiable invariant is touched.
5. **Local gate green:** `scripts/gate`, then `/simplify`.
6. **Self-review:** `/security-review` and `/code-review`. Fix or waive every finding in the PR. No human diff read (user decision, 2026-10-01).
7. **Rebase, then CI:** `git fetch origin && git rebase origin/main && git push --force-with-lease`; CI must pass on that tree.
8. **Merge (human gate 2).** There is no server, so the squash merge to `main` is the release; the Pages workflow publishes it (user decision, 2026-10-01).
9. **Docs in the same PR:** ADR, measurement, testing map as applicable. No docs-only PRs.

Human gates are exactly two: scope and deploy. Everything else the session does on its own.

## Git identity

GitHub account `balint-bertok`. Check `git config user.email` and `gh auth status` after creating a worktree and before every remote operation. Squash merge only, delete branch and worktree after. Fetch before diagnosing anything.

## Non-negotiable invariants

Full text in `docs/architecture.md`, suites in `docs/testing.md`. Never weakened to make a feature pass; renegotiate with the user.

- No outbound network: the built demo requests nothing outside its own origin.
- Every route in the route table renders cleanly and links only inside the table.
- No secret reaches git or output.

## Cross-cutting rules

- Deny by default, fail closed.
- One home for each fact; quote by reference.
- Lean pass on every change: could this be smaller?
- No invented names; fixtures use "Brand One", "Brand Two".
- No numbers in prose; `docs/measurements.md` holds them with date and source.
- No infrastructure the user declined; see Alternatives considered in `docs/architecture.md`.
- No secrets exist in this project; never paste a token anywhere.
- Waive explicitly: skipped steps and waived findings get a sentence in the PR.
- Out-of-scope findings become issues or spawned tasks, not bundled fixes.
- Lead with the outcome; say first what could not be verified.

## Vocabulary

- **Local gate:** `scripts/gate` plus `/simplify`, all green before a PR opens.
- **Waived:** a step or finding deliberately skipped, with a written reason in the PR.
