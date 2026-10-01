# Testing map

Answers: which suite guards which invariant? One line per suite. Scenario detail lives in test docstrings, not here. Update only when a suite or invariant is added.

| Suite | Guards | Non-negotiable |
|---|---|---|
| (none yet; stack undecided as of 2026-10-01) | | |

Planned first suites once the stack is chosen: a structural test (where things may live) and a secrets test (fake credentials in, grep every output).

Rules: no network, no clock, no live credentials in tests. Live validation is a named manual step before deploy, never in CI.
