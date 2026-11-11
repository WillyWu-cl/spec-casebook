# Cutout Reset / Undo / Redo (Android) — eBug drafts, run R1, PhotoDirector 20.19.0 build 90201900

**Source:** spec-casebook run `library/phd/cutout/android/runs/2026-11-10-r1/` — phase R1 of draft `drafts/20261110-163734` (51 rows, not yet saved as the approved table), 2026-11-10 on Samsung Galaxy S23 (SM-S9110) / Android 16 through Appium / UiAutomator2, Test Server, Premium. **No TR for this build.** Tally: 42 Pass, 9 Fail, 0 Blocked, 0 Not run.

**Status:** nothing filed, uploaded or commented. No filed batch exists for this feature (`ebug-defaults.ts phd/cutout android`: none), so Creator, TRCode, source tag and method are left for the reviewer. Dedupe is read-only, Android pool only (dedupe per OS, user 2026-10-28): see `dedupe.txt`.

Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per entry, the logcat excerpt on the entries with a log cause, no video. No `[UX]`: `[AIAgent]`, owner RD. Spec basis check (REQ-055) done per entry; user rulings (Q-n, REQ-n) and team rules are named as such. The spec was read PDF-only (no Figma node links), so Spec Links name `Cutout Reset Undo Redo Spec 11E.pdf` and the board.

**What is drafted:** 7 entries (ISS-CUT-01…07) from the 9 Fail rows (all `defect`); TC-035 / TC-038 and TC-044 / TC-045 are merged. No PM question is held. See Reconciliation.

Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate · Owner: RD / Doc.

---

## 1. ISS-CUT-01 — Undo during a template download undoes the previous step, and the template is still applied when the download ends  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Filed by:** WILLY_WU · [PHA262026P0063](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0063) · 2026-11-11 · TR261106-0051

**Report step:** TC-044, TC-045  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Reproduced with two not-yet-downloaded Trending templates (fireworks, white wood); 「Wall」 is not a chip on 20.19.0, so 「Trending」 stood in. No slow network was available: template and Undo were tapped back to back (adb input) while the thumbnail was still downloading (~2 s on Wi-Fi). R-070 (PM pm-11e-rules 【其他情境】, Q-2 answered by the user, REQ-005: 「Undo 只取消這次還沒完成的套用」). Spec basis checked: written for this room and state; no newer frame. logcat: no cancel; NativeDump 「SetSkyTemplate() … doApplySkyReplacement() end」 applies the template when the download ends (17:52:23 for the wood one). Severity S2 proposed because a finished step is silently lost; RD may judge S3.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Cutout: Undo during a template download undoes the previous step; the template still applies
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Sample Photos
4. Tap the first photo (three women)
5. Tap Cutout in the Edit tab
6. Tap the white colour in Solid
7. Tap Trending
8. Tap a template with the download arrow
9. Tap Undo while the template is downloading
10. Wait 5 seconds
11. Tap Undo
12. Check the result

Result:
Undo reverted the earlier white background; the template was still applied when its download ended.
摘要：下載中按 Undo 會撤銷前一步（白色背景），下載完成後模板仍被套用，白色那一步因此遺失。
{20.19.0_cut01_undo_reverts_white.jpg} {20.19.0_cut01_template_applied_after_download.jpg} {20.19.0_cut01_log.txt}

Expect Result:
Undo cancels only the template apply: the white background stays and the template is never applied.
摘要：Undo 只取消這次尚未完成的模板套用，白色背景保留，下載完成後也不套用模板。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 【Requirement】【按鈕行為】【其他情境】 board (pm-11e-rules)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Cutout-Undo-R1_20.19.0_images/01_ISS-CUT-01/`

---

## 2. ISS-CUT-02 — System Back with the colour palette open closes the whole Cutout room and drops its edits  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Filed by:** WILLY_WU · [PHA262026P0064](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0064) · 2026-11-11 · TR261106-0051

**Report step:** TC-049  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Team rule REQ-051 (Android system Back does what the screen's own close does), confirmed for this room by the user (Q-7 answered, REQ-005) and applied to R-023 (pm-11e-logic: a palette pick is one step when the palette is confirmed or closed). R-080. logcat at the Back press: 「BottomToolBar: onCurrentPanelChange, panel: PANEL_NONE」, 「EditViewActivity: doFragmentPopBackStack」 (the Cutout fragment is popped, the palette is not consulted). The palette sheet itself has 「Cancel」 / 「Done」 and swiping its handle down keeps the pick (O-2).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Cutout: System Back with the colour palette open closes the whole Cutout room, not the palette
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Sample Photos
4. Tap the first photo (three women)
5. Tap Cutout in the Edit tab
6. Tap the colour wheel item
7. Drag on the colour square to red
8. Press the system Back key
9. Check the result

Result:
The whole Cutout room closed with no prompt; the colour pick and the room's edits are gone.
摘要：調色盤開啟時按系統返回鍵，整個 Cutout room 直接關閉，顏色與編輯都遺失。
{20.19.0_cut02_palette_open_red.jpg} {20.19.0_cut02_room_closed_after_back.jpg} {20.19.0_cut02_log.txt}

Expect Result:
Back closes only the palette; the room stays and the colour pick counts as one step.
摘要：返回鍵等同調色盤自己的關閉：只關閉調色盤，留在 room，選色算一步。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 1. undo / redo 邏輯 (operation table) board (pm-11e-logic)
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 【Requirement】【按鈕行為】【其他情境】 board (pm-11e-rules)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Cutout-Undo-R1_20.19.0_images/02_ISS-CUT-02/`

---

## 3. ISS-CUT-03 — Coming back from the edit cutout page adds its own Undo step to the Cutout room  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Filed by:** WILLY_WU · [PHA262026P0065](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0065) · 2026-11-11 · TR261106-0051

**Report step:** TC-035, TC-038  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-029 (pm-11e-logic operation table #10: 「由 edit cutout page 自己的 undo 管理」, not a room step); Q-1 answered (REQ-005). TC-035 (fresh room): after pencil › brush › ✓, Undo is enabled and one Undo removes the brushed area. TC-038 (after 「White」): two Undos needed. Reset after the round trip does return the entry shape (TC-036 passes), and the edit page's own Undo works (TC-039). Spec basis checked; no newer frame. Not tested: what the PM expects the room's Undo to do to the shape when the edit page was the only change (the table only says it is not a step). No log cause (GPUImageViewer exporter noise only).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Cutout: Returning from the edit cutout page adds its own Undo step to the Cutout room
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Sample Photos
4. Tap the first photo (three women)
5. Tap Cutout in the Edit tab
6. Tap the white colour in Solid
7. Tap the edit (pencil) button on the canvas
8. Brush an area above the heads
9. Tap ✓
10. Tap Undo
11. Check the result

Result:
The first Undo only removes the brushed area; a second Undo is needed to revert the white background.
摘要：從 edit cutout page 回來多了一步：第一次 Undo 只還原筆刷，第二次才還原白色背景。
{20.19.0_cut03_undo_after_round_trip.jpg} {20.19.0_cut03_first_undo_keeps_white.jpg}

Expect Result:
The edit cutout page round trip is no step: one Undo reverts the white background.
摘要：進出 edit cutout page 不算一步；一次 Undo 即還原白色背景，沒有更早步驟時 Undo 維持不能按。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 1. undo / redo 邏輯 (operation table) board (pm-11e-logic)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Cutout-Undo-R1_20.19.0_images/03_ISS-CUT-03/`

---

## 4. ISS-CUT-04 — Closing the colour palette without changing the colour adds an empty Undo step  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Filed by:** WILLY_WU · [PHA262026P0066](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0066) · 2026-11-11 · TR261106-0051

**Report step:** TC-051  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-023 (pm-11e-logic: the pick is recorded when the palette is confirmed or closed); Q-9 answered by the user: 「沒改就不算」 (REQ-005). The palette's 「Cancel」 discards and adds no step (TC-018); only the swipe-down close was tested here. Reproduced twice in R1-a.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Cutout: Closing the colour palette without picking a colour adds an empty Undo step
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Sample Photos
4. Tap the first photo (three women)
5. Tap Cutout in the Edit tab
6. Tap the white colour in Solid
7. Tap the colour wheel item
8. Swipe the palette's handle down
9. Tap Undo
10. Check the result

Result:
The background stays white and Undo stays enabled; only a second Undo returns the entry background.
摘要：未改色就關閉調色盤仍被記為一步，第一次 Undo 畫面沒變化。
{20.19.0_cut04_palette_closed_white.jpg} {20.19.0_cut04_first_undo_no_change.jpg}

Expect Result:
Closing the palette unchanged is no step: one Undo returns the transparent entry background.
摘要：未改色關閉調色盤不算一步，一次 Undo 即回到初始透明背景。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 1. undo / redo 邏輯 (operation table) board (pm-11e-logic)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Cutout-Undo-R1_20.19.0_images/04_ISS-CUT-04/`

---

## 5. ISS-CUT-05 — Reset stays enabled after the background is set back to the entry state  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Filed by:** WILLY_WU · [PHA262026P0067](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0067) · 2026-11-11 · TR261106-0051

**Report step:** TC-011  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-015 (pm-11e-rules 【按鈕行為】: Reset enabled when the current state differs from the initial one, disabled when it is the same, 「whatever the history holds」). resetBtn read from the page source (not disabled). One Undo then shows white as expected. Spec basis checked.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Cutout: Reset stays enabled when the room's state is back to the entry state
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Sample Photos
4. Tap the first photo (three women)
5. Tap Cutout in the Edit tab
6. Tap the white colour in Solid
7. Tap the transparent item
8. Check the Reset button

Result:
The canvas is back to the transparent entry state, but Reset is still enabled.
摘要：畫面已回到初始透明狀態，Reset 仍可按。
{20.19.0_cut05_reset_enabled_at_entry_state.jpg}

Expect Result:
Reset is disabled when the current state equals the initial state (Undo stays enabled).
摘要：目前狀態與初始狀態相同時 Reset 應不能按（Undo 仍可按）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 【Requirement】【按鈕行為】【其他情境】 board (pm-11e-rules)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Cutout-Undo-R1_20.19.0_images/05_ISS-CUT-05/`

---

## 6. ISS-CUT-06 — The Cutout room has no Flip button for the cutout object  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Filed by:** WILLY_WU · [PHA262026P0068](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0068) · 2026-11-11 · TR261106-0051

**Report step:** TC-024  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-027 (pm-11e-logic operation table: 「翻轉物件」 is a step). The user ruled the room must offer Flip and asked for an eBug when a run finds none (Q-8, REQ-009, superseding REQ-007). The page source has no element whose id or label mentions flip or mirror.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Cutout: The Cutout room has no Flip button for the cutout object
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Sample Photos
4. Tap the first photo (three women)
5. Tap Cutout in the Edit tab
6. Tap the cutout on the canvas
7. Check the canvas, the panel and the bottom bar

Result:
No Flip button anywhere in the room; the cutout shows no handles and can only be rotated.
摘要：Cutout room 沒有翻轉 (Flip) 按鈕。
{20.19.0_cut06_no_flip_button.jpg}

Expect Result:
The room offers a Flip button; a flip is one step and Undo returns the previous direction.
摘要：Room 應提供 Flip 按鈕，翻轉為一步，Undo 可還原方向。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 1. undo / redo 邏輯 (operation table) board (pm-11e-logic)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Cutout-Undo-R1_20.19.0_images/06_ISS-CUT-06/`

---

## 7. ISS-CUT-07 — An imported background photo that was undone is not kept in Recent (the picker has no Recent)  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Filed by:** WILLY_WU · [PHA262026P0069](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0069) · 2026-11-11 · TR261106-0051

**Report step:** TC-016  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-071 (pm-11e-rules 【其他情境】). The user said the app has no Recent for now and asked for a bug after the run (Q-4, REQ-008). The undo itself works (photo leaves the canvas and its thumbnail leaves the item row, O-5).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Cutout: An undone imported background photo is not kept in Recent; the picker has no Recent
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Sample Photos
4. Tap the first photo (three women)
5. Tap Cutout in the Edit tab
6. Tap the import photo item
7. Tap a photo
8. Tap Undo
9. Tap the import photo item
10. Tap Sample Photos at the top
11. Check the album list

Result:
The picker's album list has no 「最近使用」 (Recent), so the undone photo is not kept there.
摘要：匯入照片被 Undo 後，挑選器沒有「最近使用」，照片未保留在其中。
{20.19.0_cut07_album_list_no_recent.jpg} {20.19.0_cut07_picker_tabs.jpg}

Expect Result:
After Undo the photo leaves the canvas but stays in 「最近使用」 (Recent).
摘要：Undo 後照片從畫布移除，但保留在「最近使用」。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Cutout PM spec (Cutout Reset Undo Redo Spec 11E.pdf), 【Requirement】【按鈕行為】【其他情境】 board (pm-11e-rules)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Cutout-Undo-R1_20.19.0_images/07_ISS-CUT-07/`

---

## Not raised (observations, for the record)

- O-1: ✕ and system Back return straight to the Edit room, not a Cutout page (20.19.0 has none): question on TC-001 / TC-040 / TC-048, not a defect.
- O-2: The palette has 「Cancel」 / 「Done」 and hides the bottom bar; swipe-down keeps the pick (context for ISS-CUT-02 / -04).
- O-3: Stroke colours and slider appear only after a style is chosen; slider 0–20, default 10 (TC-021 question).
- O-4: 「Solid」 chip highlight follows the pick, not shown on entry; informational.
- O-5: Import adds a thumbnail item and a 「50」 slider; Undo removes the thumbnail (context for ISS-CUT-07).
- O-6: No selection frame on the cutout; two-finger rotate works (context for ISS-CUT-06).
- O-7: Re-entering after ✓ re-cuts the flattened image (stroke outside the people is dropped from the new cutout); TC-043 question, informational.

## Pass with a question (no eBug)

- TC-001: Tier: Premium (Mine 「Hello VIP!」). Launcher 「Edit」 › Sample Photos › first tile › Edit tab 「Cutout」: the Cutout room opened directly (~5 s) with the three people cut out on a transparent checkerboard; no Cutout page with…
- TC-018: From 「White」 (one step): opened the colour wheel, dragged to red (canvas live 240,6,6). The palette has 「Cancel」 / 「Done」 and no ✕: 「Cancel」 discarded the pick (back to white, no step). Repeated and closed the sheet by s…
- TC-021: The thickness slider only exists after a stroke style is chosen (style + orange colour already made, so Undo was enabled before the drag); the step-on-release check used Redo instead: from an Undo (slider 「10」, Redo enab…
- TC-040: Fresh room, 「White」 then black (two steps; Reset and Undo enabled). Tapped ✕: no confirmation, the room closed at once without keeping its edits: the photo shows its original grey studio background (no white / black, no …
- TC-042: Fresh room: 「White」 background, then 「Stroke」 › fourth style (red dashed outline). Tapped ✓: the room closed and the result came back as one image: white background, the three people and the red dashed outline, shown in …
- TC-043: Edit room showing the flattened image from TC-042 (white background + red dashed outline). No Cutout page or selection step on 20.19.0 (step 1 not possible, TC-001). Tapped 「Cutout」: the room opened with Reset, Undo and …
- TC-048: Fresh room, 「White」 then black (two steps). System Back: no confirmation, the room closed at once like ✕ and the edits were dropped: the Edit room shows the image as before the room (the flattened white + red-outline ima…

## Reconciliation against the run

| Case | Result | Where |
|---|---|---|
| TC-011 | Fail defect | F-5 ISS-CUT-05 |
| TC-016 | Fail defect | F-7 ISS-CUT-07 |
| TC-051 | Fail defect | F-4 ISS-CUT-04 |
| TC-024 | Fail defect | F-6 ISS-CUT-06 |
| TC-035 | Fail defect | F-3 ISS-CUT-03 |
| TC-038 | Fail defect | F-3 ISS-CUT-03 |
| TC-044 | Fail defect | F-1 ISS-CUT-01 |
| TC-045 | Fail defect | F-1 ISS-CUT-01 |
| TC-049 | Fail defect | F-2 ISS-CUT-02 |
