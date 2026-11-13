# Swipe Collage (Android) — eBug drafts, run R1 (table v3), PhotoDirector 20.19.0 build 90201900

**Source:** spec-casebook run `library/phd/swipe-collage/android/runs/2026-11-12-r1/` — phase R1 of draft `drafts/20261112-094820` (table v3, 187 rows), 2026-11-12 on Samsung Galaxy S23 (SM-S9110, Android 16) through Appium / UiAutomator2, Test Server; Free for R1-a, R1-b, R1-g, R1-h, Premium through the debug switch for R1-c – R1-f. Tally: 89 Pass, 76 Fail, 22 Blocked, 0 Not run.

**Status:** nothing filed, uploaded or commented. No batch of this feature has been filed, so the review page offers Creator WILLY_WU, [AIAgent], API (newest PHD Android batch, phd/cutout 2026-11-10-r1) and TRCode TR261111-0042 (user, 2026-11-12). Dedupe: see `dedupe.txt` (Android pool only, dedupe per OS).

Rules: reviewer rules — one action per Repro step, a Spec Link on every entry (URL on its own line; the PM spec is a PDF with no Figma link, cited by board and spec ID), at least one image per entry, a logcat excerpt on the entries where a step ends with nothing, no video. RD findings are `[AIAgent]` / `[AIAgent][UI]`; open questions and Design-vs-PM conflicts go to PM (`[AIAgent][UX]` for user experience, `[UI]` for text, Functional otherwise; user, 2026-11-11). System Back findings rest on the team rule R-134 (Q-14). Feature name `Swipe_Collage:`. Spec basis check (REQ-055) done per entry against `requirements.md` and the Design boards.

**What is drafted:** 48 entries (ISS-SWC-01…48) from 76 Fail rows and 5 observations: 36 to RD, 12 to PM.

Legend — Class: Functional / UI / UX · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD / PM.

---

## 1. ISS-SWC-01 — PM decision: the banner and Template Page use 「Scrollable Collage」 copy, the Design 「Swipe Collage」  ·  Class: UI  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-001, TC-003, TC-009  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The banner reads 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」 with an orange 「NEW」 tag and no collage picture; the Template Page is titled 「Scrollable Collage」. Full expectation: PM to decide the feature name and banner copy. The Design draws 「Try Swipe Collage!」 / 「Create the perfect year-end recap post.」 with a collage picture and no NEW tag, and titles the page 「Swipe Collage」; the PM file writes 「Scrollable Collage」 and draws 「NEW ›」. R-003 / R-004 / R-010; Q-1 was answered by the Design in the analysis (Design outranks PM for UI copy), but Q-28 says the dates cannot tell which file is newer, and the PM file still writes 「Scrollable Collage」, so the text rule (two sheets disagree) sends it to PM. NEW tag: Q-18 (PM draws 「NEW ›」, the Design none). Seen on every entry (TC-001, TC-003, TC-009) and O-2 at the probe. Localisation of these strings is ISS-SWC-47.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Banner and page title read 「Scrollable Collage」, the Design 「Swipe Collage」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Check the banner under the layout tabs
4. Tap the banner
5. Check the page title

Result:
The banner reads 「Try Scrollable Collage!」 with a NEW tag and no picture; the page title is 「Scrollable Collage」.
摘要：Banner 與標題都用「Scrollable Collage」，有 NEW、無圖。
{20.19.0_swc01_banner_scrollable_copy.jpg} {20.19.0_swc01_title_scrollable_collage.jpg}

Expect Result:
PM to decide the name: the Design says 「Swipe Collage」 (banner 「Try Swipe Collage!」), the PM 「Scrollable Collage」.
摘要：請 PM 決定名稱：Design 為 Swipe Collage，PM 為 Scrollable Collage。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Collage Room · banner (NEW) board (banner copy and picture) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=1-238
Spec Link: Swipe Collage Design Figma, Template Page · default (NEW) board (page title) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=3-336
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/01_ISS-SWC-01/`

---

## 2. ISS-SWC-02 — Template card thumbnails and the Template Preview never render: empty boxes, no page dots  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-011, TC-016, TC-021, TC-022  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Every card in Year End, Daily and Travel is an empty dark box with only its label (also after a relaunch); the Template Preview is blank with no page dots, and swiping a card or the preview shows nothing. Logcat shows no error. Full expectation: Each card shows the template's first page with page dots that follow a swipe; the Template Preview shows the pages with dots and moves page by page. Waited 10 s, relaunched, all three categories; the network was fine (Launcher and Collage room images load). The thumbnail pager and preview_pager exist in the page source but draw nothing. TC-018 (East / West sets by language) is Blocked upstream of this. The only app error lines in the window are TemplateMetadata 「No value for info」 (also seen in the Collage room), kept in the excerpt for RD.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Template card thumbnails and the Template Preview stay blank, with no page dots
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Wait 10 seconds
5. Check the template cards
6. Swipe a card left
7. Tap the Year End 「7 photos · 3 pages」 card
8. Swipe the preview left
9. Check the preview

Result:
Every template card is an empty box and the Template Preview is blank, with no page dots.
摘要：所有範本卡片都是空白方塊，預覽也是空白、沒有頁點。
{20.19.0_swc02_template_cards_blank.jpg} {20.19.0_swc02_preview_blank_no_dots.jpg} {20.19.0_swc02_log.txt}

Expect Result:
Each card shows the template's first page with page dots, and the preview shows its pages.
摘要：卡片顯示範本第一頁與頁點，預覽顯示各頁內容。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: the East / West thumbnail check (TC-018) is blocked by this
Spec Link: Swipe Collage Design Figma, Template Page · default (NEW) board (card thumbnail with page dots) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=3-336
Spec Link: Swipe Collage Design Figma, entry_launcher2 board (Template Preview with page dots) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=18-386
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/02_ISS-SWC-02/`

---

## 3. ISS-SWC-03 — Templates open with more empty frames than their card's photo count (2 photos → 3 frames, 4 photos → 5)  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-024  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The 「2 photos · 1 pages」 template opens with 3 empty frames (a stamp and two polaroids); Daily 「4 photos · 1 pages」 opens with 5. Full expectation: The Canvas opens with the template's layout: as many empty 「+」 frames as the photo count on its card. TC-024 and O-3. The preview could not be compared (blank, ISS-SWC-02), so the photo count on the card is the only reference. The picker limit follows the empty frames (3), so the user is asked for 3 photos for a 「2 photos」 template.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Template opens with more empty frames than its photo count
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the first Year End 「2 photos · 1 pages」 card
5. Tap Use Template
6. Count the empty frames on the Canvas

Result:
The 「2 photos」 template opens with 3 empty frames (Daily 「4 photos」 opens with 5).
摘要：「2 photos」範本開出 3 個空框（Daily「4 photos」有 5 個）。
{20.19.0_swc03_two_photo_template_three_frames.jpg}

Expect Result:
The Canvas has as many empty 「+」 frames as the photo count on the card.
摘要：空的「+」框數應等於卡片標示的照片數。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: Year End 「7 photos · 3 pages」 opens with 7 frames (matches)
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-template-page board (D1-01: each card shows the template's default photo count)
Spec Link: Swipe Collage Design Figma, canvas_default board (empty frames with 「+」) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=69-6711
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/03_ISS-SWC-03/`

---

## 4. ISS-SWC-04 — The first tap on an empty frame's 「+」 only selects the frame; a second tap opens the picker  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-040  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The first tap only selects the frame (orange box, floating Duplicate / Delete, frame tool bar); only a second tap on 「+」 opens the photo picker. Seen on every template tried. Full expectation: Tapping a frame's 「+」 opens the photo picker. TC-040 step 1 and O-5. Tapping the 「+」 of a frame that is already selected can also deselect it. The capture r1a-tc040-picker.png is the state after the first tap (named before the picker opened).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: First tap on an empty frame's 「+」 only selects the frame
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the first Year End 「2 photos · 1 pages」 card
5. Tap Use Template
6. Tap the 「+」 of the stamp frame
7. Check the screen

Result:
The first tap only selects the frame; a second tap on 「+」 opens the photo picker.
摘要：第一次點只選取框，要再點一次「+」才開相片挑選器。
{20.19.0_swc04_first_tap_selects_frame.jpg}

Expect Result:
Tapping a frame's 「+」 opens the photo picker.
摘要：點框的「+」直接開啟相片挑選器。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), flow-table board (F4: tapping 「+」 opens the photo picker)
Spec Link: Swipe Collage Design Figma, photo_picker board (picker opened from 「+」) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=23-531
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/04_ISS-SWC-04/`

---

## 5. ISS-SWC-05 — PM decision: photo picker copy and controls match neither the Design nor the PM mock  ·  Class: UI  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-040  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Tabs 「All」 (album dropdown, 「Tap to expand albums」) / 「Stock」; tray 「Select 1 to 3 photos to continue. (0/3)」 with a 「Next」 button. Full expectation: PM to decide the picker copy. The Design draws tabs 「Photo」 / 「Stock」, albums Recents / Sample Photos / Favorites / Instagram, 「Please select 3 photos to continue.」 「(0/3)」 and an orange ✓; the PM mock 「Select up to 3 photos」 and 「Done (2)」; R-036 says it is the Collage picker. TC-040 (the picker part). Limit 3 = empty frames matches. Q-28 (Design vs PM). The text may simply be the existing Collage picker, which R-036 allows; PM should say which copy ships.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Photo picker reads 「All」 and 「Select 1 to 3 photos to continue.」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the first Year End 「2 photos · 1 pages」 card
5. Tap Use Template
6. Tap the 「+」 of the stamp frame
7. Tap the 「+」 again
8. Check the picker

Result:
Tabs read 「All」 / 「Stock」 and the tray 「Select 1 to 3 photos to continue. (0/3)」 with 「Next」.
摘要：分頁 All / Stock，提示「Select 1 to 3 photos…」與 Next。
{20.19.0_swc05_picker_tabs_and_tray_copy.jpg}

Expect Result:
PM to decide the copy: Design 「Please select 3 photos to continue.」 with 「Photo」, PM mock 「Select up to 3 photos」.
摘要：請 PM 決定挑選器文案（Design 與 PM 草圖不同）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, photo_picker board (tabs, tray copy and ✓) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=23-531
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-photo-picker board (D2-06: 「Select up to 3 photos」, 「Done (2)」)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/05_ISS-SWC-05/`

---

## 6. ISS-SWC-06 — Selected photos are not marked in the picker grid  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-041  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Both photos appear in the tray with ✕ and 「(2/3)」, 「Next」 turns orange, but the grid marks neither (no number, tick or highlight). Full expectation: Selected photos are marked in the grid (the PM mock numbers them 1, 2). TC-041. The tray part is right (thumbnails with ✕, count). Basis: the PM mock's selection numbers (row note).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Selected photos are not marked in the photo picker grid
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the first Year End 「2 photos · 1 pages」 card
5. Tap Use Template
6. Tap the 「+」 of the stamp frame
7. Tap the 「+」 again
8. Tap 2 photos in the grid
9. Check the grid

Result:
The 2 photos show in the tray with 「(2/3)」, but the grid does not mark them.
摘要：托盤有 2 張且顯示 (2/3)，但格狀清單上沒有標記。
{20.19.0_swc06_grid_no_selection_marks.jpg}

Expect Result:
Selected photos are marked in the grid (the PM mock numbers them 1, 2).
摘要：已選照片在清單上要有標記（PM 草圖以 1、2 編號）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-photo-picker board (F4 / D2-06: selection numbers 1, 2 in the grid)
Spec Link: Swipe Collage Design Figma, photo_picker board (selected photos) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=23-531
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/06_ISS-SWC-06/`

---

## 7. ISS-SWC-07 — Picker limit is the current page's empty frames, not the canvas's, and has no 20 cap  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-045, TC-046  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The picker allows 3 (「Select 1 to 3 photos to continue.」, toast 「You can only select 3 photos.」): the empty frames of page 1 only, not the canvas's 7; a page with 23 empty frames allowed 23 (no 20 cap). Full expectation: The limit is the number of empty frames (F4), capped at 20 on both platforms (D2-06); the 7 photos of a 7-photo template can be picked at once and fill the frames in order. TC-046 (7 empty frames: 3 on page 1, 2 on page 2, 2 on page 3; picker from a page-2 frame reads 1 to 2) and TC-045 (23 frames made with Duplicate on page 2: 23 allowed, the 24th refused). The wording 「limit = number of empty frames」 does not say per page; the 7-photo template and ✓ 「fills the empty frames in order」 (R-039) imply the whole canvas.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Photo picker limit counts only the current page's frames and has no 20 cap
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Tap 7 photos
9. Check the tray

Result:
Only 3 can be picked on a 7-frame canvas (page 1's frames), while a 23-frame page allows 23.
摘要：7 框範本只能選 3 張（只算本頁）；23 框的頁面可選 23 張。
{20.19.0_swc07_limit_three_on_seven_frame_canvas.jpg} {20.19.0_swc07_limit_23_no_cap.jpg}

Expect Result:
The limit is the number of empty frames, capped at 20: all 7 photos can be picked at once.
摘要：上限為空框數、最多 20 張：7 張可一次選完。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: Android's default limit of 6 is not applied (that part is right)
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-photo-picker board (D2-06: import limit capped at 20 on both platforms)
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas board (F4: the limit is the number of empty frames)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/07_ISS-SWC-07/`

---

## 8. ISS-SWC-08 — PM decision: the Canvas has a top bar and no ✕ / ✓ row; it matches neither the Design nor the PM mock  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-026  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: A top bar with 「‹」, a credit pill 「--」, info, history and ☰, and a download icon (「Save」) under it; the bottom tool bar Background / Layers / + / Ratio / Pages has no ✕ / ✓ row, and ↶ ↷ float at the left above it. Full expectation: PM to decide the Canvas controls: the Design draws no top bar and a bottom row ✕ ↶ ↷ ✓ (✓ = export, Q-29); the PM mock a top 「‹」, ↶ ↷ and 「Export」. TC-026. Q-28 (dates cannot tell Design and PM apart) and Q-29 (is the Design's ✓ the export?). Debug buttons 「Save Template」 / 「import Template」 also overlay every canvas (O-4, not filed: test-build controls). The credit pill 「--」 is ISS-SWC-21.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Swipe_Collage: Canvas has a top bar and no ✕ / ✓ row, unlike the Design
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Check the top of the Canvas
7. Check the bottom of the Canvas

Result:
The Canvas has a top bar (‹, credits, info, history, ☰) and no ✕ / ✓ row under the tool bar.
摘要：Canvas 有頂列，工具列下方沒有 ✕ / ✓ 列。
{20.19.0_swc08_canvas_top_bar_no_x_check_row.jpg}

Expect Result:
PM to decide: the Design draws no top bar and ✕ ↶ ↷ ✓ at the bottom; the PM mock a top ‹, ↶ ↷ and Export.
摘要：請 PM 決定：Design 無頂列、下方 ✕ ↶ ↷ ✓；PM 為上方 ‹ 與 Export。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, canvas_default board (no top bar; ✕ ↶ ↷ ✓ under the tool bar) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=69-6711
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas board (D1-04: top 「‹」, undo / redo and 「Export」)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/08_ISS-SWC-08/`

---

## 9. ISS-SWC-09 — 「Discard」 on 「Discard changes?」 returns to the Template Page instead of the Template Preview  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-034  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The Template Page (「Scrollable Collage」, Year End tab) opens, not the Template Preview of the template. Full expectation: 「Discard」 returns to the Template Preview of that template. TC-034 (and O-7 in R1-a). Reopening the template gives the untouched layout, so Discard itself works.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: 「Discard」 goes to the Template Page, not the Template Preview
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Background
7. Tap a colour swatch
8. Tap the round ✕ of the sheet
9. Tap 「‹」 at the top left
10. Tap Discard
11. Check the screen

Result:
Discard returns to the Template Page (Year End tab), not to the Template Preview.
摘要：按 Discard 回到範本頁，不是範本預覽。
{20.19.0_swc09_discard_lands_on_template_page.jpg}

Expect Result:
Discard returns to the Template Preview of that template.
摘要：Discard 應回到該範本的預覽頁。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), leave-notes board (D1-10: Discard returns to the Template Preview)
Spec Link: Swipe Collage Design Figma, canvas_default board (Canvas exit) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=69-6711
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/09_ISS-SWC-09/`

---

## 10. ISS-SWC-10 — PM decision: leaving an unedited Canvas shows no 「Discard changes?」  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-035  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The Template Page opens at once with no 「Discard changes?」 dialog (with edits, the dialog shows). Full expectation: PM to decide whether leaving an unedited Canvas asks 「Discard changes?」: D1-10 says leaving the Canvas shows it and names no exception (Q-17). TC-035, Fail (question), Q-17. The app's behaviour may well be intended.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Swipe_Collage: Leaving an unedited Canvas shows no 「Discard changes?」 dialog
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap 「‹」 at the top left
7. Check the screen

Result:
「‹」 leaves straight to the Template Page with no 「Discard changes?」 dialog.
摘要：未編輯按 ‹ 直接離開，沒有 Discard changes?。
{20.19.0_swc10_unedited_exit_no_dialog.jpg}

Expect Result:
PM to decide whether leaving an unedited Canvas asks 「Discard changes?」 (D1-10 names no exception, Q-17).
摘要：請 PM 決定未編輯離開是否也要詢問（Q-17）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), leave-notes board (D1-10: leaving the Canvas shows 「Discard changes?」)
Spec Link: Swipe Collage Design Figma, canvas_default board (Canvas exit) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=69-6711
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/10_ISS-SWC-10/`

---

## 11. ISS-SWC-11 — System Back does nothing while 「Discard changes?」 is open  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-159  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The dialog stays open (Back pressed twice); only Keep or Discard closes it. Full expectation: System Back closes 「Discard changes?」 as 「Keep」 does (team rule R-134: Back does what the screen's own close does; the spec draws no Android Back, Q-14). TC-159, recorded Fail (question) because the spec is silent (Q-14); filed as RD per the 2026-11-11 rule (system Back doing something other than the screen's own close is a visible defect). The Edit Room dialog it copies closes on Back.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: System Back does not close the 「Discard changes?」 dialog
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Background
7. Tap a colour swatch
8. Tap the round ✕ of the sheet
9. Tap 「‹」 at the top left
10. Press the system Back key
11. Check the dialog

Result:
The dialog stays open after Back (pressed twice); only Keep or Discard closes it.
摘要：按返回鍵對話框不關，只能按 Keep 或 Discard。
{20.19.0_swc11_dialog_stays_after_back.jpg}

Expect Result:
System Back closes the dialog as 「Keep」 does (team rule R-134; the spec draws no Back, Q-14).
摘要：返回鍵應等同 Keep 關閉對話框（團隊規則 R-134）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), leave-notes board (D1-10: 「Discard changes?」 with Discard / Keep, as Edit Room)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/11_ISS-SWC-11/`

---

## 12. ISS-SWC-12 — Text and text-bubble content cannot be typed or edited: no text field, no keyboard, no floating edit icon  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-029, TC-101, TC-174, TC-164, TC-175  ·  **Reproduce:** 4/4  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Text places an 「Add text」 box at once and opens the text panel (PRESET / FONT / STYLE) with no text field and no keyboard; tapping the box, the bar's 「Text」 or a text bubble never gives a way to type. Font, colour, B and I work. A selected text or bubble shows no floating edit icon. Full expectation: Text opens the editor (✕, B, I, align left / centre / right, ✓) above a text field with ⓧ and the keyboard; the content of a text or bubble can be edited, and a selected one shows a floating edit / duplicate / delete bar. TC-029 (template text: content not editable; no EditText in the page source), TC-101 (Add Layer › Text, mInputShown=false), TC-174 (B / I / alignments sit in STYLE › Format; no field, no ⓧ), TC-164 (Back with no keyboard removes the new box), TC-175 (no floating edit icon on text or bubble; bubble text not editable). A one-finger drag on a text narrowed its box instead of moving it (O-10, not filed).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Text and text bubble content cannot be typed or edited
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the round 「+」 in the tool bar
7. Tap Text
8. Tap the 「Add text」 box
9. Tap the 「Add text」 box again
10. Check for a text field and keyboard

Result:
No text field or keyboard ever appears, so a text's or bubble's content cannot be changed.
摘要：始終沒有輸入欄與鍵盤，文字與泡泡內容無法修改。
{20.19.0_swc12_text_panel_no_field.jpg} {20.19.0_swc12_add_text_no_keyboard.jpg} {20.19.0_swc12_bubble_pill_no_edit_icon.jpg}

Expect Result:
Text opens an editor with a text field and the keyboard, and added text or bubbles can be edited.
摘要：Text 應開啟輸入欄與鍵盤，文字與泡泡內容可編輯。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: system Back on the panel removes the new 「Add text」 box (no keyboard to close first, TC-164)
Spec Link: Swipe Collage Design Figma, 2_add_text board (text editor with field, ⓧ and keyboard) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=54-1487
Spec Link: Swipe Collage Design Figma, 5_Text_bubble board (floating edit / duplicate / delete) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=54-2359
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/12_ISS-SWC-12/`

---

## 13. ISS-SWC-13 — Frame focus: no Flip H / Flip V / Shadow on the frame tool bar, no Lock on the floating icons, no 「Frame selected」  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-048, TC-054, TC-055  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Tool bar 「Replace」 「Duplicate」 「Opacity」 「Forward」 「Backward」 「Lock」 「Delete」: no 「Shadow」, 「Flip H」 or 「Flip V」, so a frame cannot be flipped or shadowed; the floating pill has Duplicate and Delete only; no 「Frame selected」 label. Full expectation: Frame focus shows 「Frame selected」, floating Delete / Duplicate / Lock, and the tool bar 「Opacity」 「Shadow」 「Flip H」 「Flip V」 「Duplicate」 「Lock」 「Delete」; Flip H / Flip V flip the frame. TC-048 (filled 2-cell panel and polaroid), TC-054 (no flip on the frame; flips exist only in image focus and flip the photo), TC-055 (Opacity works; Shadow missing). Replace / Forward / Backward are extra. The Design's 7th item 「Removal」 vs PM 「Delete」 is Q-19, not filed (the app shows Delete).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Frame tool bar has no Flip H, Flip V or Shadow, and the floating icons no Lock
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Swipe the tool bar to its end
12. Check the tool bar and the floating icons

Result:
The frame tool bar has no Shadow, Flip H or Flip V, and the floating icons have no Lock.
摘要：框工具列沒有 Shadow、Flip H、Flip V，浮動鈕沒有鎖。
{20.19.0_swc13_frame_focus_pill_no_lock.jpg} {20.19.0_swc13_frame_bar_end_no_flip_shadow.jpg}

Expect Result:
Frame focus offers Opacity, Shadow, Flip H, Flip V, Duplicate, Lock, Delete and a floating Lock.
摘要：框工具列應有 Shadow 與 Flip H / V，浮動鈕含 Lock。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, canvas_frame_focus board (frame tool bar and floating icons) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=33-2230
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas board (F7 / F9: frame tool bar and floating Delete / Duplicate / Lock)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/13_ISS-SWC-13/`

---

## 14. ISS-SWC-14 — A tap in image focus clears the selection instead of returning to frame focus  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-049  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The 2nd tap switches to image focus (no 「Image selected」 label); the 3rd tap clears the selection and the main tool bar (Background / Layers / + / Ratio / Pages) comes back. Full expectation: A tap in image focus returns to frame focus (「Frame selected」, frame tool bar). TC-049 on the page-2 polaroid. The 「Image selected」 label is missing too (same as 「Frame selected」, ISS-SWC-13).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: A tap in image focus clears the selection instead of returning to frame focus
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Tap the same frame again
12. Tap the same frame a third time
13. Check the selection

Result:
The 3rd tap clears the selection and the main tool bar returns.
摘要：第三次點會取消選取，回到主工具列。
{20.19.0_swc14_second_tap_image_focus.jpg} {20.19.0_swc14_third_tap_clears_selection.jpg}

Expect Result:
A tap in image focus returns to frame focus (「Frame selected」, frame tool bar).
摘要：圖片選取時再點應回到框選取。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas board (F6: a tap in image focus returns to frame focus)
Spec Link: Swipe Collage Design Figma, canvas_img_focus board (image focus) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=28-1621
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/14_ISS-SWC-14/`

---

## 15. ISS-SWC-15 — Image tool bar labels differ from the spec (Flip H / Flip V / Adjust / Enhance)  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-056  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Labels read 「Horizontal Flip」 「Vertical Flip」 「Adjustments」 「AI Enhance」. Full expectation: The image tool bar reads 「Replace」 「Flip H」 「Flip V」 「Adjust」 「Filter」 「Removal」 「Enhance」 「Lock」 「Delete」. TC-056. 「Delete」 is reached by scrolling the bar, not clipped (reviewer, 2026-11-12). Text rule: the spec states the labels (Design and PM agree), so RD. The missing PRO tag on Removal / Enhance is Q-20 (PM tag vs Design none; the app has a small crown on Removal only): not filed separately.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Image tool bar labels are not the spec's Flip H / Flip V / Adjust / Enhance
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Tap the same frame again
12. Swipe the tool bar to its end
13. Check the labels

Result:
Labels read 「Horizontal Flip」 「Vertical Flip」 「Adjustments」 「AI Enhance」.
摘要：標籤與規格不同（如 Horizontal Flip、AI Enhance）。
{20.19.0_swc15_image_bar_labels.jpg}

Expect Result:
The bar reads 「Flip H」 「Flip V」 「Adjust」 「Enhance」 (with the other items).
摘要：應為 Flip H、Flip V、Adjust、Enhance。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, canvas_img_focus board (image tool bar labels) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=28-1621
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas board (F8: image tool bar items)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/15_ISS-SWC-15/`

---

## 16. ISS-SWC-16 — No 「Long press & drag to swap」 hint while dragging a photo  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-069  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The swap works (ghost photo, orange outline on the target, photos swap on release), but no 「Long press & drag to swap」 text appears, at the press or mid-drag. Full expectation: 「Long press & drag to swap」 is shown while the photo is dragged. TC-069, also checked at the press and mid-drag in TC-070.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: No 「Long press & drag to swap」 hint while dragging a photo to swap
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Long-press a photo on page 1
11. Drag it onto another frame
12. Check the screen while dragging

Result:
Photos swap, but no 「Long press & drag to swap」 text appears while dragging.
摘要：可交換，但拖曳時沒有提示文字。
{20.19.0_swc16_drag_no_swap_hint.jpg}

Expect Result:
「Long press & drag to swap」 is shown while a photo is dragged.
摘要：拖曳時顯示「Long press & drag to swap」。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas board (F5: 「Long press & drag to swap」)
Spec Link: Swipe Collage Design Figma, canvas_default board (Canvas) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=69-6711
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/16_ISS-SWC-16/`

---

## 17. ISS-SWC-17 — Frame panel thumbnails carry no photo count  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-073, TC-104  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The 「Frame」 sheet (from Add Layer › Frame and from frame focus › 「Replace」) shows square thumbnails with download marks and no photo count (no 「1 photo」 / 「3 photos」). Full expectation: Each Frame panel thumbnail states its photo count (「1 photo」, 「3 photos」). TC-073 and TC-104. The frame-style switch sits under frame focus › 「Replace」 (TBD-2 / Q-3 left the entry open, not filed). The Design's 4_frame board draws texture tiles (Q-24), so the PM text is the basis.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Frame panel thumbnails carry no photo count
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the round 「+」 in the tool bar
7. Tap Frame
8. Check the thumbnails

Result:
Frame sheet thumbnails show no photo count (no 「1 photo」 / 「3 photos」).
摘要：Frame 面板縮圖沒有標示照片數。
{20.19.0_swc17_add_layer_frame_no_counts.jpg} {20.19.0_swc17_replace_frame_sheet_no_counts.jpg}

Expect Result:
Each Frame panel thumbnail states its photo count (「1 photo」, 「3 photos」).
摘要：每個縮圖要標示照片數。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas / states-layers board (D1-19: each Frame thumbnail states its photo count)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/17_ISS-SWC-17/`

---

## 18. ISS-SWC-18 — A locked frame shows no 「Frame locked」 or floating Unlock, and Opacity / Replace still act on it  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-079, TC-081, TC-089, TC-111  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: 「Lock」 turns into 「Unlock」, but no 「Frame locked」 appears, the floating pill stays Duplicate / Delete (no Unlock), and Opacity makes the locked frame 50% translucent; 「Replace」 opens the Frame sheet. A frame locked from Layers shows a padlock in the list but stays selectable with the full tool bar. Full expectation: A locked frame shows 「Frame locked」 and floating Delete / Duplicate / Unlock; every tool bar item except Duplicate / Unlock / Delete is disabled. TC-079 (no label, no floating Unlock), TC-081 (Opacity to 50% and Replace on a locked frame; undone with ↶), TC-089 (tool bar Unlock works, no floating Unlock), TC-111 (Layers ⋯ › Lock: padlock in the list, frame still selectable and editable; a drag panned the canvas).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Locked frame shows no lock state; Opacity and Replace still work
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Swipe the tool bar to Lock
12. Tap Lock
13. Check the frame
14. Tap Opacity
15. Drag the opacity slider to 50%

Result:
No 「Frame locked」 or floating Unlock appears, and Opacity still makes the locked frame translucent.
摘要：沒有 Frame locked 與浮動解鎖，Opacity 仍可調整鎖住的框。
{20.19.0_swc18_locked_frame_no_label_no_unlock.jpg} {20.19.0_swc18_locked_frame_opacity_applies.jpg}

Expect Result:
A locked frame shows 「Frame locked」 and a floating Unlock; items but Duplicate / Unlock / Delete are disabled.
摘要：鎖住時顯示 Frame locked 與解鎖，其餘工具停用。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-locks board (D1-33: 「Frame locked」, disabled items, floating Unlock)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/18_ISS-SWC-18/`

---

## 19. ISS-SWC-19 — 「Lock」 on the image tool bar does nothing  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-085  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Nothing changes: the item keeps 「Lock」 and its open padlock, no 「Image locked」 appears, the floating pill stays Replace / Delete, and the photo still moves inside its frame. Full expectation: The image locks: 「Image locked」, floating Delete / Duplicate / Unlock, and it cannot be dragged or zoomed. TC-085 (tapped twice; drag afterwards still moved the photo, undone). TC-086 – TC-088 Blocked upstream. Logcat shows only touches.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: 「Lock」 on the image tool bar does nothing; the photo can still be moved
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Tap the same frame again
12. Tap Lock on the tool bar
13. Check the tool bar and floating icons
14. Drag the photo inside its frame

Result:
Nothing changes: still 「Lock」, no 「Image locked」, and the photo can still be dragged.
摘要：點 Lock 無反應，照片仍可拖動。
{20.19.0_swc19_image_lock_no_change.jpg} {20.19.0_swc19_log.txt}

Expect Result:
The image locks: 「Image locked」, a floating Unlock, and it cannot be dragged or zoomed.
摘要：圖片應鎖定，顯示 Image locked，不能拖動縮放。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: TC-086 – TC-088 (locked image cases) are blocked by this
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-locks board (D1-34: 「Image locked」, cannot be dragged or zoomed)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/19_ISS-SWC-19/`

---

## 20. ISS-SWC-20 — 「Removal」 on the image tool bar opens nothing (Premium and Free)  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-064, TC-061, TC-068  ·  **Reproduce:** 5/5  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Nothing opens: no Object Removal room, no IAP page, no toast; 3 tries on 2 photos on Premium and 2 on Free. Logcat shows only the touch. Full expectation: Removal opens the Object Removal room (Smart Select / Manual / One-Tap, Remove, ✕ / ✓); for a Free user, applying shows the IAP page. TC-064 (Premium, 3 tries on 2 photos), TC-061 (Free, 2 tries, by position and label), TC-068 (Enhance half passes; Removal half cannot run). The Enhance item next to it works (TC-065).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: 「Removal」 on the image tool bar opens nothing
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Tap the same frame again
12. Tap Removal on the tool bar
13. Check the screen

Result:
Nothing opens: no Object Removal room, no IAP page, no toast (Premium and Free).
摘要：點 Removal 沒反應（Premium 與 Free 都一樣）。
{20.19.0_swc20_premium_removal_tap_nothing.jpg} {20.19.0_swc20_free_removal_tap_nothing.jpg} {20.19.0_swc20_log.txt}

Expect Result:
Removal opens the Object Removal room; for a Free user, applying shows the IAP page.
摘要：應開啟物件移除；Free 套用時跳 IAP。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: TC-063, TC-066, TC-067, TC-167 (Removal result and IAP rows) are blocked by this
Spec Link: Swipe Collage Design Figma, GAI_removal board (Object Removal room from the image tool bar) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=61-4517
Spec Link: Swipe Collage PhDM Spec.pdf (PM), removal-flow board (D3-01 / D1-43: Removal opens the room; IAP on apply for Free)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/20_ISS-SWC-20/`

---

## 21. ISS-SWC-21 — The credit button reads 「--」 and opens nothing, also while AI Enhance charges credits  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-172  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The credit button reads 「--」 before and after a 6-credit Enhance (balance 2300 → 2294 in the log), and tapping it or its 「+」 opens nothing. Full expectation: The credit button shows the account's balance with 「+」 and opens Buy Credit. TC-172 and O-12; seen all of R1-c (Premium) and Free. Price 6 vs the Design's 5 and D4-01's 「no credits」 is the PM question ISS-SWC-22.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Credit button reads 「--」 and opens nothing
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Tap the same frame again
12. Tap AI Enhance
13. Tap Advanced
14. Tap Enhance
15. Check the credit button at the top
16. Tap the credit button

Result:
The credit button reads 「--」 before and after a 6-credit Enhance, and tapping it opens nothing.
摘要：點數鈕一直是「--」，點了沒反應。
{20.19.0_swc21_credit_button_dashes.jpg} {20.19.0_swc21_log.txt}

Expect Result:
The credit button shows the balance with 「+」 and opens Buy Credit.
摘要：點數鈕顯示餘額，點了開購買點數頁。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Enhance_2 board (credit balance button 「100」 with 「+」) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=67-6424
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/21_ISS-SWC-21/`

---

## 22. ISS-SWC-22 — PM decision: AI Enhance from Swipe Collage charges 6 credits; the Design says 5 and D4-01 says none  ·  Class: Functional  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-172  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: 「Enhance」 shows 6 credits and charges 6 (2300 → 2294); Standard Enhance is free. Full expectation: PM to decide whether AI Enhance used from Swipe Collage charges credits and how many: D4-01 says the feature charges no credits; the Design draws 「Enhance」 at 5 credits (Q-27). TC-172, Q-27. The existing AI Enhance room's price is 6 credits; it may be intended.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: AI Enhance Advanced charges 6 credits here; the Design says 5, D4-01 says none
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Tap the same frame again
12. Tap AI Enhance
13. Tap Advanced
14. Check the price on Enhance
15. Tap Enhance

Result:
Advanced 「Enhance」 shows 6 credits and charges 6 (2300 to 2294).
摘要：Advanced 顯示並扣 6 點。
{20.19.0_swc22_enhance_six_credits.jpg} {20.19.0_swc22_log.txt}

Expect Result:
PM to decide whether Enhance here charges credits: D4-01 says none, the Design draws 5 (Q-27).
摘要：請 PM 決定是否扣點：D4-01 不扣，Design 為 5 點。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Enhance_2 board (「Enhance」 at 5 credits) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=67-6424
Spec Link: Swipe Collage PhDM Spec.pdf (PM), overview board (D4-01: non-generative, no credits charged)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/22_ISS-SWC-22/`

---

## 23. ISS-SWC-23 — The AI Enhance room opened from Swipe Collage has no 「Concert」 category  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-062  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Standard offers 「General」 「Portrait」; Advanced 「General」 「Portrait」 「Anime」 「Product」 「Scenery」 「Pets」; neither has 「Concert」. Gating is right (Free: ✓ shows the IAP page). Full expectation: The AI Enhance room offers 「General」 「Portrait」 「Anime」 「Product」 「Scenery」 「Pets」 「Concert」. TC-062 on Free. If 「Concert」 is not planned for the existing Enhance room, RD may forward to PM.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: AI Enhance room opened from Swipe Collage has no 「Concert」 category
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap a filled frame on page 1
11. Tap the same frame again
12. Tap AI Enhance
13. Check the categories
14. Tap Advanced
15. Check the categories

Result:
Standard offers General and Portrait, Advanced General to Pets; neither has 「Concert」.
摘要：兩個分頁都沒有 Concert。
{20.19.0_swc23_standard_no_concert.jpg} {20.19.0_swc23_advanced_no_concert.jpg}

Expect Result:
The AI Enhance room offers 「Concert」 with General, Portrait, Anime, Product, Scenery and Pets.
摘要：AI Enhance 應有 Concert 類別。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Enhance_2 board (AI Enhance categories) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=67-6424
Spec Link: Swipe Collage PhDM Spec.pdf (PM), enhance-flow board (D3-01 / D1-43: Enhance room categories)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/23_ISS-SWC-23/`

---

## 24. ISS-SWC-24 — PM decision: canvas sheets have only a round ✕ (no ✓, no collapse ⌄); 「Custom color」 is a pill  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-090, TC-173, TC-108, TC-113  ·  **Reproduce:** 5/5  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Background, Layers, Sticker and Text Bubble sheets have a round ✕ at the top right only: no ✓ and no collapse ⌄; a swatch applies at once and ✕ keeps it. 「Custom color +」 is a pill under the 32 swatches, not a colour wheel first in the grid. Full expectation: PM to decide the sheet controls: the Design draws a collapse ⌄ and ✕ / ✓ on every sheet (✓ keeps and closes) and the colour wheel first in the grid; the PM draws ✕ only and TBD-4 proposes that ✕ keeps the changes (Q-5). TC-090, TC-173 (Background ✓), TC-108, TC-113 (Layers ✓); Sticker and Text Bubble are the same (TC-103, TC-106 have their own content findings). The Add Layer › Frame sheet does have ✕ / ✓ at the bottom (O-22). Q-22 (8 × 4 vs rows of 7): the app shows 32 in 8 × 4, matching PM.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Swipe_Collage: Canvas sheets have only a round ✕, no ✓ or collapse ⌄ as the Design draws
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Background
7. Check the sheet's controls
8. Tap a colour swatch
9. Tap the round ✕
10. Tap Layers
11. Check the sheet's controls

Result:
Background, Layers, Sticker and Text Bubble sheets have only a round ✕: no ✓ and no ⌄.
摘要：各面板只有右上 ✕，沒有 ✓ 與 ⌄。
{20.19.0_swc24_background_sheet_x_only.jpg} {20.19.0_swc24_layers_sheet_x_only.jpg}

Expect Result:
PM to decide: the Design draws ⌄ and ✕ / ✓ on every sheet; the PM draws ✕ only (Q-5).
摘要：請 PM 決定：Design 有 ⌄ 與 ✕ / ✓，PM 只有 ✕。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, background_panel_solid board (⌄ and ✕ / ✓, colour wheel first) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=69-6938
Spec Link: Swipe Collage Design Figma, Layers board (⌄ and ✕ / ✓) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=73-2199
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/24_ISS-SWC-24/`

---

## 25. ISS-SWC-25 — Background eyedropper pin cannot be moved, so no colour can be picked from the canvas  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-095  ·  **Reproduce:** 4/4  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The pin stays fixed in the middle of the sheet over the Solid / Texture tabs, showing the sheet's own dark colour; a tap, an Appium drag and two finger drags all leave it in place, and the picker takes a near-black brown, not the photo's colour. After 「Cancel」 and ✕ the pin is still drawn on the canvas. Full expectation: The eyedropper picks a colour from the canvas (the point under the pin). TC-095 and O-14. The canvas also stayed half hidden behind the sheet this time, while in TC-090 it moved up (O-15, not filed). Custom color's square, hue bar, Cancel and Done work (TC-096, TC-097).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Background eyedropper pin cannot be moved, so no photo colour can be picked
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap Background
11. Tap 「Custom color +」
12. Tap the eyedropper
13. Drag the eyedropper pin onto a photo
14. Check the picked colour

Result:
The eyedropper pin cannot be moved, so the picker takes a near-black colour, not the photo's.
摘要：滴管定位針無法移動，取不到照片顏色。
{20.19.0_swc25_eyedropper_pin_fixed.jpg} {20.19.0_swc25_picked_near_black.jpg}

Expect Result:
The eyedropper picks a colour from the canvas.
摘要：滴管可從畫布取色。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-background board (D1-23: the eyedropper picks a colour from the canvas)
Spec Link: Swipe Collage Design Figma, background_panel_solid board (Custom color picker with eyedropper) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=72-1786
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/25_ISS-SWC-25/`

---

## 26. ISS-SWC-26 — System Back on the Custom color picker applies the colour and closes the whole sheet  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-163  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: One Back closes the picker and the Background sheet together, and the light red stays as the background on every page (↶ enabled). Full expectation: System Back acts as 「Cancel」: it closes the picker without applying the colour (team rule R-134; 「Cancel」 does not apply, D1-23; Q-14). TC-163, recorded Fail (question) because the spec is silent (Q-14); filed as RD per the 2026-11-11 rule (system Back doing something other than the screen's own Cancel).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: System Back on the Custom color picker applies the colour instead of cancelling
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Background
7. Tap 「Custom color +」
8. Tap a light red in the colour square
9. Press the system Back key
10. Check the background

Result:
One Back closes the picker and the sheet, and the chosen light red stays on every page.
摘要：按返回鍵直接關閉並套用所選顏色。
{20.19.0_swc26_picker_light_red_chosen.jpg} {20.19.0_swc26_back_applied_colour.jpg}

Expect Result:
System Back acts as 「Cancel」 and does not apply the colour (team rule R-134; Q-14).
摘要：返回鍵應等同 Cancel，不套用顏色。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-background board (D1-23: picker 「Cancel」 does not apply, 「Done」 applies)
Spec Link: Swipe Collage Design Figma, background_panel_solid board (Custom color picker Cancel / Done) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=72-1786
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/26_ISS-SWC-26/`

---

## 27. ISS-SWC-27 — The Add Layer card has an extra 「Collage」 item  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-099  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Six items: 「Image」 「Text」 「Sticker」 「Frame」 (NEW) and 「Collage」 「Text Bubble」. Full expectation: The card offers 「Image」 「Text」 「Sticker」 「Frame」 「Text Bubble」 only. TC-099. Title 「Add Layer」, ✕ and the NEW tag on Frame follow the PM (Q-23, not filed). What 「Collage」 does was not tried.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Add Layer card has an extra 「Collage」 item not in the spec
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the round 「+」 in the tool bar
7. Check the items

Result:
The card has six items, including an extra 「Collage」.
摘要：多了「Collage」，共 6 項。
{20.19.0_swc27_add_layer_extra_collage.jpg}

Expect Result:
The card offers 「Image」 「Text」 「Sticker」 「Frame」 「Text Bubble」 only.
摘要：應只有 Image、Text、Sticker、Frame、Text Bubble。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, [+] 開 Add Layer：五個 function board (five items) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=49-1511
Spec Link: Swipe Collage PhDM Spec.pdf (PM), add-layer-flow board (F11: Image, Text, Sticker, Frame, Text Bubble)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/27_ISS-SWC-27/`

---

## 28. ISS-SWC-28 — PM decision: Add Layer › Image adds a free image layer, not a single-image frame  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-100  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The photo is added on the visible page as a free image layer (no frame border), with floating duplicate / flip / delete and a bar Duplicate / Opacity / Flip / Forward / Backward (no Replace). Full expectation: PM to decide: TBD-5 proposes that Image adds a single-image frame; the build adds a free image layer (Q-6). TC-100, Fail (question), Q-6.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Swipe_Collage: Add Layer 「Image」 adds a free image layer, not a single-image frame
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the round 「+」 in the tool bar
7. Tap Image
8. Tap a photo
9. Check the new element

Result:
The photo is added as a free image layer with no frame and no Replace.
摘要：照片以自由圖層加入，沒有框。
{20.19.0_swc28_image_added_as_free_layer.jpg}

Expect Result:
PM to decide: the PM's open proposal adds a single-image frame; the build adds a free layer (Q-6).
摘要：請 PM 決定：提案為單張相框，實作為自由圖層。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), add-layer-flow / tbd board (D1-42, TBD-5: Image adds a single-image frame (proposal))
Spec Link: Swipe Collage Design Figma, 1_add_img board (Add Layer Image) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=54-520
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/28_ISS-SWC-28/`

---

## 29. ISS-SWC-29 — Add Layer › Sticker opens a panel without the Edit Room's store, Favorites, AI Sticker, More or ✕ / ✓  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-103  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: A sheet with a handle and ⌄ only: bottom tabs 「Animated Stickers」 / 「Static Stickers」 and content category tabs; no store button, no 「Favorites」 / 「AI Sticker」 tabs, no 「More」 tile, no ✕ / ✓. A sticker tap adds it at once. Full expectation: Sticker opens the Edit Room Sticker panel: store button, category tabs such as 「Favorites」 「AI Sticker」 「Flower」 「Holiday」, a 「More」 tile, ✕ / ✓. TC-103. Categories come from content. The sticker was added and stayed after ⌄ (that part is right).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Sticker panel lacks the store, Favorites, AI Sticker, More tile and ✕ / ✓
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the round 「+」 in the tool bar
7. Tap Sticker
8. Check the panel

Result:
The panel has no store button, 「Favorites」 / 「AI Sticker」 tabs, 「More」 tile or ✕ / ✓.
摘要：貼圖面板缺商店、Favorites、AI Sticker、More 與 ✕ / ✓。
{20.19.0_swc29_sticker_panel_missing_items.jpg}

Expect Result:
Sticker opens the Edit Room Sticker panel with its store, Favorites, AI Sticker, More and ✕ / ✓.
摘要：應開啟編輯室的貼圖面板。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, 3_Add_Sticker board (Edit Room Sticker panel) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=54-1835
Spec Link: Swipe Collage PhDM Spec.pdf (PM), add-layer-flow board (D1-14 / D1-42: Sticker opens the Edit Room panel)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/29_ISS-SWC-29/`

---

## 30. ISS-SWC-30 — Text Bubble panel has no 「∅」 (none) item and no ✕ / ✓  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-106  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The sheet 「Text Bubble」 (round ✕) shows category tabs and bubbles; no 「∅」 item first and no ✕ / ✓ bar. Full expectation: The Edit Room Text Bubble panel: 「∅」 (none) first, bubble styles, ✕ / ✓. TC-106. Adding 「COOL!」 worked; the sheet was closed with Back (no ✓).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Text Bubble panel has no 「∅」 none item first and no ✕ / ✓ bar
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the round 「+」 in the tool bar
7. Tap Text Bubble
8. Check the first item

Result:
The panel has no 「∅」 (none) item first and no ✕ / ✓ bar.
摘要：沒有「∅」（無）選項與 ✕ / ✓。
{20.19.0_swc30_bubble_panel_no_none_item.jpg}

Expect Result:
The Edit Room Text Bubble panel opens: 「∅」 first, bubble styles, ✕ / ✓.
摘要：應有「∅」在第一格與 ✕ / ✓。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, 5_Text_bubble board (「∅」 first, ✕ / ✓) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=54-2359
Spec Link: Swipe Collage PhDM Spec.pdf (PM), add-layer-flow board (D1-14 / D1-42: Text Bubble opens the Edit Room panel)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/30_ISS-SWC-30/`

---

## 31. ISS-SWC-31 — PM decision: the Ratio sheet offers PM's 7 fixed ratios, not the Design's Custom / Original / 2:3 / 3:2  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-114, TC-176  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: 7 ratios 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9 with plain rectangle icons, a round ✕ only; a tap applies and closes the sheet. Full expectation: PM to decide the ratio list: the Design draws 「Custom」 「Original」 「Square」 「2:3」 「3:2」 「3:4」 … with crop-style icons and ✕ / ✓; the PM lists the 7 the build shows (Q-25). TC-114 and TC-176 (3:2 not offered; 4:3 checked instead). The sheet does not mark the current ratio (O-19, not filed).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Swipe_Collage: Ratio sheet offers 7 fixed ratios, no Custom, Original, 2:3 or 3:2
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Ratio
7. Swipe the ratio list to its end
8. Check the ratios

Result:
Seven fixed ratios (1:1 to 16:9) with plain icons and a round ✕; no Custom, Original, 2:3 or 3:2.
摘要：只有 7 種固定比例，沒有 Custom、Original、2:3、3:2。
{20.19.0_swc31_ratio_seven_fixed.jpg}

Expect Result:
PM to decide the list: the Design draws Custom, Original, Square, 2:3, 3:2 and ✕ / ✓; the PM these 7 (Q-25).
摘要：請 PM 決定比例清單（Design 與 PM 不同）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Ratio board (Custom / Original / Square / 2:3 / 3:2 … and ✕ / ✓) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=74-2830
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-ratio board (D2-02: 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/31_ISS-SWC-31/`

---

## 32. ISS-SWC-32 — A ratio change resizes the canvas around its centre and re-lays the elements, squashing frames  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-115  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The page width stays, but the canvas shrinks from its centre (top and bottom both move) and the elements are re-laid in proportion to the page height: page 1's two-photo frame becomes a flat strip at 16:9 and 1:1; 9:16 restores the layout. Full expectation: On a ratio change the elements stay where they are; the canvas grows downward or shrinks upward. TC-115 (16:9, 3:4, 1:1, back to 9:16). Canvas top y: 9:16 652 → 3:4 714 → 16:9 824. Page width stays 282 px on screen (that part is right).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Ratio change resizes the canvas from its centre and squashes the frames
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap Ratio
11. Tap 16:9
12. Check the canvas

Result:
The canvas resizes from its centre and the frames are squashed (page 1's frame becomes a strip).
摘要：畫布從中心縮放，框被壓扁。
{20.19.0_swc32_ratio_9x16_original.jpg} {20.19.0_swc32_ratio_16x9_squashed.jpg}

Expect Result:
Elements stay where they are; the canvas grows downward or shrinks upward.
摘要：元素位置不變，畫布向下延伸或向上縮短。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-ratio board (F12: elements stay put, canvas grows downward / shrinks upward)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/32_ISS-SWC-32/`

---

## 33. ISS-SWC-33 — Pages has no 「Page n / N」 and no − | + stepper, and opens with no page selected  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-118, TC-119, TC-125  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Pages turns the Canvas into a page strip with a bottom bar ‹ / 「Add」 / 「Insert Left」 / 「Insert Right」 / 「Delete」: no page is selected (page 2 was), and there is no 「Page 2 / 3」 text and no − | + stepper; selecting a page shows no counter either. Full expectation: Pages opens on the page the user was on (selected), with 「Page 2 / 3」 above a − | + stepper; 「+」 adds a page at the end, 「−」 removes the last. TC-118, TC-119 (selection works, no counter), TC-125 (the bar's Add / Delete stand in for the stepper; Delete removes with no confirmation, as D1-27 allows). Overlap of the strip controls is ISS-SWC-37.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Pages has no 「Page n / N」 or − / + stepper and selects no page on entry
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap an element on page 2
7. Tap Pages
8. Check the screen

Result:
No page is selected, and there is no 「Page 2 / 3」 text and no − | + stepper.
摘要：沒有選取目前頁，也沒有頁碼與 − | + 步進器。
{20.19.0_swc33_pages_no_counter_no_stepper.jpg}

Expect Result:
Pages opens on the current page with 「Page 2 / 3」 above a − | + stepper.
摘要：應停在目前頁並顯示「Page 2 / 3」與步進器。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, page board (「Page 5 / 5」 and the − | + stepper) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=74-3076
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-pages board (D1-41 / D1-28 / D1-29: selected page, page text, stepper)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/33_ISS-SWC-33/`

---

## 34. ISS-SWC-34 — Pages has no ✓ / ✕: ‹ and system Back keep every change with no 「Discard changes?」  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-129, TC-131, TC-165  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: There is no ✓ or ✕; ‹ (and system Back) return to the Canvas at once, keeping the added page and any reorder, with no 「Discard changes?」; the page selected in Pages is not shown selected on the Canvas. Full expectation: ✓ applies and returns to the Canvas on the selected page; ✕ drops this visit's page changes, asking 「Discard changes?」 (Discard / Keep) first when there are changes. TC-129 (‹ with a reorder: applied, no page selected on the Canvas), TC-131 (‹ after Add: kept, no dialog), TC-165 (system Back after Add: same). TC-132 / TC-133 Blocked upstream.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Pages has no ✓ or ✕; leaving keeps every page change without 「Discard changes?」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Pages
7. Tap Add
8. Tap 「‹」 at the bottom left
9. Check the pages on the Canvas

Result:
No ✓ or ✕: ‹ and Back keep every page change at once, with no 「Discard changes?」.
摘要：沒有 ✓ / ✕，離開即保留變更、不詢問。
{20.19.0_swc34_pages_page_added.jpg} {20.19.0_swc34_canvas_keeps_change_no_dialog.jpg}

Expect Result:
✓ applies the changes; ✕ drops them, asking 「Discard changes?」 first when there are changes.
摘要：✓ 套用；✕ 放棄並先問 Discard changes?。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: TC-132 / TC-133 (Keep / Discard in Pages) are blocked by this
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-pages board (D1-24 / D1-26: ✓ applies, ✕ discards with 「Discard changes?」)
Spec Link: Swipe Collage Design Figma, page board (✕ / ✓) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=74-3076
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/34_ISS-SWC-34/`

---

## 35. ISS-SWC-35 — Pages keeps ↶ / ↷ on screen and they work there  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-128  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: ↶ / ↷ stay at the bottom left in Pages and work: ↶ brings the deleted page back and ↷ turns active. Full expectation: Pages has no undo / redo. TC-128. ↶ on the Canvas after Pages (TC-134) passed.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Pages keeps ↶ and ↷ on screen and they undo page changes there
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Pages
7. Tap page 3
8. Tap Delete
9. Tap ↶
10. Check the pages

Result:
↶ / ↷ stay on screen in Pages, and ↶ brings a deleted page back.
摘要：Pages 仍有 ↶ / ↷ 且可還原刪除的頁。
{20.19.0_swc35_pages_undo_redo_shown.jpg}

Expect Result:
Pages has no undo / redo.
摘要：Pages 不應有 undo / redo。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-pages board (D1-40: Pages has no undo / redo)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/35_ISS-SWC-35/`

---

## 36. ISS-SWC-36 — Pages move button: a plain tap selects the page; a drag shows no enlarged / translucent page and no hint  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-120, TC-121  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: A plain tap on ≡ selects page 1 (orange border and pill). Held and dragged, the page follows the finger and the order changes, but the thumbnail keeps its size and is fully opaque, with no 「Hold ≡ & drag to reorder」. Full expectation: A tap on the move button without holding does nothing; held, the thumbnail is enlarged and translucent while dragged, with 「Hold ≡ & drag to reorder」. TC-120, TC-121.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Pages move button selects on a tap; dragging shows no enlarged page or hint
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Pages
7. Tap the ≡ pill under page 1
8. Check the pages
9. Long-press the ≡ pill under page 1
10. Drag it past page 3
11. Check the page while dragging

Result:
A plain tap on ≡ selects the page; dragged, the page keeps its size and opacity, with no hint.
摘要：單點 ≡ 會選頁；拖曳時不放大不透明，也無提示。
{20.19.0_swc36_tap_selects_page.jpg} {20.19.0_swc36_drag_not_enlarged_no_hint.jpg}

Expect Result:
A plain tap does nothing; dragged, the page is enlarged and translucent with 「Hold ≡ & drag to reorder」.
摘要：單點無反應；拖曳時放大半透明並顯示提示。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-pages board (D1-25: tap does nothing; drag enlarged and translucent, hint)
Spec Link: Swipe Collage Design Figma, page board (move button) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=74-3076
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/36_ISS-SWC-36/`

---

## 37. ISS-SWC-37 — Pages strip controls overlap from 5 pages; at 10 pages only the last ••• can be reached  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** O-18  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: From 5 pages each page's ••• sits under the next page's ≡ pill; at 10 pages the pills form one overlapping row and only the last page's ••• can be reached, so Duplicate / Delete page cannot be reached per page. Full expectation: Every page keeps its own reachable ≡ and ••• at any page count from 1 to 10. O-18 (seen in TC-125 at 5 pages and TC-126 at 10). At 1 page the enlarged page overlaps the debug 「import Template」 button (debug control, not filed).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Pages controls overlap from 5 pages; at 10 only the last ••• can be reached
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap Pages
7. Tap Add
8. Tap Add
9. Check the controls under the pages
10. Tap Add 5 times
11. Check the controls under the pages

Result:
From 5 pages the ••• sit under the next ≡; at 10 pages only the last page's ••• can be reached.
摘要：5 頁起 ••• 被蓋住，10 頁時只剩最後一頁可點。
{20.19.0_swc37_five_pages_controls_overlap.jpg} {20.19.0_swc37_ten_pages_one_row.jpg}

Expect Result:
Every page's ≡ and ••• stay reachable at any page count from 1 to 10.
摘要：1 到 10 頁時每頁的 ≡ 與 ••• 都能點。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-pages board (D1-27 / D1-12: ••• per page, 1 to 10 pages)
Spec Link: Swipe Collage Design Figma, page board (page strip with ≡ and •••) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=74-3076
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/37_ISS-SWC-37/`

---

## 38. ISS-SWC-38 — Singular counts read 「1 pages」 and 「1 images」  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-010, TC-179  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Cards read 「2 photos · 1 pages」 and 「3 photos · 1 pages」 (plural counts are fine); Save & Share of a one-page canvas reads 「1 images」. Full expectation: Singular counts read 「1 page」 and 「1 image」. TC-010 and TC-179 (the 「1 images」 part; the rest of TC-179 is ISS-SWC-39). Also in the zh-Hant / de check (O-27).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Template cards read 「1 pages」 and Save & Share reads 「1 images」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Check the Year End card labels

Result:
Cards read 「2 photos · 1 pages」 and a one-page Save & Share reads 「1 images」.
摘要：顯示「1 pages」與「1 images」。
{20.19.0_swc38_card_1_pages.jpg} {20.19.0_swc38_save_share_1_images.jpg}

Expect Result:
Singular counts read 「1 page」 and 「1 image」.
摘要：單數應為「1 page」、「1 image」。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Template Page · default (NEW) board (「9 photos · 5 pages」 card label) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=3-336
Spec Link: Swipe Collage Design Figma, Save: Only 1 img board (one-page Save & Share) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=103-5778
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/38_ISS-SWC-38/`

---

## 39. ISS-SWC-39 — PM decision: Save & Share saves every page on opening and has no counter, dots, Save or 「Save this image only」  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-136, TC-177, TC-178, TC-179  ·  **Reproduce:** 4/4  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Opening Save & Share writes every page to DCIM/PhotoDirector at once (each opening writes another set). The page shows the first page, a thumbnail strip and 「5 images」, and the share row; no 「5 images in this set」, 「Swipe to view」, 「1/5」 counter, page dots, 「Save」, 「Save this image only」 or 「Share to」, and for one page no 「You might also like」. Swiping works and the strip follows. Full expectation: PM to decide the Save & Share page: the Design draws 「5 images in this set」, 「Swipe to view」, a 「1/5」 counter and dots, 「Save」, 「Save this image only」, 「Share to」 and, for one page, 「You might also like」; the PM saves all N images at once and shows 「N images」. TC-136, TC-177 (no counter / dots), TC-178 (no single-image save), TC-179 (one page), O-19 / O-20 (every opening writes a new set; 4 identical sets from 4 openings). Saved files are right (5 files, page order, no watermark; TC-137, TC-138). 「1 images」 is ISS-SWC-38.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Swipe_Collage: Save & Share saves on opening, with no Save, counter or single-image save
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the 「+」 of a page-1 frame
7. Tap the 「+」 again
8. Select 3 photos
9. Tap Next
10. Tap the download icon at the top right
11. Check the Save & Share page
12. Swipe the preview left
13. Check the page

Result:
Opening it saves every page at once; it has no counter, dots, 「Save」 or 「Save this image only」.
摘要：一開就存檔，沒有計數、頁點、Save 與單張儲存。
{20.19.0_swc39_save_share_no_counter_no_save.jpg} {20.19.0_swc39_one_page_no_save_no_suggestions.jpg}

Expect Result:
PM to decide: the Design draws a counter, dots, 「Save」 and 「Save this image only」; the PM saves all at once.
摘要：請 PM 決定：Design 有計數與 Save，PM 為一次全存。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Save board (set line, counter, dots, Save, Save this image only) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=45-723
Spec Link: Swipe Collage Design Figma, Save: Only 1 img board (one image with 「You might also like」) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=103-5778
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/39_ISS-SWC-39/`

---

## 40. ISS-SWC-40 — PM decision: exports are always 1080 × 1920 whatever Image Quality says  ·  Class: Functional  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-139  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Every export is 1080 × 1920 (the canvas size): Efficient (800 px), HD (2560 px) and Maximum (4080 px) gave the same file (107147 bytes for the same template). Full expectation: PM to decide the export size: D2-04 says the Image Quality setting applies to each image's long side; TBD-7 proposes the canvas size with a 1200 px short side; D1-36 says the canvas short side is 1080 px (Q-8). TC-139, Fail (question). 3:4 exports are 1080 × 1440 (TC-116), so the short side is always 1080. Image Quality was restored to HD.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Exports are always 1080 x 1920 whatever the Image Quality setting
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap the gear icon on the Launcher
3. Tap Image Quality Settings
4. Tap Maximum
5. Tap 「‹」
6. Tap Collage on the Launcher
7. Tap the 「Try Scrollable Collage!」 banner
8. Tap the first Year End 「2 photos · 1 pages」 card
9. Tap Use Template
10. Tap the download icon at the top right
11. Check the saved image's size

Result:
Every export is 1080 x 1920, whether Image Quality is Efficient, HD or Maximum.
摘要：不論畫質設定，匯出都是 1080 × 1920。
{20.19.0_swc40_image_quality_options.jpg}

Expect Result:
PM to decide the size: D2-04 says Image Quality on the long side, D1-36 a 1080 px short side (Q-8).
摘要：請 PM 決定匯出尺寸（D2-04 與 D1-36 不同）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-save-page board (D2-04: resolution follows Image Quality on the long side)
Spec Link: Swipe Collage PhDM Spec.pdf (PM), tbd board (TBD-7: canvas size, 1200 px short side (proposal))
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/40_ISS-SWC-40/`

---

## 41. ISS-SWC-41 — PM decision: the share row has no Twitter (X) or Line; it lists TikTok, Snapchat and Pinterest  ·  Class: UX  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-181, TC-182  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Instagram, Snapchat, TikTok, Pinterest, Facebook and 「More」; no Twitter (X) or Line although both are installed (reachable only through More); TikTok is listed although it is not installed. Full expectation: PM to decide the targets: the Design draws Instagram / Facebook / Twitter / Line / Tiktok; the PM keeps Instagram / Facebook / More and rules out TikTok sharing on Day 1 (D5-01, Q-26). TC-181 (Twitter), TC-182 (Line), O-23 (TikTok listed though not installed; Instagram / Facebook go through an Android resolver). TC-183 (TikTok) Blocked by policy.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UX] Swipe_Collage: Save & Share row has no Twitter (X) or Line target
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the Year End 「7 photos · 3 pages」 card
5. Tap Use Template
6. Tap the download icon at the top right
7. Swipe the share row to its end
8. Check the targets

Result:
The row lists Instagram, Snapchat, TikTok, Pinterest, Facebook and More, with no Twitter (X) or Line.
摘要：分享列沒有 X 與 LINE。
{20.19.0_swc41_share_row_no_x_line.jpg}

Expect Result:
PM to decide: the Design draws Twitter and Line; the PM keeps Instagram / Facebook / More (Q-26).
摘要：請 PM 決定：Design 有 Twitter、Line，PM 為 More。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, Save board (Share to: Instagram, Facebook, Twitter, Line, Tiktok) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=45-723
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-save-page / scrl-compare board (D2-05, D5-01: Instagram / Facebook / More, no TikTok on Day 1)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/41_ISS-SWC-41/`

---

## 42. ISS-SWC-42 — Free user: tapping a PRO template card opens the IAP page at once; the Template Preview never opens  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-025  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Account: Free (Debug settings 「Set to subscriber」 OFF, Mine 「Upgrade to Premium!」). The IAP page 「PhotoDirector Premium」 opens at once, 2 of 2; the Template Preview never opens, so no PRO template can be used. ✕ returns to the Template Page. Full expectation: The Template Preview opens with a PRO icon; 「Use Template」 opens the Canvas with no IAP page; a Free user meets the IAP only at Export. TC-025 on Free (Set to subscriber OFF). TC-149 / TC-152 Blocked upstream.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Free user tapping a PRO template card gets the IAP page instead of the preview
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the crowned Year End 「3 photos · 1 pages」 card
5. Check the screen

Result:
On Free, the crowned card opens the IAP page at once and the Template Preview never opens.
摘要：Free 點皇冠範本直接跳 IAP，進不了預覽。
{20.19.0_swc42_crowned_card.jpg} {20.19.0_swc42_iap_at_card_tap.jpg}

Expect Result:
The preview opens with a PRO icon and Use Template opens the Canvas; the IAP comes only at export.
摘要：應可預覽並進 Canvas，匯出時才跳 IAP。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: TC-149 and TC-152 (export IAP for PRO content) are blocked by this
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-template-preview board (D3-02 / D3-04: free user can use a PRO template; IAP at export)
Spec Link: Swipe Collage Design Figma, Template Page · default (NEW) board (PRO crown on the card) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=3-336
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/42_ISS-SWC-42/`

---

## 43. ISS-SWC-43 — Background textures and Add Layer frames carry no PRO crown or NEW tag  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-093, TC-105  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Account: Free (Debug settings 「Set to subscriber」 OFF, Mine 「Upgrade to Premium!」). No texture and no Add Layer › Frame thumbnail shows a crown / PRO mark or a 「NEW」 tag (none on screen, no tag view in the page source); applying one shows no IAP. On Premium the crowns are absent too. Full expectation: PRO textures and frames carry a crown (PRO) icon and new ones a 「NEW」 tag, from the CMS; a PRO item can be applied, with the IAP at export. TC-093, TC-105 on Free; O-22 on Premium. Whether the Test Server CMS tags any texture or frame PRO / NEW cannot be checked from the phone: RD should confirm the CMS data first.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Background textures and Add Layer frames carry no PRO crown or NEW tag
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the first Year End 「2 photos · 1 pages」 card
5. Tap Use Template
6. Tap Background
7. Tap Texture
8. Swipe the textures to the end
9. Check the texture tiles

Result:
On Free (and Premium) no texture or frame shows a PRO crown or a 「NEW」 tag.
摘要：材質與框都沒有 PRO 或 NEW 標記。
{20.19.0_swc43_textures_no_pro_new.jpg} {20.19.0_swc43_frames_no_pro_new.jpg}

Expect Result:
PRO textures and frames carry a crown and new ones a 「NEW」 tag (CMS).
摘要：付費內容要有皇冠、新內容有 NEW。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: TC-150 and TC-151 (export IAP for a PRO frame or texture) are blocked by this
Spec Link: Swipe Collage Design Figma, background_panel_texture board (crown and NEW on texture tiles) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=72-1505
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-layers / states-background board (D2-07 / D3-02 / F17: CMS NEW / PRO tags)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/43_ISS-SWC-43/`

---

## 44. ISS-SWC-44 — Free user never gets the IAP page on export (7 exports, none at the 3rd)  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-145, TC-146  ·  **Reproduce:** 2/2  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Account: Free (Debug settings 「Set to subscriber」 OFF, Mine 「Upgrade to Premium!」). After a data clear, 7 exports (1-page ×4, 10-page ×2, 1-page ×1) each saved at once; no IAP page at any of them, on return to the Canvas or after waiting 5 s. No IAP-related line in logcat. Full expectation: A Free user gets the IAP page 「PhotoDirector Premium」 every 3 saves (exports counted, not images). TC-145 (4 one-page exports), TC-146 (two 10-page and one 1-page). Ran right after the 14:09 pm clear, so the counter was fresh; the canvas was blank (ISS-SWC-46) with an added image layer. Where exactly the IAP should come (Q-15) does not matter: it never comes.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Free user gets no IAP page at the 3rd export or any later one
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the first Year End 「2 photos · 1 pages」 card
5. Tap Use Template
6. Tap the download icon at the top right
7. Tap 「‹」
8. Tap the download icon at the top right
9. Tap 「‹」
10. Tap the download icon at the top right
11. Check the screen

Result:
On Free, 7 exports in a row never show the IAP page, at the 3rd or later.
摘要：Free 連續匯出 7 次都沒跳 IAP。
{20.19.0_swc44_third_export_no_iap.jpg} {20.19.0_swc44_back_on_canvas_no_iap.jpg} {20.19.0_swc44_log.txt}

Expect Result:
A Free user gets the 「PhotoDirector Premium」 IAP page every 3 saves.
摘要：Free 每存 3 次應跳一次 IAP。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-save-page / monetization-notes board (D3-03 / D3-05: IAP every 3 saves for Free)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/44_ISS-SWC-44/`

---

## 45. ISS-SWC-45 — No 「Continue editing?」 after the app is killed while editing; the edits are lost  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-036  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: Account: Free (Debug settings 「Set to subscriber」 OFF, Mine 「Upgrade to Premium!」). No 「Continue editing?」 at launch (after the ad), in the Collage room or on the Template Page, and no way back to the edited canvas: the edits are lost. Full expectation: A 「Continue editing?」 dialog (as Edit Room) appears next time; continuing restores the project. TC-036. The canvas had an image layer, a Flip and a blue background (every template opened blank after the pm clear, ISS-SWC-46). Where the dialog should appear is Q-16; it appears nowhere. TC-039 (Edit Room restore after a kill) passes; its dialog also kept coming back after Cancel (O-28, Edit Room, not filed).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: No 「Continue editing?」 after the app is killed during editing; edits are lost
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Tap the first Year End 「2 photos · 1 pages」 card
5. Tap Use Template
6. Tap Background
7. Tap a blue swatch
8. Tap the round ✕
9. Run 「adb shell am force-stop com.cyberlink.photodirector」
10. Launch the APP
11. Check for a dialog
12. Tap Collage on the Launcher
13. Check for a dialog
14. Tap the 「Try Scrollable Collage!」 banner
15. Check for a dialog

Result:
On Free, no 「Continue editing?」 appears at launch, in Collage or on the Template Page; edits are lost.
摘要：強制停止後沒有 Continue editing?，編輯遺失。
{20.19.0_swc45_edited_canvas_before_kill.jpg} {20.19.0_swc45_collage_room_no_dialog.jpg} {20.19.0_swc45_log.txt}

Expect Result:
A 「Continue editing?」 dialog appears next time, and continuing restores the project.
摘要：下次開啟應詢問並可還原專案。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: TC-037 / TC-038 (continue and dismiss) are blocked by this
Spec Link: Swipe Collage PhDM Spec.pdf (PM), leave-notes board (D1-10: 「Continue editing?」 after a kill restores the project)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/45_ISS-SWC-45/`

---

## 46. ISS-SWC-46 — After clearing the app data every template opens a blank page with no frames; Add Layer › Frame says 「No connection」  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** O-24, O-26  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The Canvas is a plain cream page with no frames and no 「+」 (twice); Year End 「3 photos · 1 pages」 and Daily 「3 photos · 1 pages」 too. Add Layer › 「Frame」 shows 「Something went wrong」 / 「No connection available…」 on working Wi-Fi (Retry gives the same). Before the clear the same template opened with its frames. Full expectation: The Canvas opens with the template's layout and its empty 「+」 frames; the Frame panel loads. O-24 (R1-g, 16:05, twice), O-26 (R1-h, 16:12 – 16:14: Year End 3 photos, Daily 3 photos; Frame sheet 「No connection」 while the phone was on validated Wi-Fi and other content loaded). Not seen on the fresh install at 10:28 (R1-a – R1-f), so it may depend on the clear or on a CMS change in between; RD to check. Phone left in this state.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: After clearing app data every template opens as a blank page with no frames
```

**Description:**

```
Repro Steps:
1. Run 「adb shell pm clear com.cyberlink.photodirector」
2. Launch the APP
3. Tap Collage on the Launcher
4. Tap the 「Try Scrollable Collage!」 banner
5. Tap the first Year End 「2 photos · 1 pages」 card
6. Tap Use Template
7. Check the Canvas

Result:
Every template opens as a plain page with no frames, and Add Layer's Frame sheet says 「No connection」.
摘要：所有範本都開成沒有框的空白頁，Frame 顯示無連線。
{20.19.0_swc46_blank_template_after_clear.jpg} {20.19.0_swc46_frame_sheet_no_connection.jpg} {20.19.0_swc46_log.txt}

Expect Result:
The Canvas opens with the template's empty 「+」 frames, and the Frame panel loads.
摘要：應依範本開出空的「+」框，Frame 面板正常。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage Design Figma, canvas_default board (template frames with 「+」) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=69-6711
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-canvas board (F2: every hole is an add-image frame with 「+」)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/46_ISS-SWC-46/`

---

## 47. ISS-SWC-47 — Swipe Collage strings stay English in Traditional Chinese, Japanese and German  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** O-27  ·  **Reproduce:** 3/3  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: The Collage room is translated (拼貼, 全部, 新增, 秋天…), but the banner 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」, the title 「Scrollable Collage」, the categories 「Year End」 「Daily」 「Travel」 and 「n photos · 1 pages」 stay English; Japanese and German are the same. Full expectation: The feature's strings are translated in every app language, like the rest of the Collage room. O-27, seen while running TC-018 (Blocked: thumbnails blank, ISS-SWC-02) in zh-Hant, ja, en, de through per-app language. RD may hold it until PM settles the copy (ISS-SWC-01).

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent][UI] Swipe_Collage: Banner, Template Page title, categories and card labels are not localised
```

**Description:**

```
Repro Steps:
1. Set the app language of PhotoDirector to 繁體中文 in Android Settings
2. Launch the APP
3. Tap 拼貼 on the Launcher
4. Check the banner
5. Tap the banner
6. Check the title and the card labels

Result:
In 繁體中文, Japanese and German the banner, title, categories and card labels stay English.
摘要：繁中、日文、德文下這些文字仍是英文。
{20.19.0_swc47_zh_hant_english_strings.jpg}

Expect Result:
The feature's strings are translated in every app language, like the rest of the Collage room.
摘要：功能文字應依語系翻譯。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Related: the English copy itself is the PM decision in ISS-SWC-01
Spec Link: Swipe Collage Design Figma, Collage Room · banner (NEW) board (banner copy) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=1-238
Spec Link: Swipe Collage Design Figma, Template Page · default (NEW) board (title, categories, card labels) -
https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=3-336
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/47_ISS-SWC-47/`

---

## 48. ISS-SWC-48 — PM decision: the Test Server lists 13 Swipe Collage templates (12 distinct), the spec says 20 on Day 1  ·  Class: Functional  ·  Severity: S3  ·  Owner: PM

**Report step:** TC-017  ·  **Reproduce:** 1/1  ·  **Verified on:** 20.19.0.90201900

> **QA note — not pasted into eBug.** Full observation: 13 cards: Year End 4, Daily 6, Travel 3; the 「7 photos · 3 pages」 template is in both Year End and Daily, so 12 distinct at most (blank thumbnails hide other duplicates). Full expectation: PM to confirm the Day 1 template set for the Test Server: F16 says 20 templates on Day 1. TC-017, Fail (question). Content, not app code.

**Short Description:**

```
PHD-A 20.19.0 - [AIAgent] Swipe_Collage: Test Server lists 13 templates (12 distinct); the spec says 20 on Day 1
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap Collage on the Launcher
3. Tap the 「Try Scrollable Collage!」 banner
4. Count the Year End cards
5. Tap Daily
6. Count the cards
7. Tap Travel
8. Count the cards

Result:
The Test Server lists 13 cards (12 distinct): Year End 4, Daily 6, Travel 3.
摘要：測試伺服器只有 13 個範本（12 種）。
{20.19.0_swc48_year_end_four_cards.jpg} {20.19.0_swc48_daily_six_cards.jpg}

Expect Result:
PM to confirm the Day 1 set on the Test Server: F16 says 20 templates on Day 1.
摘要：請 PM 確認首發範本數（F16 為 20 個）。

Note:
Device: Samsung Galaxy S23 (SM-S9110) / Android 16
Spec Link: Swipe Collage PhDM Spec.pdf (PM), states-template-page / cms board (F16: Day 1 has 20 templates)
<Claude Reviewed>
```

**Images:** `20261112_eBug_drafts_Swipe-Collage-R1_20.19.0_images/48_ISS-SWC-48/`

---

## Observations

- O-1: Not raised: the Template Page crash (no such table SwipeCollageTemplateContract) happened on 90201901 installed over an older build, 2/2, and not on the fresh 90201900 install the run used. Upgrade-path finding for the user to decide: re-check on an update install of the build under test.
- O-2: Folded into ISS-SWC-01 (banner copy).
- O-3: Folded into ISS-SWC-03 (more frames than photos).
- O-4: Not raised: debug buttons 「Save Template」 / 「import Template」 on every canvas (test-build controls; ask RD whether they ship).
- O-5: Drafted as ISS-SWC-04 (first tap on 「+」 only selects).
- O-6: Not raised: with one empty frame left the picker is single-select (fills at once). Behaviour note.
- O-7: Folded into ISS-SWC-09 / ISS-SWC-10 (Discard target, no dialog when unedited).
- O-8: Not raised: account state at R1-a (Free, credits).
- O-9: Not raised: a pinched frame grows past the canvas edge; ↶ restores it. Not judged against a rule.
- O-10: Not raised: drags on added text / stickers behave unevenly through the test tools (noted under ISS-SWC-12).
- O-11: Not raised: Premium set by the debug switch (setup).
- O-12: Drafted as ISS-SWC-21 (credit button 「--」).
- O-13: Not raised: switching frame style redraws at the new style's size; the selection box can keep the old size after ↶. Minor; to recheck in R2.
- O-14: Folded into ISS-SWC-25 (eyedropper pin).
- O-15: Not raised: canvas position with a sheet open varies, a first swatch tap is sometimes ignored, Done adds a recent swatch. Partly tool timing.
- O-16: Not raised: tool artefact (a type command acted as Back).
- O-17: Not raised: Layers sheet gestures (swipe down dismisses; drag off ≡ scrolls). Behaviour notes.
- O-18: Drafted as ISS-SWC-37 (Pages controls overlap).
- O-19: Folded into ISS-SWC-39 (save on opening); the Ratio sheet not marking the current ratio and white new pages are not raised.
- O-20: Folded into ISS-SWC-39 (every opening writes a new set).
- O-21: Not raised: tool note (activate after a share target clears the task).
- O-22: Folded into ISS-SWC-43 (no crowns on Premium either).
- O-23: Folded into ISS-SWC-41 (TikTok listed though not installed).
- O-24: Drafted as ISS-SWC-46 (blank templates after a data clear).
- O-25: Not raised: run note (the pm clear and the resume).
- O-26: Folded into ISS-SWC-46 (blank templates, Frame sheet 「No connection」).
- O-27: Drafted as ISS-SWC-47 (strings not localised).
- O-28: Not raised: Edit Room restore dialog returns after Cancel (another feature); a Free cold launch shows an ad.

## Reconciliation against the run

| Case | Result | Where |
|---|---|---|
| TC-001 | Fail defect | F-1 ISS-SWC-01 |
| TC-003 | Fail defect | F-1 ISS-SWC-01 |
| TC-005 | Blocked test-data | — (Blocked: test-data) |
| TC-006 | Blocked test-data | — (Blocked: test-data) |
| TC-007 | Blocked test-data | — (Blocked: test-data) |
| TC-008 | Blocked test-data | — (Blocked: test-data) |
| TC-009 | Fail defect | F-1 ISS-SWC-01 |
| TC-010 | Fail defect | F-38 ISS-SWC-38 |
| TC-011 | Fail defect | F-2 ISS-SWC-02 |
| TC-014 | Blocked test-data | — (Blocked: test-data) |
| TC-016 | Fail defect | F-2 ISS-SWC-02 |
| TC-017 | Fail question | F-48 ISS-SWC-48 |
| TC-021 | Fail defect | F-2 ISS-SWC-02 |
| TC-022 | Fail defect | F-2 ISS-SWC-02 |
| TC-024 | Fail defect | F-3 ISS-SWC-03 |
| TC-040 | Fail defect | F-4 ISS-SWC-04, F-5 ISS-SWC-05 |
| TC-041 | Fail defect | F-6 ISS-SWC-06 |
| TC-045 | Fail defect | F-7 ISS-SWC-07 |
| TC-046 | Fail defect | F-7 ISS-SWC-07 |
| TC-026 | Fail defect | F-8 ISS-SWC-08 |
| TC-029 | Fail defect | F-12 ISS-SWC-12 |
| TC-034 | Fail defect | F-9 ISS-SWC-09 |
| TC-035 | Fail question | F-10 ISS-SWC-10 |
| TC-159 | Fail question | F-11 ISS-SWC-11 |
| TC-048 | Fail defect | F-13 ISS-SWC-13 |
| TC-049 | Fail defect | F-14 ISS-SWC-14 |
| TC-054 | Fail defect | F-13 ISS-SWC-13 |
| TC-055 | Fail defect | F-13 ISS-SWC-13 |
| TC-056 | Fail defect | F-15 ISS-SWC-15 |
| TC-069 | Fail defect | F-16 ISS-SWC-16 |
| TC-073 | Fail defect | F-17 ISS-SWC-17 |
| TC-079 | Fail defect | F-18 ISS-SWC-18 |
| TC-081 | Fail defect | F-18 ISS-SWC-18 |
| TC-085 | Fail defect | F-19 ISS-SWC-19 |
| TC-086 | Blocked defect | — (Blocked: defect) |
| TC-087 | Blocked defect | — (Blocked: defect) |
| TC-088 | Blocked defect | — (Blocked: defect) |
| TC-089 | Fail defect | F-18 ISS-SWC-18 |
| TC-064 | Fail defect | F-20 ISS-SWC-20 |
| TC-066 | Blocked defect | — (Blocked: defect) |
| TC-172 | Fail defect | F-21 ISS-SWC-21, F-22 ISS-SWC-22 |
| TC-067 | Blocked defect | — (Blocked: defect) |
| TC-068 | Fail defect | F-20 ISS-SWC-20 |
| TC-167 | Blocked defect | — (Blocked: defect) |
| TC-090 | Fail defect | F-24 ISS-SWC-24 |
| TC-095 | Fail defect | F-25 ISS-SWC-25 |
| TC-163 | Fail question | F-26 ISS-SWC-26 |
| TC-173 | Fail defect | F-24 ISS-SWC-24 |
| TC-099 | Fail defect | F-27 ISS-SWC-27 |
| TC-100 | Fail question | F-28 ISS-SWC-28 |
| TC-101 | Fail defect | F-12 ISS-SWC-12 |
| TC-174 | Fail defect | F-12 ISS-SWC-12 |
| TC-164 | Fail defect | F-12 ISS-SWC-12 |
| TC-175 | Fail defect | F-12 ISS-SWC-12 |
| TC-103 | Fail defect | F-29 ISS-SWC-29 |
| TC-104 | Fail defect | F-17 ISS-SWC-17 |
| TC-106 | Fail defect | F-30 ISS-SWC-30 |
| TC-108 | Fail defect | F-24 ISS-SWC-24 |
| TC-111 | Fail defect | F-18 ISS-SWC-18 |
| TC-113 | Fail defect | F-24 ISS-SWC-24 |
| TC-114 | Fail defect | F-31 ISS-SWC-31 |
| TC-115 | Fail defect | F-32 ISS-SWC-32 |
| TC-176 | Fail defect | F-31 ISS-SWC-31 |
| TC-118 | Fail defect | F-33 ISS-SWC-33 |
| TC-119 | Fail defect | F-33 ISS-SWC-33 |
| TC-120 | Fail defect | F-36 ISS-SWC-36 |
| TC-121 | Fail defect | F-36 ISS-SWC-36 |
| TC-125 | Fail defect | F-33 ISS-SWC-33 |
| TC-128 | Fail defect | F-35 ISS-SWC-35 |
| TC-129 | Fail defect | F-34 ISS-SWC-34 |
| TC-131 | Fail defect | F-34 ISS-SWC-34 |
| TC-132 | Blocked defect | — (Blocked: defect) |
| TC-133 | Blocked defect | — (Blocked: defect) |
| TC-165 | Fail defect | F-34 ISS-SWC-34 |
| TC-136 | Fail defect | F-39 ISS-SWC-39 |
| TC-177 | Fail defect | F-39 ISS-SWC-39 |
| TC-178 | Fail defect | F-39 ISS-SWC-39 |
| TC-179 | Fail defect | F-38 ISS-SWC-38, F-39 ISS-SWC-39 |
| TC-139 | Fail question | F-40 ISS-SWC-40 |
| TC-181 | Fail question | F-41 ISS-SWC-41 |
| TC-182 | Fail question | F-41 ISS-SWC-41 |
| TC-183 | Blocked test-data | — (Blocked: test-data) |
| TC-025 | Fail defect | F-42 ISS-SWC-42 |
| TC-061 | Fail defect | F-20 ISS-SWC-20 |
| TC-062 | Fail defect | F-23 ISS-SWC-23 |
| TC-063 | Blocked defect | — (Blocked: defect) |
| TC-093 | Fail defect | F-43 ISS-SWC-43 |
| TC-105 | Fail defect | F-43 ISS-SWC-43 |
| TC-149 | Blocked defect | — (Blocked: defect) |
| TC-150 | Blocked defect | — (Blocked: defect) |
| TC-151 | Blocked defect | — (Blocked: defect) |
| TC-152 | Blocked defect | — (Blocked: defect) |
| TC-145 | Fail defect | F-44 ISS-SWC-44 |
| TC-146 | Fail defect | F-44 ISS-SWC-44 |
| TC-036 | Fail defect | F-45 ISS-SWC-45 |
| TC-037 | Blocked defect | — (Blocked: defect) |
| TC-038 | Blocked defect | — (Blocked: defect) |
| TC-018 | Blocked defect | — (Blocked: defect) |

Pass rows (89) need no entry.
