# Cutout Reset / Undo / Redo — requirements (android)
Spec: Cutout Reset Undo Redo Spec 11E.pdf, Cutout UI UX flow (before 11E).pdf (spec set 2026-11-10; from 「Cutout with Stroke.zip」)
Read PDF-only from the text layer and renders (figma-pending.json); the linked Design 2025/09 page was read with figma-design (links.json).
Source order: the 11/E page is the newest and governs; the 「before 11/E」 page is used only for the Cutout page and the entry.

## Entry and layout
- R-001 [PM:uiux-before-11e; PM:pm-11e-crosstab] Edit › 「Cutout」 opens the Cutout page (tools 「Auto」 / 「Box」 / 「Circle」 / 「Brush」 / 「Eraser」, bottom bar ✕, reset, undo, redo, 「Cutout」); after a selection, 「Cutout」 opens the Cutout room with the cutout on the canvas.
- R-002 [PM:pm-11e-buttons] The Cutout room has a Reset, an Undo and a Redo button (➊ add button: reset / undo / redo), drawn in the bottom bar between ✕ and ✓ in the order ✕, Reset, Undo, Redo, ✓.
- R-003 [PM:pm-11e-crosstab] The Cutout room opens on the 「Background」 tab (「Background tab (default locate)」).
- R-004 [PM:pm-11e-buttons] The room panel has two tabs, 「Background」 and 「Stroke」; the Background tab has category chips (「Solid」, 「Wall」, 「Romantic」, 「Blue」, 「Summer」…) above an item row (none, transparent, import photo, colour palette, solid colours, templates).
- R-005 [PM:pm-11e-buttons; PM:pm-11e-rules] The history covers only edits made in the Cutout room, and Background and Stroke share one history (「Background + Stroke 共用一條」).
- R-006 [PM:pm-11e-logic] The edit cutout page (reached with the canvas edit button) keeps its own undo for its own edits (operation table #10: 「由 edit cutout page 自己的 undo 管理」).

## Button states
- R-010 [PM:pm-11e-buttons] ① On entering the room (current = initial state): Reset, Undo and Redo are disabled (grey).
- R-011 [PM:pm-11e-buttons] ② After any step: Reset enabled, Undo enabled, Redo disabled.
- R-012 [PM:pm-11e-buttons] ③ After an Undo that has not reached the initial state: Reset, Undo and Redo are all enabled.
- R-013 [PM:pm-11e-buttons] ④ After undoing every step (back at the initial state): Reset disabled, Undo disabled, Redo enabled.
- R-014 [PM:pm-11e-buttons; PM:pm-11e-logic] ⑤ After Reset: Reset disabled, Undo enabled, Redo disabled — Reset is itself a step and clears the Redo history.
- R-015 [PM:pm-11e-rules] Reset is enabled when the current state (cutout style included) differs from the initial state, and disabled when it is the same, whatever the history holds.
- R-016 [PM:pm-11e-rules] Undo is enabled when there is a step to undo and disabled when there is none.
- R-017 [PM:pm-11e-rules] Redo is enabled when there is an undone step; a new step after an Undo clears the Redo history (Redo disabled).

## Steps per operation
- R-020 [PM:pm-11e-logic] Choosing a solid background is a step, recorded on tap; Undo returns the previous background and the panel selection frame moves back with it.
- R-021 [PM:pm-11e-logic; Req: REQ-005] Choosing a template background (Wall / Romantic…) is a step, recorded when applying completes; Undo returns the previous background and moves the selection back.
- R-022 [PM:pm-11e-logic] Importing a photo as background is a step, recorded when the photo is applied to the canvas; Undo removes the photo from the canvas and returns the previous background.
- R-023 [PM:pm-11e-logic; Req: REQ-005] Picking a colour in the colour palette is a step, recorded when the palette is confirmed or closed, not while dragging; Undo returns the background from before the pick. Closing the palette with no colour change is no step (Q-9 answered).
- R-024 [PM:pm-11e-logic] Choosing a Stroke style or colour is a step, recorded on tap; Undo returns the previous stroke setting.
- R-025 [PM:pm-11e-logic] Dragging the Stroke thickness slider is a step, recorded on finger-up, not while dragging; Undo returns the value from before the drag.
- R-026 [PM:pm-11e-logic] Rotating the cutout object is a step, recorded on finger-up, not while rotating; Undo returns the angle from before the rotation.
- R-027 [PM:pm-11e-logic; Req: REQ-009] Flipping the cutout object is a step, recorded on tap; Undo returns the direction from before the flip. The room must offer a Flip button (Q-8 answered, REQ-009).
- R-028 [PM:pm-11e-logic] Reset is a step, recorded on tap; Undo after Reset returns the state from before the Reset, cutout style included.
- R-035 [PM:pm-11e-rules; KB: KP-042] Undo reverts the last step and updates the canvas and the panel selection together; Redo re-applies the most recently undone step.

## Operations that are not steps
- R-029 [PM:pm-11e-logic] Opening the edit cutout page with the edit button and coming back is not a step (#10).
- R-030 [PM:pm-11e-logic] Selecting the cutout object on the canvas is not a step (#11).
- R-031 [PM:pm-11e-logic] Switching between the 「Background」 and 「Stroke」 tabs is not a step (#12).
- R-032 [PM:pm-11e-logic] Switching category chips (「Solid」 / 「Wall」…) is not a step (#13).
- R-033 [PM:pm-11e-logic] Scrolling the item row sideways is not a step (#14).
- R-034 [PM:pm-11e-logic] Tapping the item that is already selected is not a step (#15).

## Undo across tabs
- R-040 [PM:pm-11e-crosstab; PM:pm-11e-rules] When the change an Undo or Redo reverts or re-applies was made on the other tab, the panel switches to that tab so the user sees the change.
- R-041 [PM:pm-11e-rules] When the change is on the current tab, Undo / Redo keeps the panel on it (「在 C 按 Redo → 重做 ①「選 Wall 背景」→ 留在 Background tab」).
- R-042 [PM:pm-11e-rules] From C, a second Redo re-applies ② 「調整 Stroke」 and switches to the Stroke tab.
- R-044 [PM:pm-11e-rules] Tapping Reset switches the panel to the 「Background」 tab.

## Reset and the cutout style
- R-050 [PM:pm-11e-rules; Req: REQ-005] Undo and Redo include the edits made on the edit cutout page (cutout style): each step's state includes the cutout style of that moment, so undoing back past a step also brings back the cutout shape it had (Q-1 answered).
- R-051 [PM:pm-11e-rules; PM:pm-11e-open] Reset restores the edits made on the edit cutout page (cutout style) too (5. 待決事項 Q7, decided: 「還原；否則使用者可能卡住，無法繼續 undo / redo」).
- R-052 [PM:pm-11e-rules; PM:pm-11e-logic] After only editing the cutout on the edit cutout page (no step in the room), Reset is enabled (the state differs from the initial one) while Undo and Redo stay disabled (the round trip is no step).
- R-055 [PM:pm-11e-rules] Reset returns to the state on entering the room, not to the original photo.

## Leaving the room
- R-060 [PM:pm-11e-buttons; PM:pm-11e-rules; Req: REQ-005] Leaving the room with ✕ discards the room's edits, returns to the Cutout page and clears the whole history: entering the room again starts with Reset, Undo and Redo disabled (Q-3 answered).
- R-061 [PM:pm-11e-rules; Req: REQ-005] Leaving the room with ✓ flattens the image, returns to the Cutout page with it and clears the whole history (「壓平圖片處理，紀錄全部清空」; Q-3 answered).

## Other scenarios
- R-070 [PM:pm-11e-rules; Req: REQ-005] Tapping Undo while a template is still downloading cancels only that apply (the earlier step stays); when the download finishes the template is not applied. With no earlier step Undo stays disabled during the download (Q-2 answered).
- R-071 [PM:pm-11e-rules; Req: REQ-008] After an imported photo is undone it is removed from the canvas but stays in 「最近使用」 (Recent).
- R-072 [PM:pm-11e-rules; PM:pm-11e-open; Req: REQ-006] There is no step limit (Q-6 answered, REQ-006; replaces 「步數達到上限：最舊的步驟會被捨棄」 and the spec's open Q3): after many steps Undo walks back every one of them to the entry state.
- R-081 [Rule 2: leave and return] Sending the app to the background in the Cutout room and returning keeps the canvas, the panel and the Reset / Undo / Redo states.

## Android
- R-080 [Rule: Android system Back (REQ-051 of the skill); Req: REQ-005] System Back in the Cutout room, with the colour palette open and on the edit cutout page does what the screen's own close does (Q-7 answered).

## Flow arrows
- R-090 [DS: flow arrow pm-11e-crosstab-a1  (PDF board pm-11e-crosstab, no Figma link)] A (Background tab after ① Wall, ② Stroke, ③ back on Background) → 「按 Undo」 → B: ② reverted, panel on the Stroke tab.
- R-091 [DS: flow arrow pm-11e-crosstab-a2  (PDF board pm-11e-crosstab, no Figma link)] B → 「再按 Undo」 → C: ① reverted, panel back on the Background tab, Reset and Undo disabled.
- R-092 [DS: flow arrow pm-11e-crosstab-a3  (PDF board pm-11e-crosstab, no Figma link)] Room ✕ → the Cutout page (pink arrow).
- R-093 [DS: flow arrow pm-11e-crosstab-a4  (PDF board pm-11e-crosstab, no Figma link)] Room ✓ → the Cutout page (pink arrow).

## Open questions

## Answered questions (2026-11-10, Cases page)
- Q-1 — 每一步記錄的狀態都包含當時的去背樣式 → confirms the assumption. REQ-005; R-050.
- Q-2 — Undo 只取消這次還沒完成的套用；沒有更早的步驟時 Undo 維持不能按 → confirms the assumption. REQ-005; R-021, R-070.
- Q-3 — ✕ 捨棄編輯並回到 Cutout 頁；✓ 壓平圖片後回到 Cutout 頁 → confirms the assumption. REQ-005; R-060, R-061.
- Q-4 — 目前沒有 recent，執行完這條請先開個 bug → the app has no Recent for now; TC-016 stays (expected to fail) and an eBug is filed after it runs. REQ-008; R-071.
- Q-6 — 沒有上限 → no step limit; replaces the oldest-step-dropped clause. REQ-006; R-072.
- Q-7 — 返回鍵的效果和該畫面自己的關閉相同 → confirms the assumption. REQ-005; R-080.
- Q-8 — 只能旋轉不能翻轉, corrected by the user: there must be a Flip button; when a run finds none, file an eBug → R-027 and TC-024 stay. REQ-009 (supersedes REQ-007); R-027.
- Q-5 — Figma 上面的已經都儲存下來了，有更新會再更新 → the two PDFs hold everything on Figma (no missing sections, no newer frames); spec updates will be sent as a new set. REQ-010.
- Q-9 — 沒改就不算 → closing the palette unchanged is no step; new TC-051. REQ-005; R-023.

## Added 2026-11-10 — coverage passes and standing inputs
### Job states
| Job | Start / loading | Success | Failure | Retry | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|
| Template background download | TC-013, TC-014 | TC-013, TC-014 | n/a (spec silent) | n/a (spec silent) | TC-047 | n/a (spec silent) | n/a (no notice) |
| Photo import | TC-015 | TC-015 | n/a (spec silent) | n/a (spec silent) | TC-047 | n/a (spec silent) | n/a (no notice) |

### Error classes
| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes or failure copy) |

### Exit × stage
| Stage | ✕ | ✓ | Edit button (round trip) | App to background | System Back |
|---|---|---|---|---|---|
| Room, no step | n/a (nothing to clear; R-060 checked with steps) | n/a (R-061 checked with steps) | TC-035 | n/a (spec silent) | n/a (same as with steps) |
| Room, steps made | TC-040, TC-041, TC-048 | TC-042, TC-043 | TC-037, TC-038 | TC-047 | TC-048 |
| Template downloading | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) |
| Colour palette open | n/a (no ✕ / ✓ while open) | n/a (no ✕ / ✓ while open) | n/a (not reachable) | n/a (spec silent) | TC-049 |

### System back
- Cutout room → as ✕: TC-048
- Colour palette → closes it, pick recorded: TC-049
- Edit cutout page → back to the room: TC-050
- Cutout page → n/a (existing page, not changed by 11/E)
- Photo picker (import photo) → n/a (existing picker, not changed by 11/E)

### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-005 | Background and Stroke share one history | Undo order across both tabs | TC-025 |
| R-061 | the image is flattened on ✓ | the Cutout page shows one image; re-entering cannot undo it | TC-042, TC-043 |
| R-070 | a cancelled template is not applied after its download finishes | canvas after the download ends | TC-014, TC-044, TC-045 |
| R-071 | an undone photo is kept in 「最近使用」 | the Recent list after Undo | TC-016 |
| R-072 | no step is ever dropped (no limit) | Undo count after 60 steps | TC-046 |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-035 × operation | solid background | TC-004, TC-012 |
| R-035 × operation | template background | TC-013, TC-014 |
| R-035 × operation | imported photo | TC-015 |
| R-035 × operation | colour palette | TC-017, TC-018, TC-051, TC-049 |
| R-035 × operation | stroke colour / style | TC-019, TC-020 |
| R-035 × operation | stroke thickness | TC-021, TC-022 |
| R-035 × operation | rotate | TC-023 |
| R-035 × operation | flip | TC-024 |
| R-035 × operation | Reset | TC-008, TC-037 |

### Domain rules
| Entry | Requirements |
|---|---|
| KP-012 Android has one paid mode: VIP = Pro = paid user | n/a (the Cutout room spec states no paid gating or price) |
| KP-014 AI Exposure is paid-only | n/a (other feature or flow: not part of the Cutout room) |
| KP-015 Mine refreshes entitlement after buying Premium | n/a (other feature or flow: not part of the Cutout room) |
| KP-016 A one-time free trial is consumed at once | n/a (no free trial in the Cutout room spec) |
| KP-017 Credit Detail lists every AI use with feature name and amounts | n/a (other feature or flow: not part of the Cutout room) |
| KP-018 Credit Auto Pass keeps its own name in the Detail | n/a (other feature or flow: not part of the Cutout room) |
| KP-019 A burst of Generate taps charges once | n/a (other feature or flow: not part of the Cutout room) |
| KP-020 Blue credit button opens Buy Credit | n/a (other feature or flow: not part of the Cutout room) |
| KP-021 Premium chat quota is higher, not unlimited | n/a (other feature or flow: not part of the Cutout room) |
| KP-024 Finished AI images save to their feature tab | n/a (other feature or flow: not part of the Cutout room) |
| KP-025 AI Exposure results go to Recent and the AI Exposure tab | n/a (other feature or flow: not part of the Cutout room) |
| KP-026 History button opens the feature's Artwork tab | n/a (other feature or flow: not part of the Cutout room) |
| KP-027 New features' works reach Recent | n/a (other feature or flow: not part of the Cutout room) |
| KP-028 Empty Artwork filter shows Nothing yet | n/a (other feature or flow: not part of the Cutout room) |
| KP-029 Long-task tiles and completion notifications | n/a (other feature or flow: not part of the Cutout room) |
| KP-030 Saved output matches the last preview | n/a (other feature or flow: not part of the Cutout room) |
| KP-032 Features opened from Edit Room get the edited image | n/a (other feature or flow: not part of the Cutout room) |
| KP-033 Banners and deep links preselect the linked style | n/a (other feature or flow: not part of the Cutout room) |
| KP-034 Discover tip bubble lifecycle | n/a (other feature or flow: not part of the Cutout room) |
| KP-035 AI Replace: reference image or prompt enables Next | n/a (other feature or flow: not part of the Cutout room) |
| KP-036 A custom prompt reaches the generator | n/a (other feature or flow: not part of the Cutout room) |
| KP-037 AI Try-On: no face check on clothing or pets | n/a (other feature or flow: not part of the Cutout room) |
| KP-038 AI Group Shot photo picking | n/a (other feature or flow: not part of the Cutout room) |
| KP-039 Agent job finished in background shows on return | n/a (other feature or flow: not part of the Cutout room) |
| KP-040 Crop tabs keep one consistent state | n/a (other feature or flow: not part of the Cutout room) |
| KP-041 Undo, Redo and Reset | n/a (a Crop transform-screen rule; the Cutout spec states its own Reset: it switches to the Background tab, R-044) |
| KP-042 Restored state restores highlight and transform together | R-035 |
| KP-043 Video Editing template titles keep their look | n/a (other feature or flow: not part of the Cutout room) |
| KP-044 Video Editing panels: X discards, V commits | n/a (other feature or flow: not part of the Cutout room) |
| KP-045 Audio Range Select close target | n/a (other feature or flow: not part of the Cutout room) |
| KP-046 Try-On / Hairstyle Back keeps the style | n/a (other feature or flow: not part of the Cutout room) |
| KP-047 Masks survive returning from Artwork or Store | n/a (other feature or flow: not part of the Cutout room) |
| KP-048 Arabic may keep Western digits | n/a (other feature or flow: not part of the Cutout room) |
| KP-049 Localised strings keep their placeholders | n/a (other feature or flow: not part of the Cutout room) |
| KP-050 RTL mirrors layout, not only text | n/a (other feature or flow: not part of the Cutout room) |

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-093 [Req: REQ-001] |
| REQ-002 | scope only: this table is Android; no iOS table for now [Req: REQ-002] |
| REQ-005 | R-021, R-023, R-050, R-060, R-061, R-070, R-080 |
| REQ-006 | R-072 |
| REQ-009 | R-027 |
