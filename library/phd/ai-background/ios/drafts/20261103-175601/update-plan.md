# Update plan — phd/ai-background / ios: approved v2 → draft 20261103-175601

## Spec files
- Unchanged: Background - PM Spec.pdf. New: the PM Figma file read through figma-pm (qa1), page 2403:4094 (REQ-005).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-025 | extended | expand opens the box at full height | + the collapse button returns it to normal height, prompt kept (PM Figma round/ic_collapse_text 2404:6852) |
| Q-13 | answered | PM Figma not readable | read: same sections, mockups and note text as the PDF, no dated frames |
| Q-16 | new | — | PM page title names GPT Image 2.5 Flare; the Action IDs name Seedream 5.0 Pro |

## Case changes
- Modified (3): TC-020 adds the collapse step (R-025); TC-042, TC-043 Notes name Q-16.
- Unchanged: all other rows.

## Found by the analysis
- PM Figma inventory (group p1): 12 controls; collapse had no pressing row (now TC-020); the mockups' top bar (back, home, history) traced n/a (Q-12).

## Not added (value check)
- PM mockup top bar (back, home, history): the Design and the actual app show ⓘ and credits (Q-12).

## Questions for PM
- Q-16 (new): which model and Action IDs this release uses.
