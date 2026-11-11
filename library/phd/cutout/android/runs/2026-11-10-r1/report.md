# Cutout Reset / Undo / Redo Android — Phase R1 report (draft on the S23) — final

Plan `runs/RUN-PLAN-20261110-R1.md` · draft `drafts/20261110-163734` (51 rows, not yet saved as the approved table) ·
run folder `runs/2026-11-10-r1/` · 2026-11-10 17:20 – 18:03 CST. Nothing filed, uploaded, commented or committed.

## Environment
- PhotoDirector for Android 20.19.0 (90201900), installed 2026-11-09; **no TR** for this build · Test Server
- Samsung Galaxy S23 (SM-S9110, RFCW2198L7B), Android 16, USB · Appium / UiAutomator2 on port 4724 (Windows)
- Premium (Mine 「Hello VIP!」, read at R1-a) · no credits used (the room charges nothing)
- Photo: Launcher 「Edit」 › Sample Photos › first tile (three women)
- Phone left on the PhotoDirector Launcher, nothing open; logcat capture stopped

## Results — 51: 42 Pass · 9 Fail · 0 Blocked · 0 Not run
Fail = 9 defect. Pass includes 7 with a question (`--as question`): 20.19.0 has no Cutout page (Auto / Box / Circle /
Brush / Eraser) — Edit › 「Cutout」 opens the room directly and ✕, ✓ and Back return to the Edit room (TC-001, 040,
042, 043, 048); TC-018 (palette has Cancel / Done, no ✕); TC-021 (slider 0–20, default 10, only after a style).

| Segment | Area | Cases | Pass | Fail |
|---|---|---|---|---|
| R1-a | Entry, button states, steps per operation | 26 | 22 | 4 |
| R1-b | Non-steps, undo across tabs, Reset and the cutout style | 14 | 12 | 2 |
| R1-c | Leaving the room, other scenarios, Android Back | 11 | 8 | 3 |
| Total | | 51 | 42 | 9 |

### Defects — eBug drafts `ebugs/2026-11-10-r1/` (7 entries, none filed)
| F | ISS | Cases | Finding | Proposed |
|---|---|---|---|---|
| 1 | ISS-CUT-01 | TC-044, TC-045 | Undo during a template download undoes the previous step (White), and the template is still applied when the download ends (R-070, Q-2; 2/2) | Functional S2 RD |
| 2 | ISS-CUT-02 | TC-049 | System Back with the colour palette open closes the whole room and drops its edits (`doFragmentPopBackStack`; R-080 / Q-7; 2/2) | Functional S2 RD |
| 3 | ISS-CUT-03 | TC-035, TC-038 | Returning from the edit cutout page adds its own room Undo step (R-029, #10) | Functional S3 RD |
| 4 | ISS-CUT-04 | TC-051 | Closing the palette unchanged adds an empty Undo step (R-023, Q-9) | Functional S3 RD |
| 5 | ISS-CUT-05 | TC-011 | Reset stays enabled when the state is back to the entry state (R-015) | Functional S3 RD |
| 6 | ISS-CUT-06 | TC-024 | No Flip button in the room (R-027, REQ-009) | Functional S3 RD |
| 7 | ISS-CUT-07 | TC-016 | An undone imported photo is not kept in 「最近使用」: the picker has no Recent (R-071, REQ-008) | Functional S3 RD |

Format check (`check_ebug_format.py --product PHD-A --version 20.19.0`): 0 errors, 0 warnings (`ebugs/…/check.txt`).
Dedupe (read-only, PhotoDirector Mobile for Android pool): no same-OS match for any entry (`dedupe.txt`). Review page
`ebugs/2026-11-10-r1/20261110_eBug_review_Cutout-Undo-R1_20.19.0.html` (local): Creator, TRCode and method are open
(no filed Cutout batch, no TR). Its script passes `node --check`; the 600 px browser check was not done (the browser
pane cannot open the local file); the page's CSS wraps every block. `verify_ebug_drafts.py` was not run (it walks up
for a `Figma/_index` folder and never ends on Windows, as in the Batch Edit run). No PM question is held.

### What R1-c found besides the Fails
- TC-046: 60 alternating steps were all undone one by one (59 white / black, then the transparent entry), no limit, no
  message; Redo walked all 60 forward too. Steps 5–60 were sent with adb input, so they are not in `taps.jsonl`.
- TC-047: 10 s in the background keeps the room, its canvas and Undo / Redo (Redo still re-applies).
- TC-050: Back on the edit cutout page returns to the room and adds no step.
- O-7: re-entering after ✓ re-cuts the flattened image (the stroke drawn outside the people is not part of the new
  cutout); leaving with ✕ keeps the flattened image.
- Leaving the Edit room with Back shows 「Discard changes?」 / 「All your existing changes will be lost.」 Keep /
  Discard (outside this feature; used to return to the Launcher).

### Observations
O-1 – O-7 in `observations.md`, all mapped in the drafts file (context for the entries or informational; none raised).
No log behind any Fail shows a crash or exception: only GPUImageViewer 「updateGPUImageExporter failed」 / CacheDao
noise. Logs: `logs/R1-a-20261110-173739`, `R1-b-20261110-174803`, `R1-c-20261110-180235` (git-ignored).

### Coverage
`coverage-page.ts phd/cutout android --draft 20261110-163734`: no Coverage yet, the table was analysed PDF-only
(`specs/2026-11-10/extracted/figma-pending.json`). No design plan, so no design check.

## Time and tokens
- `run-log.ts time`: wall 0 h 42 m (09:20:51 → 10:03:16 UTC), test 0 h 42 m, no idle gap. Per segment: R1-a 0:17,
  R1-b 0:10, R1-c 0:15 (TC-046's 60 steps and walks: 7 min).
- Tokens (`token-usage.ts --since 2026-11-10T09:20:26Z`, the transcripts that name the run folder, this wrap-up partly
  included): 307 msgs · in 690 · cache write 586,854 · cache read 48,732,255 · out 132,290 (49.5 M processed).
- Plan usage: no usage-card snapshots were logged for this run (`runs/usage.jsonl` absent).

## Knowledge
The knowledge inbox has no open item and no observation names an entry, so the wrap-up knowledge subagent was skipped
(run.md). Candidate facts for a later intake: 20.19.0 has no Cutout page (O-1), the palette's Cancel / Done (O-2), the
Stroke tab's style-first order (O-3), re-cut after ✓ (O-7).

## Left for the user
- Review the 7 cards; filing needs a TR that names 20.19.0 (90201900), the Creator and the method.
- The draft's rows that go through a Cutout page (and the Wall / Romantic chips) do not match 20.19.0: decide whether
  the table follows the build before saving it.
- Nothing is committed (run folder, drafts, eBug batch).
