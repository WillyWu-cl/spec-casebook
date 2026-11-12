# AI Background — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-03 | user | Build the AI Background tables (iOS and Android) from the PM spec and the Design Figma (casebook skill), and read the Design Figma with the figma skill. The PM Figma could not be opened by figma-pm or figma-design, so the PM PDF was supplied instead. | analysis | both | done (drafts 2026-11-03) |
| REQ-002 | 2026-11-03 | user | Readability: when a table cell holds two or more steps, each step goes on its own numbered line, whether the steps were numbered on one line (`1. … 2. …`) or written as sentences (`Open X, then tap Y`, `Tap X; tap Y`). Rule in AGENTS.md › Team preferences and `formats.md` (*One step per line*); `check.ts` warns on steps run together. Reformat the approved tables and save them directly. | tooling | both | done (iOS v2: 13 cells, Android v2: 15 cells, wording otherwise unchanged; changes in `history/edit-20261103-173713-decisions.json`) |
| REQ-003 | 2026-11-03 | user | Run plan for the approved tables (both platforms). | run | both | done (`runs/RUN-PLAN-20261103-R1.md`, phases in drafts 20261103-154527 / 20261103-155417) |
| REQ-004 | 2026-11-03 | user | Coverage page: Design boards had arbitrary names (「5」, 「Frame 4922」) and the PM boards showed blank. | analysis | both | done (boards named, PM regions committed as dark renders; reading-the-spec.md step 10) |
| REQ-005 | 2026-11-03 | user | The PM Figma should open with qa1 (seat may be lower): catch up the PM Figma reads. | analysis | both | done (same content as the PDF; collapse button found → TC-020 modified, Q-16 model name; drafts 20261103-175601) |
| REQ-006 | 2026-11-04 | user | Check that every page was analyzed properly against the newest repo rules; fix gaps (category variants, open question format, TC-004 steps). | analysis | both | done: tables v4 (iOS 49, Android 59; drafts 20261104-142441 iOS / 20261104-142442 Android: TC-056 – TC-059 added for the template categories, open questions rewritten with assumptions and rows, Q-13 moved to Answered questions, TC-004 split one step per line); run plans R2-a take the four new rows, about 33 credits); PM Figma text matched the PDF and is the baseline; inventory.js no longer cuts texts at 400 characters |
| REQ-007 | 2026-11-12 | user | Readability: no long Precondition or Expected Result lines joined by ";". Each precondition goes on its own numbered line, like Action; each expected check on its own line, unnumbered, with a step prefix ("Step 3:") repeated on every line of that step. Rule in AGENTS.md › Team preferences and `formats.md` (*One item per line*); `check.ts` warns. Reformat the approved tables and save them directly; the Chinese copy follows line for line. | tooling | both | done (iOS v5: 49 Precondition and 23 Expected Result cells, Android v5: 59 Precondition and 26 Expected Result cells; wording otherwise unchanged; changes in `history/<draft>-decisions.json`) |
