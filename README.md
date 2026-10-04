# Zaapi take-home

A clickable demo of one product proposal for [Zaapi](https://www.zaapi.com), built as the interview case study for the Head of Product role. Live at **https://balint-bertok.github.io/zaapi-take-home/**.

## The case

The assignment was to go through Zaapi's merchant onboarding, from sign-up to a working AI agent, and propose what to change. The written answer is a memo to Zaapi's leadership, delivered alongside this repo. This demo makes the memo's proposal clickable.

**The problem the memo names.** A new merchant's first agent is set up through a handful of side-navigation pages that never say which order to do them in, which are required, or when the agent is ready to go live. The memo traces the drop-off to four causes: fear of getting the agent wrong in front of customers, business knowledge that was never written down, scenario handling that gets skipped, and onboarding that lands in the middle of a sales campaign.

**The proposal.** One guided path to the first live agent, in this order: persona, scenarios, knowledge, test, go live. It carries three decisions: scenarios come before knowledge, so the knowledge step asks only for the policies the chosen scenarios need; those answers arrive drafted from the merchant's Helpdesk chat history; and go live defaults to 1 in 5 conversations, with full volume one click away. The path reuses the product's existing scenario templates, knowledge sources and test chat; it changes where they appear, not what they are. It is default-on but never mandatory, and finishing it unlocks nothing. The reasoning is in [ADR 0002](docs/decisions/0002-guided-setup-path.md).

## What the demo is, and is not

- **A journey, not a product.** Sign up, land in the inbox with its onboarding pop-ups, open AI Agent, walk the guided setup, go live, and start again. Pages outside that journey were removed ([ADR 0003](docs/decisions/0003-journey-only-demo.md)); the controls that would lead to them render but do nothing.
- **A recreation, not a redesign.** Theme, icons and markup come from the live app so the proposal reads as a change to Zaapi, not a change of Zaapi. Where the demo differs from the live app, [docs/fidelity.md](docs/fidelity.md) says where and why.
- **Front-end only.** No backend, no network. Every click changes in-browser state only; `?reset=1` on any URL restores the starting state.
- **Prefilled.** Forms open filled in, so the journey is a sequence of clicks. Business values follow the fixture convention ("Brand One"), never a real customer.

## How it was built

Vite, React, TypeScript and Tailwind v4, published to GitHub Pages ([ADR 0001](docs/decisions/0001-stack-vite-react-tailwind-gh-pages.md)). Built with Claude Code, one pull request per change, each with its own branch, review and squash merge; [CLAUDE.md](CLAUDE.md) holds that process. Three invariants are held by tests on every pull request, listed in [docs/architecture.md](docs/architecture.md) and mapped to their suites in [docs/testing.md](docs/testing.md).

## Running it

```bash
npm ci
npm run dev        # http://localhost:5173/zaapi-take-home/
scripts/gate       # what CI runs
```

The end-to-end suite needs Playwright's Chromium (`npx playwright install chromium`) and the secret scan needs [gitleaks](https://github.com/gitleaks/gitleaks). The full command list is in [CLAUDE.md](CLAUDE.md).

## Reading further

| Question | Where |
|---|---|
| How does the demo work, what must always hold, what was rejected? | [docs/architecture.md](docs/architecture.md) |
| Why was something decided? | [docs/decisions/](docs/decisions/README.md) |
| Where does the demo differ from the live app? | [docs/fidelity.md](docs/fidelity.md) |
| Which test guards which invariant? | [docs/testing.md](docs/testing.md) |
| What was measured, when, by what? | [docs/measurements.md](docs/measurements.md) |
