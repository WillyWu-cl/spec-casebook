# Update plan — phd/i2v-reuse / android: approved v1 → draft 20261106-115758

## Spec files
- Unchanged: none · New or changed: Image to Video Reuse - Design Figma 4701-15518.md (new), Image to Video Reuse - PM Figma 6336-3478.md (「Reuse」 moved, no text changed) · No longer supplied: none

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-012 | modified | One summary line 「Kling 2.6 · 10s · Pro · Sound On」 | Card: model icon and name with 「Reuse」 on the same row, chips for Duration, Quality and Sound, then the prompt |
| R-007, R-010, R-011 | source added | PM only | Design confirms them |
| R-067 | new | — | Page order, with 「More Video Editing Tools」 and the Add chips above 「Prompts & Settings」 |
| R-068 | new | — | Dark frame of the card |

## Case changes
- New (2): TC-049 (R-067) page order; TC-050 (R-068) dark mode.
- Modified (9): TC-006, TC-008, TC-012, TC-024 chips replace the summary line; TC-001, TC-004 note the Design difference (Q-14); TC-002, TC-003, TC-009 lose the PM-only note, row text stands.
- Removed (0).
- Unchanged: 39 (their note now reads 「PM-only: the Design does not draw this」).

## Found by the analysis
- Annotation trace: 12 new blocks (the four Design boards), traced to R-012, R-067, Q-14 or ui.
- Controls: 8 new groups traced; ‹ on Save & Share is TC-009, the rest are today's controls of other features.
- PM re-read: only 「Reuse」 moved, up onto the summary line, which agrees with the Design.

## Not added (value check)
- Pressing 「More Video Editing Tools」, 「Add Text」, 「Add Sticker」, 「Add Music」: drop — no spec text here, today's controls; TC-049 checks where they sit.
- Colours, sizes and the outlined 「Reuse」 style: drop — the design check's job, not a table row.
- A dark row per screen: merge — TC-050 covers the one new element.

## PM-only rows
- Design now draws it → modified: TC-001 to TC-004, TC-006, TC-008, TC-009, TC-012, TC-024.
- No Design frame: every other row, including the reused room, toasts, removed model, errors and tracking.

## Questions for PM
- Q-1 (toasts not drawn), Q-13 (「Soound on」), Q-14 (My AI Artwork frames look like an older page), Q-15 (home button), Q-16 (dark mode). Q-2 to Q-7 and Q-9 to Q-12 stay open.

## Questions for you
- Q-8: how tracking events are observed on Android.
