# Update plan — phd/batch-editing / ios: approved v1 → draft 20261111-173421

Request: REQ-011 (spec agent comparison, 2026-11-11). Rows: 125 (new 2, modified 4, unchanged 119, removed 0). Built
by `build-draft.ts` in this folder. Same spec set (2026-11-09-figma), re-read 2026-11-11 with `figma-check.ts`: five
boards changed (pm-flow-1, pm-ui-4, the dark Design entry / adjust / enhance boards); `figma-text.ts` finds one rule
change, DR-05g, and a note that the shortcut icon is still to be designed (already Q-3).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-067 | modified | Undo / Redo does not switch the Adjustment tab | switches to the undone value's tab (DR-05g, 2026-11-11; Q-18 for iOS) |

New Open question Q-18: the PM cites the Android single room; does the iOS batch room switch the tab too?

## Rows
- Modified: TC-021, TC-022 (several edits in one room visit undone in one main-screen step), TC-061 (tab switches to
  「Light」), TC-067 (「All」 stays shown with HSL open).
- New: TC-124 (Curve open → Exposure brings the strip back) after TC-066; TC-125 (Free user edits and saves 20 photos)
  after TC-084.

## Not added
- AI Exposure (Q-8) and the Save page title (Q-13) stay open questions: Design and PM still disagree.

## Run order
Re-run the 6 new and modified rows first.
