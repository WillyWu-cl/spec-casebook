# Batch Edit Android — Phase R1 report (draft v2 on the S23) — final

Plan `runs/RUN-PLAN-20261109-R1.md` · draft v2 (161 rows, `drafts/20261109-150747`, not yet saved as the approved
table) · run folder `runs/2026-11-09-r1/` · wrap-up 2026-11-10 (no device work; Appium, logcat capture and page
servers left as they were). Nothing filed, uploaded, commented or committed.

## Environment
- PhotoDirector for Android 20.19.0 (90201900), installed 2026-11-09; **no TR** for this build · Test Server
- Samsung Galaxy S23 (SM-S9110, RFCW2198L7B), Android 16, USB · Appium / UiAutomator2 on port 4724 (Windows)
- Premium through the About backdoor 「Set to subscriber」 (KP-131); R1-g ran Free and switched back (「Hello VIP!」)
- Credits 2000 throughout (batch AI Enhance charges nothing); no Pink / fault switches on PhotoDirector Android
- Section 3 stand-ins ① – ④ in album 「Casebook」; segments 2026-11-10 09:00 – 15:17 CST

## Results — 161: 130 Pass · 20 Fail · 11 Blocked · 0 Not run
Fail = 11 defect, 9 question · Blocked = 9 observability, 1 test-data (rd-info), 1 defect (TC-155, upstream of
TC-037).

| Segment | Area | Cases | Pass | Fail | Blocked |
|---|---|---|---|---|---|
| R1-a | Photo Picker and entry | 26 | 23 | 2 | 1 |
| R1-b | Main screen and Crop & Rotate | 34 | 31 | 2 | 1 |
| R1-c | Crop rules (Section 3) | 15 | 11 | 4 | 0 |
| R1-d | Adjustment room | 16 | 14 | 2 | 0 |
| R1-e | AI Enhance | 36 | 23 | 5 | 8 |
| R1-f | Leaving, Save, Batch Save page | 29 | 24 | 4 | 1 |
| R1-g | Free user | 5 | 4 | 1 | 0 |
| Total | | 161 | 130 | 20 | 11 |

### Defects — eBug drafts `ebugs/2026-11-10-r1/` (11 entries, none filed)
| F | ISS | Cases | Finding | Proposed |
|---|---|---|---|---|
| 1 | ISS-BEA-01 | TC-110 | Home during a batch AI Enhance does not pause it: the app has no network in the background (UnknownHostException) and every remaining photo fails 「Connection lost」 (2/2) | Functional S2 RD |
| 2 | ISS-BEA-02 | TC-037, TC-155 | Crop & Rotate room has no ‹ at the top left (R-050) | UI S3 RD |
| 3 | ISS-BEA-03 | TC-079 | Undo in the batch Adjustment room switches the Light / Color / Details tab (R-104) | Functional S3 RD |
| 4 | ISS-BEA-04 | TC-144 | System Back does not close the 「Enhance 12 photos?」 dialog (team rule REQ-051) | Functional S3 RD |
| 5 | ISS-BEA-05 | TC-145 | System Back does not close the 「Discard changes?」 dialog (team rule REQ-051) | Functional S3 RD |
| 6 | ISS-BEA-06 | TC-060 | Square applied to all saves ④ as 1434 x 1435, not square | Functional S3 RD |
| 7 | ISS-BEA-07 | TC-122 | Feedback button stays on the dimmed top bar while saving (Design canvas_img_focus-8) | UI S3 RD |
| 8 | ISS-BEA-08 | TC-115 | Discard dialog button 「Keep」, not 「Keep Editing」 | UI S3 Doc |
| 9 | ISS-BEA-09 | TC-012 | 21st-photo toast 「You can only select 20 photos.」 vs 「Please pick at most 20 photos.」 | UI S3 Doc |
| 10 | ISS-BEA-10 | TC-018 | Tool label 「Adjustments」 vs 「Adjustment」 | UI S3 Doc |
| 11 | ISS-BEA-11 | TC-107 | Offline toast 「No Internet connection」 (capital I) | UI S3 Doc |

Format check (`check_ebug_format.py --product PHD-A --version 20.19.0`): 0 errors, 1 warning (F-1 Short Description
123 chars, budget 120). `verify_ebug_drafts.py` was not run: it looks for a `Figma/_index` folder by walking up to
`/`, which never ends on Windows (the run was stopped). Dedupe (read-only, PhotoDirector Mobile for Android pool):
no same-OS match for any entry; related only: PHA262026P0022 (AI_Removal, backgrounding) on F-1 (`dedupe.txt`).
Review page `ebugs/2026-11-10-r1/20261110_eBug_review_Batch-Edit-R1_20.19.0.html` (local, git-ignored): Creator,
TRCode and method are left open (no filed Batch Edit batch, no TR). The 600 px check was not done in a browser
(the pane could not open the local file); the page's CSS wraps every block.

### Held as PM questions (9 Fail rows, 5 questions)
- TC-062, TC-076 (+ O-11): one Undo after an edit + 「All」 reverts the 11 others, but the current photo keeps its own
  edit; a no-change 「All」 adds an empty Undo step.
- TC-049, TC-057, TC-058 (+ O-5, O-7): the Crop room caps photos at a 2560 px long side, and the Custom resolution range
  is 147 – 2560, not Section 3's 238 – 2730 (Q-6).
- TC-100, TC-142: ✕ / Back after a finished AI Enhance open 「Discard changes?」 and Discard drops the results (R-130 vs
  the Design's dialog, Q-19).
- TC-128 (+ O-16): Batch Save title 「Saved 12 photos」 (PM) vs 「Save 12 photos」 (Design), Q-20.
- TC-135 (+ O-19): no native ad card on the Batch Save page (single 「Save & Share」 has one); new question.

### Blocked — what clears each
| Group | Cases | Clears it |
|---|---|---|
| Per-photo AI Enhance failure (observability) | TC-096, 101, 102, 103, 104, 105, 109, 160 | An RD switch or fixture that fails some photos of a batch (offline failures are covered by TC-106 – 108) |
| Deeplink (observability) | TC-152 | 20.19.0 registers no `phd://` VIEW filter; needs a banner / push carrying the link or RD's way to fire it (Q-15) |
| Rating dialog count (test-data, rd-info) | TC-136 | RD's trigger count (O-8 / O-17: 「Rate Us」 seen after some batch saves) |
| Upstream defect | TC-155 | ‹ in the Crop room (ISS-BEA-02) |

### Observations not raised
O-9 (09:39 StackOverflowError) is an automation artifact from UiAutomator2 `setval` looping the linked Width /
Height watchers; keyboard input never crashed — RD information only. O-13 (sporadic SocketTimeout uploads on working
Wi-Fi, Retry succeeds) is to be watched on other networks. O-3, O-6, O-10, O-12, O-15, O-18 are tool notes; O-1, O-2,
O-14, O-17 are informational. All 19 are mapped in the drafts file's reconciliation.

### Coverage
`coverage-page.ts phd/batch-editing android --draft 20261109-150747 --runs runs/2026-11-09-r1`: no Coverage yet, the
table was analysed PDF-only (`specs/2026-11-09/extracted/figma-pending.json`); no `taps.jsonl` in the run folder. No
design plan, so no design check.

## Time and tokens
- `run-log.ts time`: wall 19 h 33 m (11-09 19:43 → 11-10 15:16 CST), test 2 h 45 m, idle 16 h 48 m in 3 gaps (overnight
  12 h 58 m; 09:40 – 10:09; 10:44 – 14:05 while Appium 4724 was down in R1-e). Per segment: R1-a 0:21, R1-b 0:23,
  R1-c 0:22, R1-d 0:15, R1-e 0:48, R1-f 0:25, R1-g 0:09.
- Tokens (`token-usage.ts --since 2026-11-09T11:43:44Z`, the four sessions that name the run folder and their
  subagents, this wrap-up partly included): 983 msgs · in 2,260 · cache write 2,445,603 · cache read 147,179,227 ·
  out 393,046 (150.0 M processed).
- Plan usage: no usage-card snapshots were logged for this run (`runs/usage.jsonl` absent), so there is no account
  percentage.

## Knowledge (wrap-up subagent)
- Inbox filed (both items closed): KP-131 tier switch through the About backdoor 「Set to subscriber」 (verified on
  20.19.0), KP-132 a TR build cannot update a Play Store install, KP-133 test credits lost on reinstall (observed,
  second-hand).
- New feature entries (observed): KF-001 「Rate Us」 after some batch saves, KF-002 saved copies move to the top of the
  picker's 「All」, KF-003 Adjustment slider scales, KF-004 batch AI Enhance log lines.
- Verified: KP-060 (judge the AI Enhance waiting UI, not its duration). KP-105 gained a line (Android Settings gear is
  on the Launcher top bar). No entry contradicted. `knowledge.ts --check` passes.

## Left for the user
- Review the 11 cards and the 5 PM questions; filing needs a TR that names 20.19.0 (90201900), the Creator and the
  method.
- The run tested the v2 **draft**; save it through the review page if it is to become the approved table.
- Nothing is committed (run folder, drafts, ledger REQ-005 / REQ-006, knowledge entries).
