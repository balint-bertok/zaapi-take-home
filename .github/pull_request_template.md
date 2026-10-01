## Scope

One sentence: what this change is and what it must NOT do.

Sensitive (auth, permissions, credentials, data deletion, money): yes / no

## Threat model

1. Does this touch an enforcement chain (auth, permission checks, validation)?
2. Does this add or change a call to an external system?
3. Does this change an output's shape or size?
4. Which test scenarios does it add or invalidate?

## Local gate

- [ ] `scripts/gate` green (secret scan, tests, structural tests)
- [ ] `/simplify` run
- [ ] `/security-review` and `/code-review` run; every finding fixed or waived below
- [ ] Rebased onto current `origin/main` immediately before merge; CI green on that tree
- [ ] Docs in this PR: ADR / measurement / testing map, as applicable

## Waived findings

None.
