# Support Photo Enhancer — requirements (ios)
Spec: Support Photo Enhancer - PM and Design Figma.md (Figma-only spec set 2026-11-06: PM page 65:3761 「✅SPEC」, Design page 212:2045 「temp_UJ_ toolbar regroup_24.10E」, Master / PiP Photo Toolbar and icon slice)

Source order: the PM page and its linked toolbar sheet (newest tab 「2026/11 Auto Reframe」) over the Design page, which is the older 24.10E toolbar regroup and draws none of the Photo Enhance screens (analysis.md pass 7: a Design frame older than the newest PM file loses where they conflict). Every Photo Enhance screen row is PM-only (Q-11).

## Enhance in the photo toolbars
- R-001 [PM:pm-master-photo; DS:d-master-photo-toolbar] Selecting a photo clip on the master track shows the photo toolbar with an 「Enhance」 button (the toolbar scrolls sideways; where Enhance sits: Q-1)
- R-002 [PM:pm-pip-photo; DS:d-pip-photo-toolbar] Selecting a photo clip on a PiP track shows the PiP photo toolbar with an 「Enhance」 button (position: Q-1)
- R-003 [PM:pm-enhance-flow 「打開second layer」 Frame 8786; Link: toolbar-reorg-sheet.md] Tapping 「Enhance」 on a photo clip opens a second layer holding 「Photo Enhance」 and 「AI Color」 (Design 24.10E draws Enhance with no second layer and AI Color under Effects; the PM and the sheet are newer: Q-1)
- R-004 [Link: toolbar-reorg-sheet.md (Enhance column); PM:pm-enhance-flow Frame 8786] In the Enhance second layer 「Photo Enhance」 comes first and 「AI Color」 second, on the master and the PiP photo toolbar
- R-005 [DS:figma 12.23 1528:43699; PM:pm-enhance-flow round/ic_ai_enhancement] 「Photo Enhance」 uses the new photo-with-sparkle icon (round/ic_ai_enhancement, Design icon slice 「12.23」)
- R-006 [PM:pm-enhance-flow Frame 8786 round/ic_ai_color] 「AI Color」 in the Enhance second layer opens AI Color for the selected photo clip

## Apply Photo Enhance
- R-010 [PM:pm-enhance-flow 65:4092] Tapping 「Photo Enhance」 on a photo clip that is not enhanced opens the dialog 「Ready to Enhance?」 / 「Your image will look even better in just a few seconds.」 with 「Cancel」 and 「Continue」
- R-011 [PM:pm-enhance-flow 65:4092] 「Cancel」 in 「Ready to Enhance?」 closes the dialog and applies nothing (the PM draws no arrow from it)
- R-012 [PM:pm-enhance-flow 65:6095] 「Continue」 dims the editor and shows a spinner, 「Enhancing...」 and a 「Cancel」 button
- R-013 [PM:pm-enhance-flow 65:6095] 「Cancel」 during 「Enhancing...」 stops the enhancement and applies nothing (no arrow drawn: Q-2)
- R-014 [PM:pm-enhance-flow 65:4427] When the enhancement finishes, the preview shows the enhanced photo and the toast 「Applied Photo Enhance」 appears
- R-015 [PM:pm-enhance-flow 65:4427 Vector 2597; PM:pm-full-screen Ellipse 230] A small white dot on the toolbar 「Enhance」 button marks a photo clip that has Photo Enhance applied
- R-016 [PM:pm-enhance-flow 65:9990] With Photo Enhance applied, the Enhance second layer shows a white dot over 「Photo Enhance」
- R-017 [PM:pm-master-photo; PM:pm-pip-photo; PM:pm-enhance-flow] Photo Enhance can be applied to a photo clip on the master track and to one on a PiP track; it changes only the selected clip

## Photo Enhance panel
- R-020 [PM:pm-enhance-flow 「再次點擊Image Enhance(已套用狀態)」; panel at 3389,497] Tapping 「Photo Enhance」 on a clip that has it applied opens the Photo Enhance panel directly (no dialog): the photo preview, ✕ at the top left, an icon at the top right, 「Reset」, the title 「Photo Enhance」 and the options 「Original」 and 「Result」, with 「Result」 selected
- R-021 [PM:pm-enhance-flow panel; PM:pm-refs (Video Enhance and Photo Enhance room references)] 「Original」 shows the clip without the enhancement and 「Result」 shows it enhanced; the selected option is outlined
- R-022 [PM:pm-enhance-flow 「再次點擊Image Enhance(已套用>未套用狀態), 需要記住上次的result, 因此第二次套用不會有progressing」] The last enhancement result is kept: going back from not applied to applied reuses it, so no 「Enhancing...」 progress is shown and the photo is not processed again
- R-023 [PM:pm-enhance-flow arrow 91-8366] ✕ closes the panel and returns to the editor with the enhancement and the white dot kept
- R-024 [PM:pm-enhance-flow arrow 91-8359; 91:7764] 「Reset」 removes the enhancement and returns to the editor, where the preview shows the original photo and the toast 「Removed Photo Enhance」 appears
- R-025 [PM:pm-enhance-flow 「小白點消失」] After 「Reset」 the white dot is gone from the toolbar 「Enhance」 button and from 「Photo Enhance」
- R-026 [PM:pm-enhance-flow 「…因此第二次套用不會有progressing」] After 「Reset」, applying Photo Enhance again on the same clip uses the kept result: no 「Enhancing...」, the enhanced photo and 「Applied Photo Enhance」 come at once (whether 「Ready to Enhance?」 shows again: Q-5)
- R-027 [PM:pm-enhance-flow panel top-right icon; PM:pm-refs] The icon at the top right of the Photo Enhance panel does what the Photo Enhance room's compare control does (its function is not stated: Q-6)

## Full-screen preview
- R-030 [PM:pm-full-screen arrow 65-6786] The editor's full-screen button opens the full-screen preview, which shows the photo clip with its enhancement
- R-031 [PM:pm-full-screen 「***Timeline Mode, Full Screen一律做擋截圖, 樣式跟rule都跟原shortcut image enhancer一樣」; arrow 65-6787] In the timeline's full-screen preview, taking a screenshot is always blocked (「一律」; whether that includes a photo without the enhancement: Q-7) with the 「screenshot IAP dialog」, looking and behaving as in the shortcut Photo Enhance (image enhancer) room
- R-032 [PM:pm-full-screen note (「rule都跟原shortcut image enhancer一樣」)] The screenshot block follows the shortcut room's tier rule: a Free user gets the IAP dialog; a subscriber (Pro) is treated as in the shortcut room (assumed: no dialog; Q-7)

## Not testable
- R-045 [PM:pm-refs] The two reference shots (Video Enhance panel in the timeline, the Photo Enhance shortcut room) only show what the panel is modelled on — NOT TESTABLE: no rule of their own; R-020–R-027 cover the panel
- R-046 [PM:pm-header] The 「SPEC」 title bar — NOT TESTABLE: a heading

## Open questions
- Q-1 Where is 「Enhance」 in the photo toolbars, and what does its second layer hold? The PM mockups put it after 「Effects」 (master: …Background, Effects, Enhance, Tools…); the linked sheet's newest tab 「2026/11 Auto Reframe」 puts it after 「Background」 and before 「Transition」; the Design (24.10E) has 「Enhance」 with no second layer and 「AI Color」 under 「Effects」. Assumption: Enhance is present with the second layer 「Photo Enhance」, 「AI Color」 (PM + sheet); its position is not checked. R-001, R-002, R-003, R-004; TC-001, TC-002, TC-003, TC-004.
- Q-2 What does 「Cancel」 during 「Enhancing...」 do? The PM draws the button with no arrow. Assumption: it stops, returns to the editor and applies nothing (no toast, no dot). R-013; TC-011.
- Q-3 Is Photo Enhance in the timeline limited by tier or credits? The spec says nothing; the shortcut Photo Enhance room was seen free on VIP with no credits charged (exploration KB, 2026-08-13). Assumption: any tier can apply it; rows run on Pro. R-010, R-014; TC-006, TC-009.
- Q-4 In the Photo Enhance panel, if 「Original」 is selected and the panel is closed with ✕, does the clip stay enhanced or lose the enhancement? Not drawn. Assumption: none; no row until answered. R-021, R-023.
- Q-5 After 「Reset」, does tapping 「Photo Enhance」 show 「Ready to Enhance?」 again before the kept result is re-applied? The note says only that the second apply shows no progress. Assumption: the dialog may show; Continue then applies at once. R-026; TC-018.
- Q-6 What does the icon at the top right of the Photo Enhance panel do? No arrow or note; the references show a history icon (Video Enhance) and a compare icon (Photo Enhance room). Assumption: compare (press and hold shows the original). R-027; TC-019.
- Q-7 Which tiers does the full-screen screenshot block apply to, and only to enhanced photos? 「一律做擋截圖」 (always blocks) with 「rule 跟原 shortcut image enhancer 一樣」 (same rule as the shortcut room). Assumption: a Free user gets the IAP dialog, on any photo (「一律」 taken literally); a Pro user is treated as in the shortcut room (no dialog). R-031, R-032; TC-021, TC-022, TC-024.
- Q-9 Is the enhancement kept in the project (leave and reopen, undo / redo) and in the exported video? The spec does not say. Assumption: none; no row until answered. R-014, R-024.
- Q-10 What happens when the enhancement fails (no network, server error)? Not drawn. Assumption: none; no row until answered. R-012, R-014.
- Q-11 The Design link is the 24.10E toolbar regroup page: it draws no 「Ready to Enhance?」 dialog, 「Enhancing...」, Photo Enhance panel or toasts. Is a Design for these screens coming? Assumption: the PM mockups are the expected look; rows are PM-only. R-010–R-031.

## Added 2026-11-06 — coverage passes and standing inputs

### Job states

| Job | Start / loading | Success | Failure | Retry | Second failure | Partial | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Photo Enhance (first apply) | TC-008 | TC-009, TC-012 | n/a (spec silent; Q-10) | n/a (spec silent) | n/a (spec silent) | n/a (one photo per apply) | TC-011 | n/a (spec silent) | n/a (spec says only 「a few seconds」) | TC-009 |
| Photo Enhance (re-apply, kept result) | n/a (no progress by spec: TC-018) | TC-018, TC-014 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (one photo) | n/a (nothing to stop) | n/a (spec silent) | n/a (instant by spec) | TC-018 |

### Error classes

| Job | Error classes |
|---|---|
| Photo Enhance | n/a (spec names no error classes; Q-10) |

### Exit × stage

| Stage | Cancel / ✕ | Reset |
|---|---|---|
| 「Ready to Enhance?」 dialog | TC-007 | n/a (no Reset here) |
| 「Enhancing...」 | TC-011 | n/a (no Reset here) |
| Photo Enhance panel | TC-015 | TC-016 |
| Full-screen preview | n/a (the existing full-screen exit; spec draws none) | n/a (no Reset here) |

### Hidden clauses

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-022 | the kept result is reused, the photo is not processed again | no 「Enhancing...」 in a screen recording, and no new enhance request in the app log (log pull) | TC-014, TC-018 |
| R-026 | the kept result is reused after Reset | no 「Enhancing...」 in a screen recording, and no new enhance request in the app log | TC-018 |
| R-017 | only the selected clip changes | the other track's clip looks unchanged in the preview | TC-012 |
| R-015 | the dot belongs to the clip, not the project | a second, un-enhanced clip shows no dot and gets the dialog | TC-023 |

### Variants

| Requirement | Variant | Rows |
|---|---|---|
| R-003 | track=master | TC-002 |
| R-003 | track=PiP | TC-004 |
| R-017 | track=master | TC-009 |
| R-017 | track=PiP | TC-012 |
| R-031 | photo enhanced | TC-021 |
| R-031 | photo not enhanced | TC-024 |
| R-032 | tier=Free | TC-021 |
| R-032 | tier=Pro | TC-022 |

### Flow arrows walked by existing rows

- R-050 [DS: flow arrow 65-6779 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-6779] Master photo toolbar 「Enhance」 → Enhance second layer. Walked by: TC-002.
- R-051 [DS: flow arrow 65-6780 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-6780] PiP photo toolbar 「Enhance」 → Enhance second layer. Walked by: TC-004.
- R-052 [DS: flow arrow 65-9989 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-9989] Enhance second layer 「Photo Enhance」 (not applied) → 「Ready to Enhance?」. Walked by: TC-006.
- R-053 [DS: flow arrow 65-6781 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-6781] 「Ready to Enhance?」 「Continue」 → 「Enhancing...」. Walked by: TC-008.
- R-054 [DS: flow arrow 65-6782 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-6782] 「Enhancing...」 done (automatic) → editor with 「Applied Photo Enhance」. Walked by: TC-009.
- R-055 [DS: flow arrow 65-6783 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-6783] Editor (applied) 「Enhance」 → second layer with the white dot on 「Photo Enhance」. Walked by: TC-010.
- R-056 [DS: flow arrow 91-8364 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=91-8364] Second layer 「Photo Enhance」 (applied) → Photo Enhance panel. Walked by: TC-013.
- R-057 [DS: flow arrow 91-8366 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=91-8366] Photo Enhance panel ✕ → editor (applied). Walked by: TC-015.
- R-058 [DS: flow arrow 91-8359 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=91-8359] Photo Enhance panel 「Reset」 → editor with 「Removed Photo Enhance」. Walked by: TC-016.
- R-059 [DS: flow arrow 65-6786 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-6786] Editor full-screen button → full-screen preview. Walked by: TC-020.
- R-060 [DS: flow arrow 65-6787 https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=65-6787] Full-screen preview, screenshot → 「screenshot IAP dialog」. Walked by: TC-021.

### Domain rules

| Entry | Requirements |
|---|---|
| KP-007 A failed generation refunds its credits | n/a (the spec charges no credits for Photo Enhance; Q-3) |

### Request ledger coverage

| Ledger entry | Requirements |
|---|---|
| REQ-001 (analysis: new feature, both platforms) | all (this table) |
