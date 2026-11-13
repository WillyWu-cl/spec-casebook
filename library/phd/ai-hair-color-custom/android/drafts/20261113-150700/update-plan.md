# Update plan — phd/ai-hair-color-custom / android: approved v1 → draft 20261113-150700

## Spec files
- Unchanged: AI Hair Color Custom - PM Figma 3287-89.md (spec set specs/2026-11-12) · New or changed: none · No longer supplied: none
- Standing inputs: two user rulings from the eBug review of run 2026-11-13-r1 (requests.md REQ-003, REQ-004).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-029 | modified (REQ-003) | Two-colour styles need both colours; with one, Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows | Base Color is required, Highlight Color is optional: Base alone enables Generate with no 「both required」 text; Highlight alone keeps Generate disabled |
| R-042 | modified (REQ-004) | Tapping outside the panel or ⌄ both apply the settings | Only ⌄ collapses and applies; tapping the photo above the panel does not close it |
| Q-16 | new | — | With only a Highlight Color, which message (if any) says a Base Color is needed |

## Case changes
- New (0)
- Modified (3):
  - TC-026: Ombré with Base only now expects Generate enabled and no 「both required」 text (REQ-003).
  - TC-027: Balayage with Highlight only expects Generate disabled; the message is recorded (Q-16).
  - TC-039: tapping the photo now expects the panel to stay open with its settings (REQ-004).
- Removed (0)
- Unchanged: 82

## Found by the analysis
- No new spec file; the changes come from user rulings that override the PM page (D6-04, D6-08). Exit × stage and
  Variants grids relabelled for R-042.
- Run 2026-11-13-r1 Fails of TC-026 (Generate enabled with Base only) and TC-039 (panel did not close) become Passes
  under the new expectations; they are re-run in the next round with TC-027.

## Not added (value check)
- None.
