# Batch Edit (Android) — eBug drafts, run R1 (draft v2), PhotoDirector 20.19.0 build 90201900

**Source:** spec-casebook run `library/phd/batch-editing/android/runs/2026-11-09-r1/` — phase R1 of draft `drafts/20261109-150747` (table v2 draft, 161 rows, not yet saved as the approved table), 2026-11-09 → 11-10 on Samsung Galaxy S23 (SM-S9110) / Android 16 through Appium / UiAutomator2, Test Server, Premium through the debug switch (R1-g Free). **No TR for this build.** Tally: 130 Pass, 20 Fail, 11 Blocked, 0 Not run.

**Status:** nothing filed, uploaded or commented. No filed batch exists for this feature (`ebug-defaults.ts batch-editing android`: none), so Creator, TRCode, source tag and method are left for the reviewer. Dedupe is read-only, Android pool only (dedupe per OS, user 2026-10-28): see `dedupe.txt`.

Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per entry, the logcat excerpt on the failure-related entry, no video. No `[UX]`: `[AIAgent]` or `[AIAgent][UI]`, owner RD (Doc for copy). Spec basis check (REQ-055) done per entry; team rules are named as such. The Design has no per-frame Figma links in this spec set (PDF exports of page 12:2321), so Design links point at that page with the frame name.

**What is drafted:** 11 entries (ISS-BEA-01…11) from 12 defect rows (11 Fail + TC-155 Blocked). 9 Fail rows are held as PM questions (5 questions). See Reconciliation.

Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate (copy and small UI too: S4 is rare in the pool) · Owner: RD / Doc.

---

## 1. ISS-BEA-01 — Sending the app to the background during batch AI Enhance does not pause it; every remaining photo fails  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-110  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Wi-Fi on and connected throughout; 「Retry Failed (7)」 in the foreground then finished all 7 in 29 s. Second try: Home at 「Enhancing 2 / 12」, back after 30 s: 「4 completed, 8 failed」. R-129 (PM server-task-notes, D1-05: 「App 切到背景 → 處理暫停，回到前景後繼續」). Spec basis checked: the rule is written for the batch AI Enhance processing state; no newer Design frame draws background behaviour. logcat (R1-e pull): Home at 14:23:41, image 563 still finished in the background at 14:23:44, then at 14:23:47 `uploadFile, java.net.UnknownHostException` and images 564–570 `Failed(error=NETWORK_ERROR)` within 3 s; `batch of 12 (maxInFlight=1) took 48525 ms`. Second run 14:26:08 the same. The app has no network while in the background on this phone (Android 16), and the runner keeps going instead of pausing, so every remaining photo is burned as a failure. Related to O-13 (sporadic SocketTimeout on working Wi-Fi), which is not raised.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Batch_Editing: AI Enhance does not pause in the background; remaining photos fail as Connection lost
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 12 photos
5. Tap Next
6. Tap AI Enhance
7. Tap Enhance
8. Tap Start
9. Wait until 「Enhancing 4 / 12」 shows
10. Press the Home key
11. Wait 30 seconds
12. Open PhotoDirector from Recents
13. Check the result

Result:
Not paused: the 7 remaining photos failed in the background; on return 「5 completed, 7 failed」 / Connection lost.
摘要：背景期間未暫停，剩餘 7 張立即以 Connection lost 失敗（兩次皆重現）。
{20.19.0_bea01_return_5done_7failed.jpg} {20.19.0_bea01_return2_4done_8failed.jpg} {20.19.0_bea01_log.txt}

Expect Result:
Processing pauses while the app is in the background and continues from where it was on return; it finishes normally.
摘要：App 在背景時暫停處理，回到前景後由中斷處繼續並正常完成。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Server task notes board (server-task-notes)
Related: PHA262026P0022 (AI_Removal: false Network Error after backgrounding during Generate)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/01_ISS-BEA-01/`

---

## 2. ISS-BEA-02 — The batch Crop & Rotate room has no ‹ (back) button at the top left  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-037, TC-155  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** The rest of the room matches (tools, ratios, angle slider, ✕ / undo / redo / ✓); no ‹ in the view hierarchy either. R-050 (PM crop-default; Design 3_ / main_down_tool_box frames both draw ‹ at the top left). Spec basis checked on both sets (2026-10-30 PM, 2026-11-09 PM + Design PDFs): every Crop frame draws ‹. What ‹ should do beside ✕ is open (Q-22), so the ticket asks only for the button; TC-155 (‹ behaviour) is Blocked by this. The reset button the app adds is not drawn by the Design (note only, not raised).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Batch_Editing: The Crop & Rotate room has no ‹ (back) button at the top left of the top bar
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 12 photos
5. Tap Next
6. Tap Crop & Rotate
7. Check the top left of the top bar

Result:
The top bar shows only 「1688 x 2528」 with the pencil and 「All」; there is no ‹ at the left.
摘要：Crop & Rotate 頂列左側沒有 ‹ 返回鍵。
{20.19.0_bea02_crop_room_no_back.jpg}

Expect Result:
The top bar has ‹ at the left, the photo's size 「W x H」 with a pencil in the middle and 「All」 at the right.
摘要：頂列左側有 ‹，中間為尺寸與鉛筆，右側為 All。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Batch Edit Room · Crop & Rotate · default board (crop-default)
Spec Link: Batch Edit Design spec, 3_ (Crop & Rotate) frame (Figma page Batch Edit) - https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=12-2321
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/02_ISS-BEA-02/`

---

## 3. ISS-BEA-03 — Undo in the batch Adjustment room switches the Light / Color / Details tab  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-079  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Starting values: Exposure 0.48 → 0.92, Saturation 46 → 58. R-104 (PM adjust-default, DR-05g: 「Undo / Redo 不切換 Light / Color / Details 分頁（同單張 Adjustment）」). Spec basis checked: written for the batch Adjustment room; no Design frame draws undo behaviour. The single-photo Adjustment room was not compared on this phone (opening it drops the batch), so the parenthesis is the PM's claim.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Batch_Editing: Undo in the Adjustment room switches the Light / Color / Details tab
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 12 photos
5. Tap Next
6. Tap Adjustments
7. Tap Exposure
8. Drag the slider to 0.92
9. Tap Color
10. Tap Saturation
11. Drag the slider to 58
12. Tap Details
13. Tap Undo
14. Tap Undo
15. Check the result

Result:
Values undone, but the 1st Undo switched the tab to 「Color」 and the 2nd to 「Light」.
摘要：兩次 Undo 都正確還原數值，但分頁被切到 Color、再切到 Light。
{20.19.0_bea03_details_before_undo.jpg} {20.19.0_bea03_light_after_2nd_undo.jpg}

Expect Result:
Both values are undone and the tab stays on 「Details」 (Undo does not switch the tab).
摘要：數值還原且分頁維持在 Details，不因 Undo 自動切換。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Batch Edit Room · Adjustment · default board (adjust-default)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/03_ISS-BEA-03/`

---

## 4. ISS-BEA-04 — System Back does not close the 「Enhance 12 photos?」 confirm dialog  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-144  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Same on the 「Discard changes?」 dialog (ISS-BEA-05). Team rule REQ-051 / R-170 (Android system Back does what the screen's own back / close does) applied to R-137 (PM confirm-dialog: 「Cancel」 returns to the AI Enhance page with nothing processed). The spec draws no Back for the dialog, so this rests on the team rule, named as such. Tried with Appium back and adb KEYCODE_BACK.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Batch_Editing: System Back does not close the AI Enhance confirm dialog 「Enhance 12 photos?」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 12 photos
5. Tap Next
6. Tap AI Enhance
7. Tap Enhance
8. Press the system Back key
9. Press the system Back key
10. Check the result

Result:
The dialog stays open after each Back; only 「Cancel」 closes it. Nothing is processed.
摘要：按系統返回鍵兩次，確認對話框仍不關閉。
{20.19.0_bea04_confirm_after_back.jpg}

Expect Result:
Back acts like 「Cancel」: the dialog closes, the AI Enhance page shows and nothing is processed.
摘要：返回鍵等同 Cancel：關閉對話框且不開始處理。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), AI Enhance Confirm Dialog · default board (confirm-dialog)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/04_ISS-BEA-04/`

---

## 5. ISS-BEA-05 — System Back does not close the 「Discard changes?」 dialog  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-145  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Same on the AI Enhance confirm dialog (ISS-BEA-04). Team rule REQ-051 / R-170 applied to R-142 (PM discard-dialog: 「Keep Editing」 stays in Batch Edit Room with the edits). Spec silent on Back (Q-11), so this rests on the team rule, named as such.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Batch_Editing: System Back does not close the 「Discard changes?」 dialog opened from Home
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 12 photos
5. Tap Next
6. Tap Crop & Rotate
7. Tap Square
8. Tap ✓
9. Tap Home
10. Press the system Back key
11. Wait 2 seconds
12. Press the system Back key
13. Check the result

Result:
The 「Discard changes?」 dialog stays open after each Back.
摘要：按系統返回鍵兩次，放棄變更對話框仍不關閉。
{20.19.0_bea05_discard_after_back.jpg}

Expect Result:
Back acts like 「Keep Editing」: the dialog closes and Batch Edit Room stays with the edits.
摘要：返回鍵等同 Keep Editing：關閉對話框並保留編輯。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Discard Dialog · default board (discard-dialog)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/05_ISS-BEA-05/`

---

## 6. ISS-BEA-06 — Square applied to all saves a 16:9 photo as 1434 x 1435 — not square  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-060  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Saved files read over adb from DCIM/PhotoDirector: 1706 x 1706, 1576 x 1576, 800 x 800, 1434 x 1435. Hand-chosen Square shows the same 1 px gap in the label (「1077 x 1076」, 「1688 x 1685」). R-050 lists Square among the room's ratios; R-062 (Section 3 conclusion) says output sizes follow each original. The 1 px gap is a plain defect whatever the size. Not part of this entry: the room holds this photo at a 2560 px long side (2560 x 1439, O-5), so the box is cut from the reduced copy (full original would give 1535 x 1535) — held as a PM question with TC-049 / TC-057 / TC-058. O-4 / O-7 are the same rounding in the label.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Batch_Editing: Square crop applied to all saves a 16:9 photo as 1434 x 1435, not square
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 4 photos, the 4th one 2730 x 1535 (16:9)
5. Tap Next
6. Tap Crop & Rotate
7. Tap the 4th thumbnail
8. Tap Square
9. Tap All
10. Tap ✓
11. Tap Save
12. Check the saved files' pixel sizes

Result:
The room labels the box 「1434 x 1435」 and the saved file is 1434 x 1435; the other three are square.
摘要：16:9 照片套用 Square 後輸出 1434 x 1435，並非正方形。
{20.19.0_bea06_square_label_1434x1435.jpg} {20.19.0_bea06_saved_4_photos.jpg}

Expect Result:
Square is a 1:1 crop: every saved photo's width equals its height.
摘要：Square 為 1:1，輸出寬高應相等。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Batch Edit Room · Crop & Rotate · default board (crop-default)
Spec Link: Batch Edit PM test (Section 3 · 美圖 Apply to all 實測.pdf), 結論 board (meitu-conclusion)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/06_ISS-BEA-06/`

---

## 7. ISS-BEA-07 — The feedback button stays on the dimmed top bar while photos are saving  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-122  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-150 (PM save-saving; Design canvas_img_focus-8 / -9 draw the saving overlay with the feedback icon gone and Home / Replace dimmed). Spec basis checked against the 2026-11-09 Design PDFs; PM does not draw the top bar in detail, so the Design is the source.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Batch_Editing: The feedback button stays on the dimmed top bar while 「Saving k / 20」 shows
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 20 photos
5. Tap Next
6. Tap Save
7. Check the top bar while 「Saving k / 20」 shows

Result:
While 「Saving k / 20」 shows, the feedback (!) button is still on the dimmed top bar.
摘要：存檔中頂列仍顯示 feedback (!) 按鈕。
{20.19.0_bea07_saving_feedback_button.jpg}

Expect Result:
While saving, the top bar is dimmed with no feedback button.
摘要：存檔中頂列變暗，且不顯示 feedback 按鈕。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit Design spec, canvas_img_focus-8 (saving) frame (Figma page Batch Edit) - https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=12-2321
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Batch Save Page · saving board (save-saving)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/07_ISS-BEA-07/`

---

## 8. ISS-BEA-08 — Discard dialog button reads 「Keep」, not 「Keep Editing」  ·  Class: UI  ·  Severity: S3  ·  Owner: Doc

**Report step:** TC-115  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-140 (PM discard-dialog copy; the 2026-11-09 Design 「Discard dialog」 frame also reads 「Keep Editing」). The dialog over the AI Enhance page (TC-100) shows 「Keep」 too, with another body text; that dialog's existence is the held Q-19 question.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Batch_Editing: The Discard dialog's button reads 「Keep」, not 「Keep Editing」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 12 photos
5. Tap Next
6. Tap Crop & Rotate
7. Tap Square
8. Tap ✓
9. Tap Home
10. Check the dialog buttons

Result:
「Discard changes?」 / 「Your edits to these photos will be lost.」 with the buttons 「Keep」 and 「Discard」.
摘要：對話框按鈕為「Keep」。
{20.19.0_bea08_keep_button.jpg}

Expect Result:
The buttons read 「Discard」 and 「Keep Editing」.
摘要：按鈕應為「Discard」與「Keep Editing」。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Discard Dialog · default board (discard-dialog)
Spec Link: Batch Edit Design spec, Discard dialog frame (Figma page Batch Edit) - https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=12-2321
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/08_ISS-BEA-08/`

---

## 9. ISS-BEA-09 — The 21st-photo toast reads 「You can only select 20 photos.」  ·  Class: UI  ·  Severity: S3  ·  Owner: Doc

**Report step:** TC-012  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-018 (PM picker over_max, DR-01). The Design PDFs draw no toast for this case, so PM's copy stands. The toast is not in the page source; captured by screencap (crop) on 2 taps.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Batch_Editing: 21st-photo toast reads 「You can only select 20 photos.」, not the spec copy
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 20 photos
5. Tap a 21st photo
6. Check the toast

Result:
The 21st photo is not selected and the 20 stay selected, but the toast reads 「You can only select 20 photos.」.
摘要：第 21 張被擋下，但 toast 文案不同。
{20.19.0_bea09_toast.jpg} {20.19.0_bea09_picker_20_of_20.jpg}

Expect Result:
The toast reads 「Please pick at most 20 photos.」.
摘要：Toast 應為「Please pick at most 20 photos.」。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Photo Picker · over_max board (picker-over-max)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/09_ISS-BEA-09/`

---

## 10. ISS-BEA-10 — Main screen tool label reads 「Adjustments」, not 「Adjustment」  ·  Class: UI  ·  Severity: S3  ·  Owner: Doc

**Report step:** TC-018  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** If the label is shared with the single-photo Edit Room on purpose, RD may forward to PM. R-020 / room-default (PM) and every 2026-11-09 Design main-screen frame read 「Adjustment」. Spec basis checked: no frame draws 「Adjustments」.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Batch_Editing: The main screen's tool label reads 「Adjustments」, not 「Adjustment」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 12 photos
5. Tap Next
6. Check the tool labels at the bottom

Result:
The tools read 「Crop & Rotate」 / 「Adjustments」 / 「AI Enhance」.
摘要：中間工具名稱為「Adjustments」。
{20.19.0_bea10_adjustments_label.jpg}

Expect Result:
The tools read 「Crop & Rotate」 / 「Adjustment」 / 「AI Enhance」.
摘要：工具名稱應為「Adjustment」。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Batch Edit Room · default board (room-default)
Spec Link: Batch Edit Design spec, canvas_img_focus frame (Figma page Batch Edit) - https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=12-2321
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/10_ISS-BEA-10/`

---

## 11. ISS-BEA-11 — Offline 「Retry Failed」 toast reads 「No Internet connection」 (capital I)  ·  Class: UI  ·  Severity: S3  ·  Owner: Doc

**Report step:** TC-107  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Likely the app's shared offline toast; Doc may keep the app-wide copy. logcat: the offline batch of 15 ended 14:34:44 with 7 NETWORK_ERROR failures; the toast at 14:35:02 starts no BatchEditRunner work (none until Wi-Fi was back). R-127 (PM network_incomplete · offline). Copy-only; the behaviour (nothing starts) passes. Low value: Doc may judge the app-wide string correct.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Batch_Editing: Offline Retry Failed toast reads 「No Internet connection」 (capital I)
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Edit on the Launcher
3. Tap Batch
4. Select 15 photos
5. Tap Next
6. Tap AI Enhance
7. Tap Enhance
8. Tap Start
9. Turn Wi-Fi off while 「Enhancing」 shows
10. Wait until the summary shows
11. Tap Retry Failed (7)
12. Check the toast

Result:
Toast 「No Internet connection」; nothing starts (correct). Only the capital 「I」 differs.
摘要：Toast 為「No Internet connection」（大寫 I），行為正確。
{20.19.0_bea11_offline_toast.jpg} {20.19.0_bea11_log.txt}

Expect Result:
The toast reads 「No internet connection」 and nothing starts.
摘要：Toast 應為「No internet connection」，且不開始處理。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Batch Edit PM spec (UI UX flow 2.pdf), Batch Edit Room · AI Enhance · network_incomplete · offline board (enhance-offline)
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Batch-Edit-R1_20.19.0_images/11_ISS-BEA-11/`

---

## Held — PM questions (not drafted)

| Cases | Disposition | Question |
|---|---|---|
| TC-062, TC-076, O-11 | question | One Undo after a ratio / Adjustment edit + 「All」 reverts the 11 other photos, but the current photo keeps its own edit (a separate earlier step). R-087 / R-105 say only that Apply to all is one step; whether the current photo's own change belongs to it is a PM call. O-11: a no-change 「All」 adds an empty Undo step. |
| TC-049, TC-057, TC-058 | question | The Crop room holds every photo at a 2560 px long side (stand-in ④ 2730 x 1535 acts as 2560 x 1439, O-5 / O-7), so box sizes and the Custom resolution range (「Width should be between 147 and 2560.」) differ from Section 3's figures (1151 x 1535; 238 – 2730 x 238 – 1535). PM: does PhD use the 2560 cap and a 147 px minimum (Q-6)? |
| TC-100, TC-142 | question | ✕ and Back after a finished batch AI Enhance open 「Discard changes?」 「All your existing changes will be lost.」 Keep / Discard, and Discard drops the results; R-130 says ✕ returns with the results kept, while the Design draws this dialog over the AI Enhance page (Q-19). |
| TC-128, O-16 | question | Batch Save page title 「Saved 12 photos」 follows PM; the Design draws 「Save 12 photos」 (Q-20). |
| TC-135, O-19 | question | As Free, batch saves show the IAP flyer and an interstitial, but the Batch Save page has no native ad card (the single 「Save & Share」 page has one under 「Share to」). Neither PM nor the Design draws an ad slot there; R-158 says ads appear as usual. New PM question. |

## Not raised (observations, for the record)

- O-1: System Back from Batch Edit Room with no edit returns to the picker with the selection kept (expected, TC-138).
- O-2: Single-photo AI Enhance ✕ leads to the single Edit Room (outside this feature).
- O-3: Tooling: `device-android.ts hold` takes seconds.
- O-4: Size label 1 px short on a hand-chosen Square: folded into ISS-BEA-06.
- O-5: 2560 px long-side cap in the Crop room: held with TC-049 / TC-057 / TC-058.
- O-6: Tooling: `lbl Discard` taps the dialog title; use `tapif`.
- O-7: ④ reads 「2554 x 1435」 after Original via All: rounding through the 2560 cap, held with the cap question.
- O-8: 「Rate Us」 after the first batch save (TC-136 needs RD's trigger count).
- O-9: StackOverflowError at 09:39 came from UiAutomator2 `setval` (accessibility ACTION_SET_TEXT) looping the linked Width / Height watchers; not reproduced by keyboard input. Automation artifact, RD information only, not filed.
- O-10: Tooling: Appium restart dropped the batch.
- O-11: Empty Undo step from a no-change 「All」: held with TC-062 / TC-076.
- O-12: Tooling: slider scales and progress steps.
- O-13: Sporadic SocketTimeout upload failures on working Wi-Fi (Retry succeeded each time): likely network / Test Server; watch on other networks before raising.
- O-14: Retry Failed asks 「Enhance n photos?」 with n = failed photos (as TC-096 expects; TC-096 itself Blocked).
- O-15: Tooling: `wifi` USB check fixed for Windows adb.
- O-16: Batch Save title 「Saved 3 photos」: held with TC-128 (Q-20).
- O-17: 「Rate Us」 after some batch saves; trigger count unknown (TC-136 Blocked, rd-info).
- O-18: Tooling: picker tiles move after saves.
- O-19: No native ad card on the Batch Save page: held with TC-135.

## Reconciliation against the run

### Fail rows

| Case | Disposition | Where |
|---|---|---|
| TC-012 | Fail defect | F-9 ISS-BEA-09 |
| TC-018 | Fail defect | F-10 ISS-BEA-10 |
| TC-037 | Fail defect | F-2 ISS-BEA-02 |
| TC-155 | Blocked defect | F-2 ISS-BEA-02 |
| TC-062 | Fail question | Held PM question |
| TC-049 | Fail question | Held PM question |
| TC-057 | Fail question | Held PM question |
| TC-058 | Fail question | Held PM question |
| TC-060 | Fail defect | F-6 ISS-BEA-06 |
| TC-076 | Fail question | Held PM question |
| TC-079 | Fail defect | F-3 ISS-BEA-03 |
| TC-144 | Fail defect | F-4 ISS-BEA-04 |
| TC-100 | Fail question | Held PM question |
| TC-142 | Fail question | Held PM question |
| TC-107 | Fail defect | F-11 ISS-BEA-11 |
| TC-110 | Fail defect | F-1 ISS-BEA-01 |
| TC-115 | Fail defect | F-8 ISS-BEA-08 |
| TC-145 | Fail defect | F-5 ISS-BEA-05 |
| TC-122 | Fail defect | F-7 ISS-BEA-07 |
| TC-128 | Fail question | Held PM question |
| TC-135 | Fail question | Held PM question |

### Blocked rows (no verdict, not drafted)

- TC-152 (observability): adb shell am start -a android.intent.action.VIEW -d "phd://navigate/page?name=batch_edit" (also with -p com.cyberlink.photodirector): 「Error: Activity not started, unable to resolve Intent」. Build 20.…
- TC-096 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-101 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-102 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-160 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-103 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-104 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-105 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-109 (observability): Not run by policy: needs fault (observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC…
- TC-136 (test-data): Not run by policy: needs rd-info (the rating-dialog trigger count is not known (needs RD); record Blocked test-data until RD gives it)
