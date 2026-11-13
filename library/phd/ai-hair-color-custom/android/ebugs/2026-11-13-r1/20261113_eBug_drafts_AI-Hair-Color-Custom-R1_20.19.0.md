# AI Hair Color Custom (Android) — eBug drafts, round R1 (table v1), PhotoDirector 20.19.0 build 90201900

**Source:** spec-casebook run `library/phd/ai-hair-color-custom/android/runs/2026-11-13-r1/` — round R1 of draft `drafts/20261112-100854` (table v1, 85 cases), 2026-11-13 10:05 → 11:19 on Samsung Galaxy S23 (SM-S9110) / Android 16 through Appium / UiAutomator2, Test Server, a Free account (credits 1994 → 1916). Tally: 22 Blocked, 29 Fail, 34 Pass.

**Status:** nothing filed, uploaded or commented. TR: TR261111-0042 (user, 2026-11-13); its build 20.19.0.v202611111946 is versionCode 90201900, the build tested. ECL product 「PhotoDirector Mobile for Android」 (from the TR). Creator WILLY_WU and [AIAgent] prefilled from the Swipe Collage batch on the same TR.

Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per entry, the logcat excerpt on every failure- or charge-related entry, no video. No `[UX]`: `[AIAgent]` or `[AIAgent][UI]`, owner RD (Doc for copy). Spec basis check (REQ-055) done per entry: the spec is the PM Figma page only (no Design file, Q-15); QA rules (rule pass 8, system Back) are named as such in the QA notes.

**What is drafted:** 15 new entries (ISS-HCC-01…15). 6 items are held as PM questions (not drafted).

Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD / Doc.

---

## 1. ISS-HCC-01 — No slanted-face warning: a 45° tilted face opens the colour page at once  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-005, TC-012, TC-015  ·  **Reproduce:** 4/4  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-007 / R-009 / R-013 / R-014 (11/25 進房檢查 board: yaw or roll above 15° shows 「Please choose another photo」 / 「The face in this photo is too slanted, which may result in poorly generated results.」 with OK / Continue Anyway). Seen with hc_tilted30_4x5 (about 22° in the screenshot) and hc_tilted45_4x5 (the portrait rotated 45°) from the picker (TC-005), after Crop (TC-012) and from Edit Room › Portrait › Hair (TC-015). Log: doClairFaceDetect2 faceNum 1 each time, then the colour page; no warning. The face-too-small warning does show (TC-008), so only the slant check is missing. Blocked downstream: TC-006 / TC-087 / TC-007 (OK, Continue Anyway, Back on that dialog).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: No slanted-face warning: a face tilted 45° opens the colour page at once
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo whose face is tilted 45°
6. Check the result

Result:
The colour page opens at once (Generate 6); no slanted-face warning shows.
摘要：臉傾斜 45° 的照片直接進入顏色頁，沒有臉部歪斜提示。
{20.19.0_hcc01_tilted45_colour_page.jpg} {20.19.0_hcc01_after_crop_no_warning.jpg}

Expect Result:
「Please choose another photo」 / 「The face in this photo is too slanted…」 shows with OK and Continue Anyway.
摘要：應顯示臉部歪斜提示（OK / Continue Anyway）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), Color Selection · entry_warn_face (NEW) frame, Spec - 進房檢查 board - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3370-1668
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), Spec - 進房檢查 & Photo Picker board (11/25) - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3370-1666
Related: PHA262026P0039 (20.18.0, Assigned: a slanted face photo shows 「No face detected」); on 20.19.0 no dialog shows at all
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/01_ISS-HCC-01/`

---

## 2. ISS-HCC-02 — No-face dialog copy differs from the spec (「A face is required」)  ·  Class: UI  ·  Severity: S4  ·  Owner: Doc

**Report step:** TC-009  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-010 (11/25 進房檢查 board quotes the 10/E string: 「No face detected. Face is required for this feature.」). The app shows 「No face detected. A face is required for this feature.」. Behaviour (blocked, OK back to the picker) is as specified; copy only, owner Doc.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] AI_Hair_Color: No-face dialog reads 「A face is required」, not 「Face is required」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a photo with no face (a teacup)
6. Check the result

Result:
The dialog body reads 「No face detected. A face is required for this feature.」
摘要：無臉提示文字多了「A」。
{20.19.0_hcc02_no_face_copy.jpg}

Expect Result:
The body reads 「No face detected. Face is required for this feature.」
摘要：文字應為「No face detected. Face is required for this feature.」

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), Spec - 進房檢查 & Photo Picker board (11/25) - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3370-1666
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/02_ISS-HCC-02/`

---

## 3. ISS-HCC-03 — Custom panel: ︽ key instead of ⌄, the ✕ ↩ ↪ ✓ row stays under it, square top corners  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-019, TC-020  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-019 (⌄ collapse key at the top right), R-020 / D6-16 (the panel has no undo / redo and no ✕ / ✓), R-021 (Bottom_Sheet_bg, top corners rounded 20 pt, as ImageToVideoModelListPanel). The app draws a double up-chevron (custom_collapse_btn), keeps the room's closeBtn / undoBtn / redoBtn / saveResultBtn row under the panel, and the panel's top corners are square (pixel at (2,964) already panel black). Height 0.53 of the screen is within the 0.65 cap (holds). O-8: the palette keeps the same bottom row.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] AI_Hair_Color: Custom panel shows ︽ not ⌄, keeps the ✕ ↩ ↪ ✓ row, square corners
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo with one clear, front-facing face
6. Tap Custom in the swatch row
7. Check the panel's top-right key, its corners and the bottom row
8. Check the result

Result:
The key is ︽, the ✕ ↩ ↪ ✓ row stays under the panel, and the top corners are square.
摘要：收合鍵為︽、面板下方仍有 ✕ ↩ ↪ ✓ 列、上緣為直角。
{20.19.0_hcc03_panel_chevron_row_corners.jpg}

Expect Result:
A ⌄ key at the top right, no ✕ / ✓ or undo / redo row, top corners rounded 20 pt.
摘要：右上應為 ⌄、無 ✕ ✓ ↩ ↪ 列、上緣圓角 20pt。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), panel_open_no_style (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3327-824
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), Spec - UI board (UI source note) - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-94
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/03_ISS-HCC-03/`

---

## 4. ISS-HCC-04 — Colour rows are enabled before a style is chosen  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-021  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-023 (panel_open_no_style: before a style is chosen both colour rows and Generate are disabled, D6-03). With no style, tapping the first Base Color swatch selects it (peach ring); both rows are full colour. Generate is disabled and does nothing (holds).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Custom panel: colour rows can be picked before any style is chosen
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo with one clear, front-facing face
6. Tap Custom in the swatch row
7. Tap the dark brown swatch in Base Color
8. Check the result

Result:
The swatch gets the selection ring; the colour rows are not disabled before a style.
摘要：未選 style 時即可選色，顏色列未停用。
{20.19.0_hcc04_colour_selected_no_style.jpg}

Expect Result:
Both colour rows are disabled until a style is chosen.
摘要：選 style 前兩列顏色應為停用。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), panel_open_no_style (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3327-824
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/04_ISS-HCC-04/`

---

## 5. ISS-HCC-05 — Two-colour style with Base only: Generate is enabled and the 「both required」 text never shows  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-026, TC-027  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-029 (panel_two_tone: every style but Solid needs both colours; with one filled Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows under the rows, D6-04). Ombre + Base only: Generate turns orange and enabled (not tapped, it would charge 6). Balayage + Highlight only: Generate stays disabled (holds) but the message is missing too.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Ombre with only Base Color enables Generate; 「both required」 text never shows
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo with one clear, front-facing face
6. Tap Custom in the swatch row
7. Tap Ombre in Style
8. Tap the dark brown swatch in Base Color
9. Check the result

Result:
Generate turns orange and enabled; 「Both Base Color and Highlight Color are required.」 does not show.
摘要：只選 Base Color 時 Generate 已可按，且未顯示兩色皆需選擇的提示。
{20.19.0_hcc05_base_only_generate_enabled.jpg} {20.19.0_hcc05_highlight_only_no_message.jpg}

Expect Result:
Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows under the rows.
摘要：Generate 應停用，並顯示兩色皆需選擇的提示。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), panel_two_tone (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3327-1077
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/05_ISS-HCC-05/`

---

## 6. ISS-HCC-06 — Colour palette has no eyedropper key  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-031, TC-035  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-033 / R-037 (panel_palette: Cancel / Done, saturation-brightness square, hue slider, an eyedropper key right of the slider that works as in the app's existing palette). The page source has Cancel, Done, the square, the cursor and the hue SeekBar only; tapping the hair on the photo with the palette open does nothing.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Custom colour palette has no eyedropper key next to the hue slider
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo with one clear, front-facing face
6. Tap Custom in the swatch row
7. Tap Ombre in Style
8. Tap the colour wheel in Base Color
9. Check the result

Result:
The palette shows Cancel / Done, the colour square and the hue slider, but no eyedropper key.
摘要：調色盤沒有滴管鍵。
{20.19.0_hcc06_palette_no_eyedropper.jpg}

Expect Result:
An eyedropper key sits right of the hue slider and picks a colour from the photo.
摘要：hue slider 右側應有滴管鍵，可從照片取色。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), panel_palette (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3327-1204
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/06_ISS-HCC-06/`

---

## 7. ISS-HCC-07 — System Back in the palette closes the whole room, not just the palette  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-086  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-075 is a QA rule (rule pass 8, Android system Back): Back in the colour palette does what 「Cancel」 does (R-035: Cancel closes it without filling). Back from the palette (Base blue chosen, green being picked) closed AI Hair Color into the Edit Room and lost the Custom settings. Related: Back with the panel open also leaves the room (TC-085, held as Q-14).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: System Back in the colour palette leaves AI Hair Color, not just the palette
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo with one clear, front-facing face
6. Tap Custom in the swatch row
7. Tap Ombre in Style
8. Tap the colour wheel in Base Color
9. Drag the hue slider to green
10. Press the system Back key
11. Check the result

Result:
AI Hair Color closes into the Edit Room; the palette and Custom settings are gone.
摘要：按系統返回鍵直接離開 AI Hair Color 進入 Edit Room，設定遺失。
{20.19.0_hcc07_palette_before_back.jpg} {20.19.0_hcc07_back_lands_edit_room.jpg}

Expect Result:
Back closes only the palette like Cancel; the room and the Custom settings stay.
摘要：返回鍵應只關閉調色盤（同 Cancel）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), panel_palette (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3327-1204
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/07_ISS-HCC-07/`

---

## 8. ISS-HCC-08 — Collapsing the panel never selects Custom; the outer Generate makes the Soft Black template  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-038, TC-040, TC-041, TC-042  ·  **Reproduce:** 5/5  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-043 / R-044 / R-042 and flow arrow 3337-1879 (⌄ = apply: the template row is back, the Custom cell is selected and shows the chosen colours, the outer Generate is enabled). After ︽ the selection stays on 「Soft Black」 and the Custom cell keeps its gradient + wand look; the outer Generate then started a TEMPLATE generation (log GenAI_Feature_Generate is_customize FALSE style Style_6001_Solid-Soft-Black_ChatGPT, 6 charged, 10:44:47) instead of the Custom one. Settings themselves are kept and overwritten correctly (TC-041 / TC-042 parts hold). The Custom cell's look before / after is Q-2 (gradient + ＋ vs pencil) and is not part of this entry.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Collapsing Custom panel keeps Soft Black selected; Generate makes a template
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap Stock
6. Search 「woman portrait」 in Pexels
7. Tap the portrait of a woman in a knitted hat
8. Tap Custom in the swatch row
9. Tap Ombre in Style
10. Tap the dark brown swatch in Base Color
11. Tap the purple swatch in Highlight Color
12. Tap the collapse key at the top right of the panel
13. Tap Generate
14. Check the result

Result:
Soft Black stays selected after collapsing and Generate makes a Soft Black template result (6 credits).
摘要：收合後仍選 Soft Black，外部 Generate 產生的是 Soft Black 模板結果。
{20.19.0_hcc08_collapse_soft_black_selected.jpg} {20.19.0_hcc08_outer_generate_template_result.jpg} {20.19.0_hcc08_log.txt}

Expect Result:
Collapsing selects the Custom cell with the chosen colours and Generate makes the Custom result.
摘要：收合應選中 Custom 並顯示所選顏色，Generate 產生 Custom 結果。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), collapsed_applied (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-512
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), flow arrow panel_ready ⌄ → collapsed_applied - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3337-1879
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/08_ISS-HCC-08/`

---

## 9. ISS-HCC-09 — Tapping the photo above the Custom panel does not collapse it  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-039  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-042 (collapsed_applied: tapping outside the panel or its ⌄ key both apply the settings, D6-08). Taps at (540,600) and (300,350) on the photo leave the panel open; only the collapse key closes it.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Tapping the photo above the Custom panel does not collapse the panel
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo with one clear, front-facing face
6. Tap Custom in the swatch row
7. Tap Ombre in Style
8. Tap the dark brown swatch in Base Color
9. Tap the purple swatch in Highlight Color
10. Tap the photo above the panel
11. Check the result

Result:
Nothing happens; the panel stays open.
摘要：點面板外的照片，面板不會收合。
{20.19.0_hcc09_panel_stays_after_photo_tap.jpg}

Expect Result:
Tapping outside the panel collapses it and applies the settings, like ⌄.
摘要：點面板外應收合並套用設定。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), collapsed_applied (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-512
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/09_ISS-HCC-09/`

---

## 10. ISS-HCC-10 — Custom wait shows only a scan bar: no 「Applying your new hair color...」 text  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-045, TC-046  ·  **Reproduce:** 9/9  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-047 (Spec - Flow: a Custom generation waits in place for about 42–48 s with staged reassuring strings, the first 「Applying your new hair color...」, D6-11; the later strings are Q-10). On every Custom generation of the run (9) only a moving peach scan bar shows over the enlarged photo; no text on screen or in the accessibility tree. Waits measured from the log 46–56 s (10:42:22.1 → 10:43:13.6 = 51.5 s for the first).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] AI_Hair_Color: Custom generation wait shows no 「Applying your new hair color...」 text
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap Stock
6. Search 「woman portrait」 in Pexels
7. Tap the portrait of a woman in a knitted hat
8. Tap Custom in the swatch row
9. Tap Ombre in Style
10. Tap the dark brown swatch in Base Color
11. Tap the purple swatch in Highlight Color
12. Tap Generate in the panel
13. Watch the screen until the result shows
14. Check the result

Result:
Only a scan bar moves over the photo for about 51 s; no reassuring text shows.
摘要：約 51 秒等待只有掃描條動畫，沒有提示文字。
{20.19.0_hcc10_wait_scan_bar_no_text.jpg} {20.19.0_hcc10_wait_later_no_text.jpg} {20.19.0_hcc10_log.txt}

Expect Result:
「Applying your new hair color...」 shows, then the later reassuring strings change during the wait.
摘要：等待時應顯示「Applying your new hair color...」並分段更換文字。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), Spec - Flow board - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-93
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), flow arrow generating → result_custom - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-1558
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/10_ISS-HCC-10/`

---

## 11. ISS-HCC-11 — No Intensity bar on a Custom result (panel open or collapsed)  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-047, TC-048, TC-049, TC-053  ·  **Reproduce:** 4/4  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-041 / R-052 / R-054 / R-056 (result_custom: the result shows in place with the Intensity bar 0–100 %, default 100 %, D6-12 / D1-14; in-panel Generate puts a 44 pt Intensity row above the button, D6-22 / D6-23, Q-4 for the frame name only). No Intensity row or slider in the page source after any Custom or template result, panel open or collapsed, so Intensity cannot be dragged or reset to 100 on Retry.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Custom result has no Intensity bar, panel open or collapsed
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap Stock
6. Search 「woman portrait」 in Pexels
7. Tap the portrait of a woman in a knitted hat
8. Tap Custom in the swatch row
9. Tap Ombre in Style
10. Tap the dark brown swatch in Base Color
11. Tap the purple swatch in Highlight Color
12. Tap Generate in the panel
13. Wait for the result
14. Check the result

Result:
The result shows and the button reads Retry, but there is no Intensity bar.
摘要：結果出現、按鈕變 Retry，但沒有 Intensity 調整條。
{20.19.0_hcc11_result_no_intensity.jpg} {20.19.0_hcc11_collapsed_result_no_intensity.jpg}

Expect Result:
An Intensity bar at 100 % appears above Retry and adjusts the result's strength.
摘要：Retry 上方應出現 Intensity 條（預設 100%）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), result_custom (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-718
Spec Link: AI Hair Color PM Figma (26 10E AI Hair Color v2, cited by the Custom page), Spec - UI rules D1-15 / D1-16 / D1-19 (Artwork save, Intensity) - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3030-302
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/11_ISS-HCC-11/`

---

## 12. ISS-HCC-12 — No one-time 「My AI Artwork keeps the 100% version」 dialog on the first result  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-057  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-059 (10/E D1-15, cited by result_custom: when the first result appears a one-time dialog says My AI Artwork keeps only the 100 % version; 「Don't show again」 stops it). The first successful result of the run (10:43:13) showed no dialog. It may be tied to the missing Intensity bar (ISS-HCC-11); RD may merge.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: First Custom result shows no one-time My AI Artwork 100% dialog
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap Stock
6. Search 「woman portrait」 in Pexels
7. Tap the portrait of a woman in a knitted hat
8. Tap Custom in the swatch row
9. Tap Ombre in Style
10. Tap the dark brown swatch in Base Color
11. Tap the purple swatch in Highlight Color
12. Tap Generate in the panel
13. Wait for the first result
14. Check the result

Result:
The result shows with no one-time dialog.
摘要：第一次結果出現時沒有一次性說明對話框。
{20.19.0_hcc12_first_result_no_dialog.jpg}

Expect Result:
A one-time dialog says My AI Artwork keeps only the 100% version, with Don't show again.
摘要：應出現一次性對話框說明 My AI Artwork 只保存 100% 版本。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color PM Figma (26 10E AI Hair Color v2, cited by the Custom page), Spec - UI rules D1-15 / D1-16 / D1-19 (Artwork save, Intensity) - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3030-302
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), result_custom (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-718
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/12_ISS-HCC-12/`

---

## 13. ISS-HCC-13 — Switching to a template and back to Custom does not recall the Custom result  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-054  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-055 (result_custom: switching away from Custom and back recalls the Custom result and its Intensity, with no new generation and no charge, D6-12 / D1-19). After a Custom Ombre result and a Soft Black template result, tapping Custom reopens the panel with the settings but the photo still shows the Soft Black result. No generation, no charge (chip 1982). Reached through the collapse defect (ISS-HCC-08), which auto-selects Soft Black.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Tapping Custom after a template result does not bring back the Custom result
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap Stock
6. Search 「woman portrait」 in Pexels
7. Tap the portrait of a woman in a knitted hat
8. Tap Custom in the swatch row
9. Tap Ombre in Style
10. Tap the dark brown swatch in Base Color
11. Tap the purple swatch in Highlight Color
12. Tap Generate in the panel
13. Wait for the result
14. Tap the collapse key
15. Tap Generate
16. Wait for the Soft Black result
17. Tap Custom in the swatch row
18. Check the result

Result:
The panel opens with the Custom settings, but the photo still shows the Soft Black result.
摘要：切回 Custom 後照片仍顯示 Soft Black 結果，未叫回 Custom 結果。
{20.19.0_hcc13_custom_tap_shows_template_result.jpg}

Expect Result:
The Custom result is shown again with no new generation and no charge.
摘要：應叫回 Custom 結果，不重新生成、不扣點。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), result_custom (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-718
Spec Link: AI Hair Color PM Figma (26 10E AI Hair Color v2, cited by the Custom page), Spec - UI rules D1-15 / D1-16 / D1-19 (Artwork save, Intensity) - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3030-302
Related: PHA262026P0047 (20.18.0, Assigned: preview resets to the original after switching to a template not used in generation)
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/13_ISS-HCC-13/`

---

## 14. ISS-HCC-14 — ✕ and system Back on a result ask 「Discard changes?」 and land in the Edit Room, not the Launcher  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-079, TC-088, O-1, O-3  ·  **Reproduce:** 4/4  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-068 (10/E D1-20b: ✕ gives up this edit and returns to the screen before entry — Launcher / Edit Room / My AI Artwork — with no second confirmation). R-076 is a QA rule (rule pass 8: system Back does what ✕ does). Entered from Launcher › AI Photos: ✕ and Back on a result show 「Discard changes?」 / 「All your existing changes will be lost.」 / Keep / Discard, and Discard lands in the Edit Room with the original photo. Without a result (O-1, O-3) ✕ and Back also land in the Edit Room. The result is still in My AI Artwork (saved on success, holds).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: ✕ on a result asks 「Discard changes?」, then opens Edit Room, not Launcher
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap Stock
6. Search 「woman portrait」 in Pexels
7. Tap the portrait of a woman in a knitted hat
8. Tap Custom in the swatch row
9. Tap Solid in Style
10. Tap the navy swatch in Base Color
11. Tap Generate in the panel
12. Wait for the result
13. Tap the collapse key
14. Tap ✕ at the bottom left
15. Tap Discard
16. Check the result

Result:
「Discard changes?」 shows; Discard opens the Edit Room with the photo instead of the Launcher.
摘要：按 ✕ 會跳「Discard changes?」確認，之後進入 Edit Room 而非回到 Launcher。
{20.19.0_hcc14_x_discard_dialog.jpg} {20.19.0_hcc14_discard_lands_edit_room.jpg} {20.19.0_hcc14_back_discard_dialog.jpg}

Expect Result:
✕ returns straight to the Launcher (the screen before entry) with no confirmation.
摘要：✕ 應不經確認直接回到進入前的畫面（Launcher）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color PM Figma (26 10E AI Hair Color v2, cited by the Custom page), Spec - UI rule D1-20b (✕ leaves with no confirmation) - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3030-296
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), result_custom (NEW) frame, Spec - UI - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-718
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/14_ISS-HCC-14/`

---

## 15. ISS-HCC-15 — Credit chip keeps the charged balance after a refunded generation  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** O-9  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** R-067 (Spec - Flow; KP-020: the top-bar credit chip shows the current balance) and the refund rule R-065. Two Custom generations on hc_portrait_4x5 were rejected (CONTENT_REJECTED, nsfw_failed — the Shutterstock-watermarked fixture, not a bug, O-10) after about 41 s; the dialog says 「The credits have been refunded.」 and the server refunds (totalRemain 1988 → 1994 at the next call, Details 「Generation failed, credits returned +6」), but the room's chip stays at 1988 until the room is left and reopened. Observation, closest TC-045 / TC-050; the run's refund check (rule 8) holds on the server side.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] AI_Hair_Color: Credit chip still shows the charged balance after a refunded failed generation
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap AI Photos on the Launcher
3. Tap AI Hair Color
4. Tap Continue on the photo tips sheet
5. Tap a portrait photo the generation will reject
6. Tap Custom in the swatch row
7. Tap Ombre in Style
8. Tap the dark brown swatch in Base Color
9. Tap the purple swatch in Highlight Color
10. Read the credit chip
11. Tap Generate in the panel
12. Wait for 「Please Try Different Content」
13. Tap OK
14. Read the credit chip
15. Check the result

Result:
The dialog says the credits were refunded, but the chip still shows 1988 instead of 1994.
摘要：提示已退款，但額度顯示仍為扣點後的 1988。
{20.19.0_hcc15_chip_stale_after_refund.jpg} {20.19.0_hcc15_rejected_dialog.jpg} {20.19.0_hcc15_log.txt}

Expect Result:
The chip shows the refunded balance (1994) once the refund is made.
摘要：退款後額度應即時更新為 1994。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), Spec - Flow board - https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-93
<Claude Reviewed>
```

**Images:** `20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0_images/15_ISS-HCC-15/`

---

# Held — PM questions (not drafted)

| Item | Kind | What to decide |
|---|---|---|
| TC-017 | PM question (Q-2) | The Custom cell is an orange gradient with a magic-wand icon (the notes say ＋, the mockups a pencil), and the first template is 「Soft Black」, not 「Platinum」. Which look and which first template are right? |
| TC-085 | PM question (Q-14) | System Back with the Custom panel open leaves the room into the Edit Room and discards the settings. The spec is silent on Android Back here: collapse (apply), or leave? |
| O-2 | PM question | 「Cancel」 on the >16:9 ratio dialog opens the photo in the Edit Room, not the picker. R-012 only says Cancel gives up entering: is the Edit Room expected? |
| O-11 | PM question | A Custom generation whose app was force-stopped mid-wait still finished on the server and appears in My AI Artwork, while the room recalls nothing and the 6 credits stay charged. Intended? |
| O-13 | PM question | Every Custom style logs the same Mixpanel style id Style_010_Custom_HairColor_gpt-image-2.5-sunburst, so analytics cannot tell Ombre from Solid etc. Is a per-style value expected? |
| O-7 / O-14 | PM question | A palette colour is added as one extra swatch after the wheel (rows grow to 8 + wheel) and replaces the previous extra; it stays after leaving the room. R-022 says 7 recommended colours. Intended? |

# Not raised (observations, for the record)

| Item | What was seen | Why not raised |
|---|---|---|
| O-4 | New fixture hc_tilted45_4x5.jpg pushed for TC-005. | Test data, added to fixtures. |
| O-5 | The colour page opens with 「Soft Black」 selected. | Matches R-017 (first template selected); the first-template name is TC-017's question. |
| O-6 | Split-dye thumbnails are photos; style names and crowns listed. | Assets look finished (R-025 said placeholders); no defect. |
| O-8 | Palette header over the photo; ✕ ↩ ↪ ✓ row stays under the palette. | Same bottom-row point as ISS-HCC-03; no separate entry. |
| O-10 | Shutterstock-watermarked fixtures rejected as content violations (refunded). | Server moderation of a watermarked stock photo; not a bug. Run used a Pexels portrait. |
| O-12 | Panel button keeps reading 「Retry」 during a Retry wait. | Run note for timing; the spec does not say what the button reads while waiting. |
| O-15 | Premium styles (crown) show 「UNLOCK TO VIP」 and Generate opens the paywall. | As specified (TC-069 Pass). |
| Blocked (22) | 3 defect, 4 observability, 15 test-data | No verdict; reasons in report.md. TC-006 / TC-087 / TC-007 are blocked by ISS-HCC-01. |

# Reconciliation against the run

29 Fail (27 defect, 2 question), 22 Blocked, 0 Not run, 15 observations (O-1 … O-15).

| Item | Result | Disposition | Became |
|---|---|---|---|
| TC-005 | Fail | defect | 1. ISS-HCC-01 |
| TC-009 | Fail | defect | 2. ISS-HCC-02 |
| TC-012 | Fail | defect | 1. ISS-HCC-01 |
| TC-015 | Fail | defect | 1. ISS-HCC-01 |
| TC-017 | Fail | question | held — PM question Q-2 |
| TC-019 | Fail | defect | 3. ISS-HCC-03 |
| TC-020 | Fail | defect | 3. ISS-HCC-03 |
| TC-021 | Fail | defect | 4. ISS-HCC-04 |
| TC-026 | Fail | defect | 5. ISS-HCC-05 |
| TC-027 | Fail | defect | 5. ISS-HCC-05 |
| TC-031 | Fail | defect | 6. ISS-HCC-06 |
| TC-035 | Fail | defect | 6. ISS-HCC-06 |
| TC-086 | Fail | defect | 7. ISS-HCC-07 |
| TC-038 | Fail | defect | 8. ISS-HCC-08 |
| TC-039 | Fail | defect | 9. ISS-HCC-09 |
| TC-041 | Fail | defect | 8. ISS-HCC-08 |
| TC-042 | Fail | defect | 8. ISS-HCC-08 |
| TC-085 | Fail | question | held — PM question Q-14 |
| TC-045 | Fail | defect | 10. ISS-HCC-10 |
| TC-057 | Fail | defect | 12. ISS-HCC-12 |
| TC-046 | Fail | defect | 10. ISS-HCC-10 |
| TC-047 | Fail | defect | 11. ISS-HCC-11 |
| TC-040 | Fail | defect | 8. ISS-HCC-08 |
| TC-048 | Fail | defect | 11. ISS-HCC-11 |
| TC-053 | Fail | defect | 11. ISS-HCC-11 |
| TC-049 | Fail | defect | 11. ISS-HCC-11 |
| TC-054 | Fail | defect | 13. ISS-HCC-13 |
| TC-079 | Fail | defect | 14. ISS-HCC-14 |
| TC-088 | Fail | defect | 14. ISS-HCC-14 |
| O-1 | observation | — | 14. ISS-HCC-14 |
| O-2 | observation | — | held — PM question |
| O-3 | observation | — | 14. ISS-HCC-14 |
| O-4 | observation | — | not raised |
| O-5 | observation | — | not raised |
| O-6 | observation | — | not raised |
| O-7 | observation | — | held — PM question (with O-14) |
| O-8 | observation | — | not raised |
| O-9 | observation | — | 15. ISS-HCC-15 |
| O-10 | observation | — | not raised |
| O-11 | observation | — | held — PM question |
| O-12 | observation | — | not raised |
| O-13 | observation | — | held — PM question |
| O-14 | observation | — | held — PM question (with O-7) |
| O-15 | observation | — | not raised |

Filing order by severity: **1**, **5**, **7**, **8**, **11**, **3**, **4**, **6**, **9**, **10**, **12**, **13**, **14**, **15**, **2**. Nothing is filed until the review page's decisions come back.
