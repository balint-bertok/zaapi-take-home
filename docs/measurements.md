# Measurements

Answers: what was measured, when, and by what? The only place numbers live; everywhere else quotes this file by reference. A number without a date and a source is not written down. A superseded line stays, marked superseded.

| Date | What | Value | Source (command, script, or test) | Status |
|---|---|---|---|---|
| 2026-10-01 | Distinct icon names in the saved pages | 106 names, 130 glyphs (name x style) | `node scripts/extract-icons.mjs "<path to Original files>"` | current |
| 2026-10-01 | Routes in the route table | 13 | `cat src/features/*/routes.tsx \| grep -c 'path: "'` | current |
