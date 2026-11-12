# Batch Editing (Android) — eBug drafts, run R2 (table v5), PhotoDirector 20.19.0 build 90201900

**Source:** spec-casebook run `library/phd/batch-editing/android/runs/2026-11-11-r2/` — phase R2 of draft `drafts/20261111-173421` (approved table v5, the 16 rows v5 added or changed), 2026-11-11 on Samsung Galaxy A53 5G (SM-A5360) through Appium / UiAutomator2, Test Server, Premium through the debug switch. Tally: 4 Pass, 12 Fail, 0 Blocked, 0 Not run.

**Status:** nothing filed, uploaded or commented. Filing defaults from the newest filed batch (`ebug-defaults.ts`: 2026-11-10-r1 — Creator WILLY_WU, TR261106-0051, [AIAgent], API) are for the reviewer to confirm. Dedupe is read-only, Android pool only (dedupe per OS): see `dedupe.txt`.

Rules: reviewer rules — one action per Repro step, a Spec Link on every entry (URL on its own line), at least one image per entry, no video; no failure-related entry, so no log. RD findings are `[AIAgent]`; the open question goes to PM as `[AIAgent][UX]` (user, 2026-11-11). Feature name `Batch_Editing:` (REQ-008). Spec basis check (REQ-055) done per entry.

**What is drafted:** 3 entries (ISS-BEA-12…14; numbering continues R1's) from 12 Fail rows: 2 defects (10 rows), 1 PM question (2 rows).

Legend — Class: Functional / UI / UX · Severity: S1 critical and blocking only, S2 important, S3 moderate · Owner: RD / PM.

---

## 1. ISS-BEA-12 — 「All」 (Apply to all) is never disabled in Crop & Rotate or Adjustment; tapping it after the apply applies again  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-153, TC-162, TC-042, TC-063, TC-163, TC-164, TC-075, TC-165  ·  **Reproduce:** 8/8  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** One ticket for both rooms: the same control (`batchApplyToAllBtn`, 「All」 / content-desc 「Apply to all」) and the one rule R-234 (PM Figma DR-04 【NEW】: 進 room 無修改 → disabled; 有未套用修改 → normal; 套用完成 → disabled; 切換照片依該張; Undo 退回 Apply to all → normal, Redo → disabled). Every state was read from the screenshot (white icon and text, identical pixels in every state) and from `els` (no `disabled` flag ever). Crop & Rotate: TC-153 (entering, after 3:2, after the apply), TC-162 (photo 2 with no change), TC-042 (tap after the apply: toast again, nothing changes), TC-063 (after Redo), TC-163 (size-only change via the pencil, R-236). Adjustment: TC-164 (entering, photo 2), TC-075 (after the apply, tap again: toast at 18:15:09 in logcat), TC-165 (after Redo). Exposure was set by a thumb drag (「0.62」, the row's 「+20」). Side effect: the extra no-change tap makes an empty Undo step (O-1; R1 O-11), which goes away once 「All」 is disabled after the apply. Spec basis checked: the 【NEW】 list sits on the PM UI board beside both rooms' default and applied frames (2026-11-11 Figma read, REQ-011); no newer frame draws 「All」 always enabled. Not in the R1 batch (R1 ran before the rule) nor in PHA262026P0057–P0061.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Batch_Editing: 「All」 is never disabled in Crop & Rotate or Adjustment, even after applying
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
7. Check 「All」 at the top right
8. Drag the Exposure slider to 0.62
9. Tap All
10. Check 「All」
11. Tap All
12. Check the result

Result:
「All」 is never disabled, even after the apply; tapping it again shows 「Applied to 11 photos」 again.
摘要：All 從未停用；套用後再按一次又顯示 Applied to 11 photos。
{20.19.0_bea12_adjust_enter_all_enabled.jpg} {20.19.0_bea12_adjust_after_apply_tap_again_toast.jpg} {20.19.0_bea12_adjust_photo2_no_change_all_enabled.jpg} {20.19.0_bea12_crop_after_apply_tap_again_toast.jpg}

Expect Result:
「All」 is disabled while the current photo has no unapplied change (on entering, after the apply).
摘要：目前照片沒有未套用的修改時（進入、套用後）All 為停用，點了無反應。

Note:
Device: Samsung Galaxy A53 5G (SM-A5360) / Android 15
Related: the same in the Crop & Rotate room (3:2, then All, then All again)
Spec Link: Batch Editing PM Figma, pm-ui-3 board (Batch Edit Room · Crop & Rotate / Adjustment, 【NEW】 Apply to all normal / disabled states, DR-04) -
https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13767
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Batch-Edit-R2_20.19.0_images/01_ISS-BEA-12/`

---

## 2. ISS-BEA-13 — With Color › Curve or HSL open, the thumbnail strip stays shown and tappable instead of fading out  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-166, TC-168  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-237 (PM Figma D1-12: 「展開 Color › Curve / HSL panel 時，批次縮圖列淡出且不能點（panel 為透明、疊在照片上，避免與曲線控制點／滑桿誤觸）」; Design 9_Adjust_curve and 9_Adjust_HSL draw no strip). In the app the strip (`batchAdjustStrip`) moves from y 1543 to y 1015–1196, above the panel, still after 3.5 s. The rest passes: collapsing with ﹀ or tapping 「Light」 brings the strip back under the photo and photo switching works there (TC-167, TC-168 steps 3–4); 「All」 stays shown. Spec basis checked: D1-12 is the decided rule (Q-17 answered, REQ-011); no newer frame draws the strip above the panel.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Batch_Editing: Thumbnail strip stays shown and tappable while Adjustment Curve or HSL is open
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
7. Tap Color
8. Tap Curve
9. Check the thumbnail strip
10. Tap photo 2's thumbnail
11. Check the result

Result:
The strip moves above the Curve panel and stays tappable: photo 2 becomes current. HSL is the same.
摘要：開啟 Curve 時縮圖列移到面板上方且完整顯示，點第 2 張即切換照片；HSL 相同。
{20.19.0_bea13_curve_strip_shown.jpg} {20.19.0_bea13_curve_tap_photo2_switches.jpg} {20.19.0_bea13_hsl_strip_shown.jpg}

Expect Result:
While Curve or HSL is open the strip fades out and cannot be tapped; 「All」 stays shown.
摘要：展開 Curve / HSL 時縮圖列淡出且不能點，右上 All 照常顯示。

Note:
Device: Samsung Galaxy A53 5G (SM-A5360) / Android 15
Spec Link: Batch Editing PM Figma, pm-ui-4 board (Batch Edit Room · Adjustment · curve_hsl, D1-12) -
https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13767
Spec Link: Batch Edit Design Figma, 9_Adjust_curve frame (strip hidden while Curve is open) -
https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=57-6798
Spec Link: Batch Edit Design Figma, 9_Adjust_HSL frame (strip hidden while HSL is open) -
https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=63-7874
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Batch-Edit-R2_20.19.0_images/02_ISS-BEA-13/`

---

## 3. ISS-BEA-14 — PM decision: one Undo after an edit + 「All」 reverts the 11 other photos but keeps the current photo's own edit  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-062, TC-076  ·  **Reproduce:** 4/4  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Seen in R1 (TC-062, TC-076, held as a PM question) and again in R2 on the SM-A5360: Crop TC-062 (3:2 + 「All」, Undo 1: photo 2 「1576 x 1970」 and photo 4 「2560 x 1439」 back, photo 1 still 「1706 x 1133」; Undo 2: photo 1 「1706 x 2559」); Adjustment TC-076 (Exposure 「0.62」 + 「All」: after the apply's Undo, photo 2 183/130/100 → 146/100/74, photo 1 unchanged 123/147/191 at 「0.62」). The app follows R-099's 「a single edit is that photo's own step」, so the behaviour may be the intended one: filed to PM for a decision (user, 2026-11-11), Type UX (how Undo feels), not a defect. In TC-076 the first Undo was an empty step left by a no-change 「All」 (O-1, see ISS-BEA-12). The image of TC-076 shows photo 1 (selected, still bright) beside photo 2 (back to its original).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Batch_Editing: One Undo after an edit and 「All」 keeps the current photo's own edit
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
7. Tap 3:2
8. Tap All
9. Tap Undo
10. Check photo 1 and photo 2

Result:
One Undo reverts the 11 other photos only; photo 1 keeps 3:2 (「1706 x 1133」) until a 2nd Undo.
摘要：一次 Undo 只還原其他 11 張，目前這張保留 3:2，需再按一次。
{20.19.0_bea14_crop_undo1_photo1_keeps_3x2.jpg} {20.19.0_bea14_adjust_undo_photo1_keeps_exposure.jpg}

Expect Result:
PM to decide whether one Undo also reverts the current photo's own edit (all 12 together) or not.
摘要：請 PM 決定一次 Undo 是否連目前這張的修改一起還原（12 張同時）。

Note:
Device: Samsung Galaxy A53 5G (SM-A5360) / Android 15
Related: the same in the Adjustment room (Exposure, then All, then Undo)
Spec Link: Batch Editing PM Figma, pm-ui-3 board (Batch Edit Room · Crop & Rotate / Adjustment · applied, DR-05b) -
https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13767
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Batch-Edit-R2_20.19.0_images/03_ISS-BEA-14/`

---

## Not raised (observations, for the record)

- O-1: Folded into ISS-BEA-12's note: a no-change 「All」 makes an empty Undo step (R1 O-11); gone once 「All」 is disabled after the apply.

## Reconciliation against the run

| Case | Result | Where |
|---|---|---|
| TC-153 | Fail defect | F-1 ISS-BEA-12 |
| TC-162 | Fail defect | F-1 ISS-BEA-12 |
| TC-042 | Fail defect | F-1 ISS-BEA-12 |
| TC-062 | Fail question | F-3 ISS-BEA-14 |
| TC-063 | Fail defect | F-1 ISS-BEA-12 |
| TC-163 | Fail defect | F-1 ISS-BEA-12 |
| TC-059 | Pass  | — |
| TC-164 | Fail defect | F-1 ISS-BEA-12 |
| TC-075 | Fail defect | F-1 ISS-BEA-12 |
| TC-076 | Fail question | F-3 ISS-BEA-14 |
| TC-165 | Fail defect | F-1 ISS-BEA-12 |
| TC-079 | Pass  | — |
| TC-081 | Pass  | — |
| TC-166 | Fail defect | F-2 ISS-BEA-13 |
| TC-167 | Pass  | — |
| TC-168 | Fail defect | F-2 ISS-BEA-13 |
