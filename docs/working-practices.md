# Working practices for a one-person software project

Distilled from a year of running two production repos solo with Claude Code. Stack-agnostic; where an example names a tool (pytest, gitleaks, systemd) treat it as a placeholder for the equivalent in this stack. `CLAUDE.md` is the short index derived from this file; this file is the full text. Where this text says "user decision", the date the user confirmed it for this project is recorded in `CLAUDE.md` or an ADR.

## 0. Principles everything else follows from

* A solo team only keeps the discipline it does not have to remember. Anything that must happen every time is a script, a test, a hook or a CI job. Prose rules are for the two or three things that cannot be automated.
* Proof, not eyeballs. A deploy is done when a script asserts the deployed version equals the tag and a smoke passes. A job ran when it left a log row. A number is true when a test or a dated measurement says so.
* One home for each fact. Scenario detail lives in test docstrings. Measured numbers live in one file. Decisions live in ADRs. Everything else quotes by reference so a change lands once.
* Deny by default, fail closed. Unknown caller gets nothing. A missing scanner refuses to commit. A broken config keeps the last good version. A rejected row fails loudly rather than writing zeros.
* Could this be smaller? Every change gets a lean pass before it is reviewed. Fewer lines, fewer files, fewer concepts.

## 1. The development process (one change at a time)

One change = one Claude Code session = one git worktree = one branch = one PR = one squash merge. Never work on `main`. Never bundle an unrelated fix into a feature branch; it gets its own issue and its own session.

1. Scope (human gate 1). One sentence: what the change is and what it must NOT do. Name whether it is sensitive (touches auth, permissions, credentials, data deletion, money, or anything the project lists as sensitive).
2. Worktree. Fetch first, then cut from `origin/main`: `git fetch origin && git worktree add ../<proj>-<slug> -b feat/<slug> origin/main`.
3. Threat-model before coding. Answer in the PR description, four fixed questions tailored to the project. Examples: does this touch the enforcement chain? does it add a call to an external system? does it change an output's shape or size? which test scenarios does it add or invalidate?
4. Invariant tests first. A change that touches a non-negotiable invariant gets its test written or extended before the implementation.
5. Local gate, all green before a PR is opened: full test suite, secret scan, structural tests, and a lean-code pass (`/simplify`).
6. Self-review, then merge. Run `/security-review` and `/code-review`. Fix every finding or waive it explicitly in the PR under "Waived findings" with a reason. There is no human diff read (user decision, solo team). Sensitive changes also get `/code-review ultra` when the user can trigger it; it does not block the merge.
7. CI green on a branch rebased onto current `main`. Immediately before merging: `git fetch origin && git rebase origin/main && git push --force-with-lease` and let CI re-run on that tree. Git merges disjoint edits silently, so a stale CI run looks identical to a fresh one. This bit for real once: a PR cut before another, merged after it, whose CI never saw the two together.
8. Pre-deploy live validation when anything facing a real external system changed. Never in CI. Waiving it is allowed when nothing external-facing changed, but say so in the PR.
9. Deploy (human gate 2). The decision to deploy is the user's. The execution is a script.
10. Post-deploy smoke, run by the deploy script, with rollback as just another deploy of the previous tag.
11. Docs in the same PR: ADR if a decision was made, measurement if a number was measured, deploy-history entry if deploying, testing map only if a new suite or invariant exists.

Human gates are exactly two: scope and deploy. Everything else the session does on its own, including commit, push, open PR, squash merge, delete branch and worktree.

## 2. Git and worktree hygiene

* Fetch before diagnosing or branching. Local `main` is usually stale because concurrent sessions are the normal state. A duplicate PR was once filed for a bug already fixed and deployed two days earlier. Before diagnosing anything, `git fetch origin`, read `git log origin/main` and `gh pr list --state merged --limit 5`.
* Cut branches from `origin/main`, not local `main`.
* Check identity after creating a worktree: `git config user.email` and the active `gh` account. If the project uses a specific GitHub account, switch immediately before every remote operation, not once per session; the active account is global state and another session can flip it. "Repository not found" usually means the wrong account is active, not a broken remote.
* `gh pr merge --squash --delete-branch` from a worktree errors locally with "'main' is already used by worktree". The merge and remote branch deletion have already happened. Verify with `gh pr view N --json state,mergeCommit` and move on; do not re-run.
* Squash merge only. Delete the branch and the worktree when done.
* Commit on the dev machine, never on a server. Servers hold detached tag checkouts.

## 3. Testing

* Non-negotiable invariant suites. Name the handful of properties that must hold forever (no secret ever reaches output or git; writes to an external system are structurally impossible; every outbound request matches an explicit allowlist; retries are capped; responses are bounded; a denial is indistinguishable from non-existence). One suite each, marked non-negotiable in the test map. Do not weaken them to make a feature pass. Renegotiate with the user instead.
* Data-driven suites. A new user, brand, table or tool is a fixture edit, not new test code.
* Structural greps-as-tests. A test file that scans the source tree for where things live: HTTP clients only under one package, date math only in one module, no model-client import on the request path, no `read_only=False`, no credential-shaped literal in any tracked file. Each rule is (pattern, exact-file allowlist, directory allowlist, hint). A legitimate exception is one allowlist line with a comment saying why. The docstring names the real failure each rule prevents.
* Test docstrings are the scenario matrix. They cannot drift from the code. `docs/testing.md` is one line per suite saying which invariant it guards, updated only when a suite or invariant is added.
* Ops scripts are checked statically. A deploy script cannot run in CI, but `bash -n`, executability, the presence of `set -euo pipefail`, the tags-only checkout and the absence of `git pull` are all visible in the source.
* No network, no clock, no live credentials in tests. Fake clients are scripted, clocks are injected, recording mock transports prove what would have been sent. CI holds no credentials.
* Live validation is a named manual step against the real system, run before deploy, never in CI.
* Both runtime versions in CI when dev and production differ: the dev machine's and the server's.
* A one-off script that touches live data is tested against the writer's in-memory double, refuses when the live grid moved since it planned, and is dry-run by default with `--apply`.

## 4. Secrets

* `.env` is the only secret store, git-ignored, `chmod 600`. `.env.example` holds placeholders only and must still trip the scanner if a real value is pasted into it.
* Secret scanner three ways: a pre-commit hook that fails closed when the scanner is not installed, the same command in the local gate, and a CI job over the full history (`fetch-depth: 0`), pinned to the same scanner version as the dev machine.
* Keep allowlists narrow. Anchor to a whole line and a specific variable or value shape, never to a whole file.
* Add project-specific rules for the project's highest-value secrets when the default ruleset is entropy-gated or missing them. Probe with a realistic-shaped fake key to confirm the rule fires.
* A test asserts credential values never reach responses, logs or exception messages: fake credentials in, grep the outputs.
* Never `source` a `.env` in a shell. Values containing `|`, `$`, spaces or quotes break or leak. Load it with a library. Check presence with `grep -c` and length, never by printing or masking.
* Never paste tokens into chat, tickets, PR text or docs. Identifiers that are safe to write down (tenant IDs, client IDs, hostnames) go in `docs/third-parties.md`; secret values never do.
* Every secret has a rotation entry in the RUNBOOK and a calendar reminder for its expiry.

## 5. Reviews and PRs

* PR template with four sections: Scope (one sentence plus the sensitive yes/no), Threat model (the four fixed questions), Local gate checklist, Waived findings ("None" if none).
* Review skills before every merge: `/simplify`, then `/security-review` and `/code-review`. Findings are fixed or waived with a reason, never silently ignored.
* A review finding out of scope for this PR becomes an issue or a spawned task, not a bundled fix.
* A measured reversal is still a result: if an optimisation measures slower, revert it and record why in the ADR so it is not re-tried.

## 6. CI

* Triggers: `pull_request`, `push` to `main`, a weekly `schedule`, and `workflow_dispatch`. The weekly run catches drift that only shows up between PRs (a scanner download failing, an action deprecation, a dependency break) instead of surfacing mid-merge.
* Jobs: tests on every runtime version in use, secret scan over full history. Structural tests run inside the test suite so they are covered on every version.
* `permissions: contents: read`. Plain binaries over marketplace actions where the command can be identical to the local gate.
* Branch protection requiring up-to-date branches enforces step 7 automatically if the plan allows it; otherwise the rebase rule above is the substitute.

## 7. Deploy and operate

* Tags only. `v0.x.y` on `main`. The server sits on a detached tag checkout; `git pull` is never run there. A deploy fetches tags with `--force`, verifies the tag exists on origin, checks out detached, installs, restarts, waits for readiness, then runs the smoke.
* The deploy's proof is asserted. The service reports `git describe` of its checkout at a health endpoint; the smoke asserts it equals the tag. A `-dirty` or `-N-g<sha>` suffix fails the deploy.
* Smoke covers the real public path: health, auth metadata, unauthenticated and garbage-token calls rejected, a permitted call succeeds, a nonexistent one is refused, and every call is visible in the audit log. Any failure exits non-zero.
* Rollback is a deploy of the previous tag. The script never rolls back on its own (the decision stays human) but prints the exact rollback command on every failure path once the deploy has started.
* Privilege model. A deploy script lives in a tree the service user owns, so root must never interpret it. It runs as the service user and its one root action goes through a sudoers rule allowing exactly that command. Do not "simplify" this back to root.
* Deploy-history entry rides the change's PR, or a small deploy PR when the deploying session did not merge the change. A rollback gets its own entry. The entry becomes true when the smoke passes.
* A batch job's proof is its log row. Every run appends one row (started, finished, rows written, note, exit status). Per-item notes carry their day or key so a partial-run note is never read as a claim about the whole. Notes are deduplicated digit-blind. An upstream failure is logged with its body, not just its status code.
* RUNBOOK.md keeps the manual fallback for every scripted sequence, first-time setup, everyday operations, every secret's rotation steps, common failures with their fix, restore from scratch, and security notes. It arrives with the first thing that needs operating, not before.
* Bind services to localhost behind one reverse proxy; firewall to 22/80/443; OS updates monthly.
* Note client-side caches in the deploy entry when they matter (a chat opened before a deploy holds a stale tool list; users need a fresh conversation).

## 8. Documentation

* `CLAUDE.md` is the index and the process, nothing else. It loads into every session, so keep it short (a few hundred lines). Sections: what this is, where to find things (a table where each doc answers one question), commands, the development process, git identity, non-negotiable invariants in one line each, cross-cutting rules in one line each, vocabulary. Detail lives in `docs/`. A 2,000-line CLAUDE.md was once cut to 240 by moving detail out; do not let it grow back.
* Every doc answers one question, named in the index table. Typical set: `architecture.md` (flow, invariants in full, roadmap, alternatives considered), `testing.md` (suite map), `measurements.md`, `decisions/` (ADRs), `deploy-history.md`, `third-parties.md`, `RUNBOOK.md`.
* ADRs (`docs/decisions/NNNN-kebab-slug.md`, with an index table newest first): one per decision someone might otherwise reopen, not every choice. Form: date, status, who decided, code it touches, context, the incident narrative if there was one, decision, consequences. A decision the user has not yet made is an ADR with status draft and a recommendation; nothing in the repo changes until they decide. An ADR that reopens an earlier one says so.
* "Alternatives considered: don't relitigate without new facts." A section listing what was rejected and why, with the date and whether it was the user's decision. It stops sessions re-proposing Docker, an ORM, a framework or a database the user already declined.
* Measured numbers live in one file with the date and the source that produced them. Everywhere else quotes by reference. When a measurement is superseded, keep the old line marked superseded; the history tells the next reader whether the current one is a trend or a one-off. A number with neither date nor source is not written down anywhere.
* Vocabulary section for the terms sessions otherwise re-explain to each other.
* A schema or declaration file is documentation. Every column or field declares its meaning once, in code, and every rendered copy (a dictionary tab, a glossary, a chat definition) is generated from it and tested against it.
* Comments say why, and name the incident or decision they come from. A comment that restates the code is slop.

## 9. No slop

* Lean pass on every change. Could this be smaller? Fewer files, fewer abstractions, no speculative generality. A hand-rolled 150 lines beats an SDK when the needed surface is tiny and ownership keeps the middleware transparent.
* No invented names. Never coin a placeholder company, person or brand ("Acme Foods"). Fixtures use a fixed neutral convention ("Brand One", "Brand Two") and prose says "a second brand".
* No restated numbers. Quote `measurements.md` by reference.
* No docs-only PR churn. Forty of a repo's first 117 commits were docs-only PRs before the rule changed: docs ride the change's PR.
* No infrastructure the user declined. If Docker, a framework, a database or a linter was rejected, do not reintroduce files for it without asking.
* One logging shape, one place for date math, one place for each external client, one sanctioned call site for anything expensive or risky, each held by a structural test.
* Waive explicitly. A skipped step, a waived finding, a waived live validation each gets a sentence in the PR saying so and why.
* No sub-sub-tasks. A task spawned from a task does not spawn another; leave it unscheduled and tell the user.
* Keep the user's placeholder and style conventions, do not improve them unasked.

## 10. Sessions, memory and cost

* Record user decisions with their date in CLAUDE.md or an ADR ("user decision, 2026-07-30"). Later sessions then know what is settled and what is open.
* Memory files hold what the repo cannot: access details, status of external onboarding, recurring gotchas, feedback with a Why and a How to apply. The index is one line per memory. Check for an existing file before creating one; delete ones that turn out wrong.
* Out-of-scope findings become spawned tasks or issues with a self-contained prompt, never bundled fixes.
* Design with the expensive model, execute mechanical work with the cheap one. After a very expensive UI-clicking session the user set the rule: write the exact step list, token-discipline rules and stop conditions in text first, then spawn each block as its own fresh cheaper session. Run blocks sequentially when they share a resource. Name known-broken things in every prompt so sessions do not re-diagnose them. Have sessions report what they could NOT do; that is often the most valuable output.
* Try the action before handing the user a one-liner. A permission refusal observed once may not reproduce. Fall back to asking only when a call is actually refused.
* When a long-running remote job must be waited on, wait on its state (`systemctl is-active` leaving `activating`), not on a log timestamp filter that may never match.

## 11. If the project has an LLM in the loop

* Numbers are never rendered from model prose. Every figure a person reads comes from deterministic code over source data. The model's output is confined to one gated surface.
* A deterministic rules floor always runs; the model never forgets. Rules catch the failure modes imagined in advance, the model finds unknown unknowns. Exploration is unconstrained; publication is not.
* Verifier gate. Nothing the model writes is published until every figure it cites re-checks against the same frozen snapshot it read, with graded consequences (a bad headline drops the finding, a bad cell drops the table).
* The model holds no credentials. It gets a query function with SELECT-only enforced in code, row caps and a budget, never network or storage access.
* Bounded loop: turns, wall clock, one retry per malformed output, a refusal ends the run, a dry-run mode that touches nothing.
* One sanctioned call site for the model client, held by a structural test. The API key gets its own scanner rule, a `.env` placeholder and a RUNBOOK rotation entry in the same PR.
* Owner-review test. Unit tests prove the pipeline does what it says; they cannot say whether the output is useful. A subagent plays the person the output is written for, reads it cold with a brief kept identical week to week, and scores it. Scores are the baseline the next change must beat; results are dated files in the repo. Record the cost per run in `measurements.md`.
* Cadence is a decision, not a principle: a daily model stage that published one row in five runs became weekly.

## 12. Talking to the user

* Lead with the outcome. Say first what could not be verified.
* Report failures faithfully with the output; say when a step was skipped.
* Sensitive or irreversible actions wait for the user; everything in the process above does not.
* State assumptions and keep going rather than blocking on a question the work can proceed under.
* When the user repeats a request after a concern was raised, that is their decision; proceed and say so.

## Kickoff checklist for this repo

Status as of 2026-10-01.

* done `CLAUDE.md`: index + process, under 300 lines, with the two human gates; invariants named once the stack is chosen.
* done `docs/architecture.md`, `docs/testing.md`, `docs/measurements.md`, `docs/decisions/README.md`, `docs/third-parties.md` (skeletons). `RUNBOOK.md` and `docs/deploy-history.md` when there is something to deploy.
* done `.github/pull_request_template.md` with Scope, Threat model, Local gate, Waived findings.
* partial `.github/workflows/ci.yml`: secret scan over full history, weekly schedule, manual dispatch. Test job runs `scripts/gate`, which has no test command until the stack is chosen.
* done `.githooks/pre-commit` failing closed on a missing scanner; `git config core.hooksPath .githooks` in the setup commands.
* done Scanner config with narrow allowlists; `.env.example` with placeholders only; `.gitignore` covering `.env` and key files. Project-specific rules once the project's secrets are known.
* not done Structural tests and secret-leak tests: need the stack.
* not applicable Health endpoint, `scripts/deploy`, `scripts/smoke`, RUNBOOK, deploy history: no backend, database, cloud or VPS in this project; GitHub is the only destination (user decision, 2026-10-01). Sections 7 and 8's deploy items are kept above as reference only.
* not done ADR 0001 for the stack decision, plus the "Alternatives considered" list of what the user has declined.
