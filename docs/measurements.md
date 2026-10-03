# Measurements

Answers: what was measured, when, and by what? The only place numbers live; everywhere else quotes this file by reference. A number without a date and a source is not written down. A superseded line stays, marked superseded.

| Date | What | Value | Source (command, script, or test) | Status |
|---|---|---|---|---|
| 2026-10-01 | Distinct icon names in the saved pages | 106 names, 130 glyphs (name x style) | `node scripts/extract-icons.mjs "<path to Original files>"` | current |
| 2026-10-01 | Routes in the route table | 13 | `cat src/features/*/routes.tsx \| grep -c 'path: "'` | superseded by the 2026-10-03 row |
| 2026-10-02 | Regions compared in the fidelity pass (pages, dialogs, sheets, menus, states) | 86 | manual side-by-side at 1440 wide (live window 1338x701 or 1440x812 where the Chrome side panel allowed; the demo set to the same size each time); rows in `docs/fidelity.md` | current |
| 2026-10-02 | Fidelity pass outcome per region | 60 fixed, 15 identical or matching the screenshot, 11 approximated, waived or not comparable on live | manual side-by-side at 1440 wide; status column of `docs/fidelity.md` | current |
| 2026-10-02 | Icon registry after adding glyphs from the saved pages' icon bundles | 112 names, 139 glyphs (the saved-page check stays at 106 names) | `node scripts/extract-icons.mjs "<path to Original files>"` | current |
| 2026-10-03 | Setup modal body height (tallest screen body, the persona form under the step bar), the card's `bodyHeight` | 488.5px measured, set to 492px; card 662.75px tall, fits a 900px window without the overlay scrolling | Playwright in Chrome at 1440x900, `getBoundingClientRect` on each modal screen | current |
| 2026-10-03 | Routes in the route table, after the journey-only trim (ADR 0003) | 15 | `cat src/features/*/routes.tsx \| grep -c 'path: "'` | current |
| 2026-10-03 | Built JS and CSS in `dist/assets`, before and after the journey-only trim (ADR 0003) | 988.0 kB raw, 309.5 kB gzip before; 710.5 kB raw, 221.3 kB gzip after | `npx vite build` on `origin/main` and on `feat/trim`, then a Node sum of file sizes and `zlib.gzipSync` sizes over `dist/assets` | current |
