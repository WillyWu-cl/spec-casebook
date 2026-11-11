# Update plan — pdr/video-enhance / android: approved v4 → draft 20261111-170000

REQ-011 (user, 2026-11-11): some eBugs followed the old Design board (DRA262611P0072). The only Design spec is page
2974:19965, section 「AI Video Enhance_26.09_v2」 (REQ-010). The spec agent's main PDF (74bcea79) is a 2026-10-07 export
of an older state of that section, and 270 of its 271 cases cite it, so its cases never override today's board
(REQ-008 narrowed). Rows are built by `build-draft.ts` in this folder from the approved `cases.csv`.

## Spec files
- Unchanged: spec set 2026-11-03 (Design HceGLJVaxnKsv7gXSXzKWh page 2974:19965, PM mppB4GYkuVMVvHrdBeSAAU; Figma only).
- No longer a source where today's board says otherwise: the spec agent's 2026-10-07 Design export.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-196 | changed | a 2K+ source is rejected before the panel (spec agent TC-VE2-097 / 098) | a 2K+ source (1440p, 4K, 8K) opens the panel with 「4K」, a playing Preview and its real fps / resolution (Design 「來源超過最高選項時取最高」) |
| R-044 | changed | 1081p up to below 2K → 4K; 1440p+ never reaches the panel | 1081p and above → 4K |
| R-015 | changed | 2K+ follows the block | 2K+ opens the panel (R-196); PM E1's over-4K greying is older (Q-13) |
| Q-13 | changed | 2K+ settled by the block | the Design settles 2K+; PM E1's ≤ 4K stays open for PM |
| Q-23 | removed | the 2K+ block's message | no block, nothing to ask |

## Rulings on batch 2 (REQ-012, reviewer, 2026-11-11)
- F-3: 「You're all set」 is iOS only; Android returns to the panel at once → R-074 (Android note), TC-095.
- F-10: Android has only Free and Pro; 「Pro+」 is iOS only → R-005 (「Pro」 badge), R-072 (single Pro page), Q-25
  answered; TC-004, TC-093.

## Case changes
- Modified (5): TC-022 steps 1–3 (the 1440p, 4K and 8K videos open the panel with 4K; steps 4–5 unchanged), TC-058
  (Note only), TC-004 (「Pro」 badge), TC-093 (single Pro page, two steps), TC-095 (no 「You're all set」 step).
- New (0), Removed (0). Unchanged: the other 163 rows.

## For the reviewer: rules with only an old-export spec agent case behind them
Today's board neither states nor contradicts these; they stay as they are unless you Delete or edit their rows here.
| Requirement | Rule | Spec agent case | Rows |
|---|---|---|---|
| R-087 | Keep Uploading leaves 「Enhance」 disabled | TC-VE2-234 | TC-112, TC-205 |
| R-200 / R-201 | Pause on the Preview / Result player | TC-VE2-163, TC-VE2-168 | TC-037, TC-150 |
| R-202 | Add Media offers every picker source | TC-VE2-153 – 156, 225 | TC-255 – TC-258 |
| R-203 | The ledger names each charge 「AI Video Enhance」 | TC-VE2-174 | TC-219 – TC-254 (one check each) |
| R-204 | Completion within 1.5 – 2.5 × the selection (company standard, by your instruction) | TC-VE2-221 – 223 | TC-265 – TC-267 |
R-070 / R-071 (Android unlocks with Pro) also came from the export, but KP-006 states it too, so they stay.

## Rerun
None needed: run R1 (Android, 2026-11-10) already recorded what TC-022 steps 1–3, TC-004, TC-093 and TC-095 now ask
(the 「Pro」 badge, the single Pro page, the panel back after the purchase with nothing sent) (1440p and 4K open with 4K
selected; 8K opens with a black Preview, 「0fps · 1080p」 and disabled fps chips), so its result is re-recorded from
that evidence (analysis.md pass 9, shared outcome). iOS has no run yet.

## Not added
Nothing.
