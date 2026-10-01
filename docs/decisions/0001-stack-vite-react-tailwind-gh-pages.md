# 0001: Stack, Vite + React + Tailwind v4, published on GitHub Pages

- Date: 2026-10-01
- Status: accepted
- Decided by: the user on stack-agnostic terms ("whatever makes a faithful, clickable demo easiest"; English only; icons from the saved HTML; uncaptured pages not built; GitHub Pages via Actions on push to `main`), and by the session on the specific choice below.
- Code it touches: everything under `src/`, `public/`, `vite.config.ts`, `scripts/extract-icons.mjs`, `.github/workflows/pages.yml`.

## Context

The take-home is a clickable, non-functional recreation of the Zaapi dashboard (app.zaapi.com). There is no backend and nothing is deployed beyond GitHub (user decision, 2026-10-01). The reference material in `Original files/` (git-ignored) holds screenshots, saved pages with the real markup and compiled Tailwind classes, and the full English translation catalog. The plan validated by the user lives in `Original files/extracted/PLAN.md`.

Fidelity comes from three things the saved pages give us verbatim: the theme tokens, the class lists, and the English strings. The framework adds nothing to that.

## Decision

- **Vite, React 19, TypeScript strict, react-router** (`BrowserRouter` with `basename` from `import.meta.env.BASE_URL`). Static build; the build copies `index.html` to `404.html` so GitHub Pages serves deep links.
- **Tailwind v4** via `@tailwindcss/vite`, with the real app's `@layer theme` tokens copied verbatim into `@theme` in `src/index.css`, plus its base rules (including `html { font-size: 14px }`, which makes every rem-based utility 14px-based as on the real site).
- **Radix primitives** with hand-written shadcn-style wrappers in `src/components/ui/`, class lists copied from the app's own wrappers; `sonner` for toasts; `clsx` + `tailwind-merge` for `cn()`; `tw-animate-css` for the `animate-in`/`fade-in-0` classes the saved markup uses.
- **Icons**: the inline Font Awesome SVGs in the saved pages are extracted by `scripts/extract-icons.mjs` into `src/icons/registry.ts` and rendered by one `<Icon>` component. The same name can ship in several styles (`far`, `fas`, `fal`, `fak`), so the registry keeps each style.
- **Inter, self-hosted** from `public/fonts/`. The built demo makes no request to any other host, which is a tested invariant (`docs/testing.md`).
- **Hosting**: GitHub Pages from `.github/workflows/pages.yml` on push to `main`; Vite `base` is `/zaapi-take-home/` in dev, build and preview alike.
- **Data**: one in-memory store (`src/store/`) seeded from fixtures, persisted to one localStorage key, reset with `?reset=1`.

## Consequences

- The icons are Font Awesome Pro glyphs under Zaapi's licence, committed to a public repo. Accepted for an assignment demo; the alternative was visibly different glyphs.
- Pages without a screenshot are not built; their entry points render through `<Inert>` (user decision, 2026-10-01). The route-walk suite asserts every in-app link targets a route in the table.
- Playwright's current Chromium no longer supports macOS 13 (the dev machine), so locally the suites drive the installed Google Chrome and CI uses the bundled Chromium (`playwright.config.ts`).
- Regenerating icons needs `Original files/`; a worktree has no copy, so the script takes the folder as an argument.

## Alternatives considered

| Rejected | Why | Whose decision |
|---|---|---|
| Next.js static export (the real app's framework) | Heavier build and export config with no fidelity gain; fidelity comes from tokens, classes and strings | Session |
| Lucide (or any icon library) | The user wants identical glyphs | User |
| Live capture of pages that were never screenshotted | Dropped; those pages are not built | User |
