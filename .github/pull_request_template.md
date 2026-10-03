## Scope

One sentence: what this change is and what it must NOT do.

## Invariants touched

1. Does the built demo gain any request outside its own origin? (must stay no)
2. Does it add, remove or rename a route, or a link to one?
3. Which test scenarios does it add or invalidate?

## Local gate

- [ ] `scripts/gate` green
- [ ] `/simplify` run
- [ ] `/security-review` and `/code-review` run; every finding fixed or waived below
- [ ] Rebased onto current `origin/main` immediately before merge; CI green on that tree
- [ ] Docs in this PR: ADR / measurement / testing map, as applicable

## Waived findings

None.
