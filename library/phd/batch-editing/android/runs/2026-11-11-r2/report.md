# Batch Editing Android — Phase R2 report (table v5, rows added or changed) — final

Plan `runs/RUN-PLAN-20261111-R2.md` · approved table v5 (168 rows; this round runs the 16 rows v5 added or changed, `drafts/20261111-173421/phases.json` R2) · run folder `runs/2026-11-11-r2/` · 2026-11-11. Nothing filed, uploaded, commented or committed.

## Environment
- PhotoDirector for Android 20.19.0 (90201900), same build as R1 · Test Server
- Samsung Galaxy A53 5G (SM-A5360, R5CTB22S05Y), Android 15, USB · Appium / UiAutomator2 port 4724
- Premium through About › debug 「Set to subscriber」 (KP-131): Free at R2-a start, switched once; 「Hello VIP!」 checked again at R2-b start; no other debug option changed
- Photos: R2-a 12 gallery photos plus stand-ins ① – ④ (album 「Casebook」, regenerated on this phone 2026-11-11); R2-b the top 12 tiles of 「All」

## Results — 16: 4 Pass · 12 Fail · 0 Blocked · 0 Not run (Fail = 10 defect, 2 question)
| Segment | Area | Cases | Pass | Fail |
|---|---|---|---|---|
| R2-a | Crop & Rotate, Section 3 rules | 7 | 1 | 6 (5 defect, 1 question) |
| R2-b | Adjustment | 9 | 3 | 6 (5 defect, 1 question) |
| Total | | 16 | 4 | 12 |

Pass: TC-059 (custom 1000 × 500 → the others get 2:1 with their own box), TC-079 (each Undo switches to the tab it undid, DR-05g as changed 2026-11-11), TC-081 (✓ keeps +20; one main-screen Undo takes photo 4 back to its pre-room state), TC-167 (the strip comes back with a slider tool; switching photos works).

### Every Fail and its reason
| Case | Disposition | Reason |
|---|---|---|
| TC-153 | defect | Crop 「All」 not greyed on entering with no change, nor after the apply (R-234) |
| TC-162 | defect | Crop 「All」 not greyed on photo 2, which has no change of its own |
| TC-042 | defect | Crop 「All」 not greyed after the apply; a tap shows 「Applied to 11 photos」 again |
| TC-063 | defect | Redo restores the apply on the others (that part passes), but 「All」 is not greyed again |
| TC-163 | defect | Size-only change through the pencil: the height follows (passes), 「All」 not greyed (R-236) |
| TC-164 | defect | Adjustment 「All」 not greyed on entering, nor on photo 2 (no change) |
| TC-075 | defect | Adjustment 「All」 not greyed after the apply; a tap shows 「Applied to 11 photos」 again |
| TC-165 | defect | Redo restores the apply (passes), but 「All」 is not greyed again |
| TC-166 | defect | Curve: the strip moves above the panel instead of fading out, and a tap switches to photo 2 (R-237) |
| TC-168 | defect | HSL: the strip stays shown (R-237); folding the panel and switching photos pass |
| TC-062 | question | Crop: one Undo after 3:2 + 「All」 reverts the 11 others; photo 1 keeps its own 3:2 (same as R1) |
| TC-076 | question | Adjustment: same as TC-062 (photo 1 keeps its Exposure); a no-change 「All」 first added an empty Undo step (O-1) |

Logs: R2-a-20261111-181034 and R2-b-20261111-181928 pulled and sliced; no app crash in either segment (a StackOverflowError at 15:09 in the ring buffer is from before R2). The repeat-tap toasts appear in logcat (Toast show at 18:14:44 and 18:15:09).

## eBug drafts — `ebugs/2026-11-11-r2/` (3 entries, none filed)
| F | ISS | Cases | Finding | Proposed |
|---|---|---|---|---|
| 1 | ISS-BEA-12 | TC-153, 162, 042, 063, 163, 164, 075, 165 | 「All」 is never disabled in Crop & Rotate or Adjustment; a tap after the apply applies again | Functional S3 RD |
| 2 | ISS-BEA-13 | TC-166, 168 | The thumbnail strip stays shown and tappable while Curve or HSL is open | Functional S3 RD |
| 3 | ISS-BEA-14 | TC-062, 076 | One Undo after an edit + 「All」 keeps the current photo's own edit (PM decision) | [UX] S3 PM |

One ticket covers 「All」 in both rooms: one control (batchApplyToAllBtn) and one rule (R-234, PM Figma DR-04 【NEW】). Format check: 0 errors, 0 warnings. Dedupe (read-only, PhotoDirector Mobile for Android): no match against PHA262026P0057 – P0061 or the R1 batch. Review page `20261111_eBug_review_Batch-Edit-R2_20.19.0.html` (local), with filing fields prefilled from 2026-11-10-r1 for the user to confirm.

## Observations
- O-1 (TC-076): a no-change 「All」 makes an empty Undo step (R1 O-11); folded into ISS-BEA-12.

## Coverage
No coverage page for this run: the Android table's spec set is still PDF-only (figma-pending.json, no control trace), and device-android.ts wrote no taps.jsonl.

## Knowledge
Inbox empty and no observation names an entry, so no knowledge subagent ran. KF-003 (slider scales) and KP-134 (Undo switches the tab) matched the phone.

## Time and usage
run-log time: wall 0 h 17 m (R2-a 0 h 08 m, R2-b 0 h 09 m), no idle gap over 15 min.
Claude tokens (`tokens.jsonl`, 201 messages, the two segment subagents in full and the orchestrator inside the run's spans): 32.3 M, weighted 4.1 M; R2-a 7.9 M, R2-b 14.0 M, wrap-up 10.3 M.
Plan usage: est. from token rate 33 % of a 1× Pro 5-hour window (5.4 % of the 6.25× Team seat), weekly ~5.6 % (0.9 % of the seat). Account card (shared): 5-hour 72 % → 81 %, weekly 29 % → 30 % over the run (`runs/usage.jsonl`).
