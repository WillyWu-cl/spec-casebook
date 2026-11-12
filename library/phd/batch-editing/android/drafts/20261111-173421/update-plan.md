# Update plan — phd/batch-editing / android: approved v4 → draft 20261111-173421

Request: REQ-011 (spec agent comparison, 2026-11-11). Rows: 168 (new 7, modified 9, unchanged 152, removed 0). Built
by `build-draft.ts` in this folder. Spec set unchanged (2026-11-09); the PM and Design Figma pages are now read as well
(spec set 2026-11-09-figma, re-read 2026-11-11 with `figma-check.ts`: 5 boards changed, 33 unchanged after the re-read).

## Why
Android was read from 「UI UX flow 2.pdf」, an older export of the PM Figma page (KF-005). The Figma page states rules
the PDF lacks, which the iOS table and the spec agent already check. Of the spec agent's 103 cases, 12 contradicted
this table (「All」 one-shot with no disabled state) and 7 had no row (strip in Curve / HSL, linked size).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-051 | modified | one-shot, not a checkbox | + it has normal / disabled states (R-234) |
| R-234 | modified | greyed look, when not stated (Q-16) | disabled with nothing unapplied on the current photo; normal after a change; disabled after apply; per photo on switching; Undo → normal, Redo → disabled (PM Figma DR-04 【NEW】) |
| R-236 | new | — | linked size keeps 「All」 disabled; unlinked → Free, 「All」 normal (DR-04) |
| R-104 | modified | Undo / Redo does not switch the Adjustment tab | switches to the undone value's tab (DR-05g, changed in Figma 2026-11-11) |
| R-232 | modified | PM proposal for the strip, no row (Q-17) | decided: R-237, R-238 |
| R-237 | new | — | Curve / HSL open: strip fades out and does not react; 「All」 stays (D1-12) |
| R-238 | new | — | collapsing the panel or choosing a slider tool brings the strip back (D1-12) |

Q-16 and Q-17 move to Answered questions.

## Rows
- Modified: TC-042, TC-075 (「All」 greyed after apply, a tap does nothing — was: works again), TC-153 (states, crop
  only), TC-059 (unlink → Free, 「All」 normal), TC-062, TC-063, TC-076 (「All」 state on Undo / Redo), TC-079 (tab
  switches on Undo), TC-081 (several edits in one visit are one main-screen step).
- New: TC-163 (linked size keeps 「All」 greyed) after TC-058; TC-162 (per-photo state on switching, crop) after
  TC-153; TC-164 (states in Adjustment) after TC-075; TC-165 (Redo of the apply in Adjustment) after TC-076; TC-166,
  TC-167, TC-168 (strip in Curve / HSL) after TC-159.

## Not added
- Tracking rows (the iOS table's TC-120 – TC-123): the Android table never had them; event names are still TBD in the
  PM page. Kept out until the names are final.
- `control-trace.json` against the Figma inventory: this table still sits on spec set 2026-11-09 (PDF + Design frame
  PDFs); moving it onto 2026-11-09-figma with a full control trace is owed (figma-pending.json).

## Run order
Re-run the 16 new and modified rows first; TC-079 now expects a tab switch.
