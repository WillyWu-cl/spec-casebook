# Batch Editing — board notes, spec set 2026-11-09

Set 2026-11-09 = `UI UX flow 2.pdf` (PM page exported again 2026-11-09; replaces `UI UX flow.pdf`, its top boards moved
−100 / +290 pt and the Q1 / Q2 notes moved to `pm-decisions`), Section 3 unchanged, and 50 Design frame PDFs
(`Design - *.pdf`). Sections below up to *meitu* are the 2026-10-30 reading; the changes are in *PM changes in UI UX
flow 2* and *Design — PDF export (2026-11-09)* at the end.

Sources: `UI UX flow.pdf` (one Figma export page "Demo + Spec", 9956 × 18869 pt; PM-owned, carries the UI and the
【Requirement】 blocks with rule IDs `[D0-…]`, `[DR-…]`, `[D1-…]`) and `Section 3 · 美圖 Apply to all 實測.pdf` (PM test of
Meitu's crop Apply to all, ending in the PhD decision 「✅ 結論」). Both read from the PDF text layer through MuPDF (the
Chinese maps correctly; pdftotext does not) plus close-up renders (`regions/`). No dates on any board other than the
26'11/E release tag; no Figma links, so this is a **PDF-only** analysis (`figma-pending.json`).

Product: PhotoDirector (Launcher 「AI Group Photos」, AI Enhance room, Premium IAP). Mockups are iPhone frames; this
table is Android.

## overview
- Edit Room edits one photo with every tool; Batch Edit edits N photos with only the three adjustments whose one
  setting can be applied to every photo, then individual fine-tuning [D0-03].
- Audience: travel / event sets, seller product photos, social carousels; Meitu and Fotor have it [D0-01].
- Name Batch Edit / Batch Edit Room; appears only in the Launcher 「Edit」 Picker and the AI Enhance Shortcut Picker;
  not inside Edit Room [D0-04][D0-04b].
- iOS + Android together, 26'11/E [D0-05].
- No batch editing in the app today; this version only AI Enhance / Crop & Rotate / Adjustment; Filter / Preset later
  by usage [D0-07][D0-06][DR-03].
- Batch itself is free and AI Enhance charges no credits [D0-08][D5-01b].

## entry-edit (flow; blue = forward tap, red = back)
Launcher 「Edit」 → Photo Picker (Recents / Stock, Single | Batch segment, selection numbers, 「Select 1 to 20 photos.」,
「Done」) → Batch Edit Room main (Home, Replace photo, Save, Setting; undo / redo; compare; thumbnail strip; Crop & Rotate /
Adjustment / AI Enhance) → Crop & Rotate room (ⓘ, 「All」; strip; angle slider 「33」; Rotate / Flip / Flip Vertically /
Custom / Original …; ✕ / reset / undo / redo / ✓). Red: Picker ‹ → Launcher; room ✓ → main.

## entry-batch-shortcut
One Launcher frame titled 「Entry: Launcher › Batch Editing shortcut」 with no note and no arrow. The Launcher drawn shows
no Batch Editing shortcut (Edit / Camera / Quick Action / Motion Swap / AI Edit Agent / Reel Creator / AI Removal / AI
Group Photo / Beautify / AI Try-On). Conflicts with D0-04 (entries only from the Edit and AI Enhance pickers): Q-2.

## flow-adjustment
Main 「Adjustment」 → Adjustment room (Light / Color / Details; Auto, Exposure, Contrast, Hightlight [sic], Bright, MidTone,
Dark, Shadows; slider; 「All」) → tap 「All」 → toast 「Applied to 11 photos」 → ✓ → main.

## flow-ai-enhance
Main 「AI Enhance」 → AI Enhance page (credit pill 「182」, strip, 「Enhance」, 「Maximize detaill and clarity with advanced
AI.」 [sic], ✕ / ✓ greyed) → 「Enhance」 → Confirm Dialog 「Enhance {xx} photos?」 / 「Processing takes a moment and cannot
be canceled once started.」 / Cancel / Start → Start → 「Creating Your AI Image」 「Enhancing 3 / 20」 → 「12 completed, 3
failed」 「Failed photos are marked with ! on the thumbnails.」, red ! on 3 thumbnails, 「Retry Failed (3)」 → ✕ → main.
Red: Cancel → AI Enhance page; ✕ (result) → main.

## entry-enhance-shortcut
Launcher 「AI Enhance」 shortcut → Photo Picker Batch tab (「3 selected (max 20)」, 「Done」) → Batch Edit Room AI Enhance page
directly [DR-02]. Red: Picker ‹ → Launcher.

## free-user-iap
Free user AI Enhance 「Enhance」 → existing Premium IAP page (no screen in this file).

## batch-one
Batch tab, 1 selected (「1 selected (max 20)」) → 「Done」 → single Edit Room (Quick Action / Edit / Enhance / Portrait / …).
Single Edit Room Replace photo → Photo Picker; the Batch tab can be chosen there to go to Batch Edit [D1-08c].

## save-flow
Main Save → 「Saving 3 / 20」 「Please do not leave this page or quit the app.」 with a progress bar → 「Saved 12 photos」 grid,
‹, Home, 「Edit Next Batch」. Red: ‹ → main; Home → Launcher. Blue: 「Edit Next Batch」 → Picker Batch tab.

## leave-flow
Picker Done → main → Home / Replace photo → 「Discard changes?」 「Your edits to these photos will be lost.」 「Discard」
「Keep Editing」. Discard → Picker (Batch tab, earlier photos kept); Keep Editing → main. No edit yet: Home → Launcher,
Replace photo → Picker Batch tab without a dialog [D1-08][D1-08b].

## credit-notes / server-task-notes (pending decisions)
- Not applicable: no credit deduction, so batch never hits insufficient credits [DR-11][DR-11b].
- Q1 (PM, pending, Judy with Samuel): whether AI Enhance will charge credits, following PhD PC (1 credit per 10 photos,
  fewer than 10 also 1 credit, ⓘ at top left). The mockup beside it is a what-if, not the spec: Q-7.
- Q2 (PM, pending): lock batch editing to Premium (Meitu shows IAP at the 13th photo; premium supports 50): Q-8.
- Partial failure: one summary after all, no dialog per photo; failed photos can be retried [D1-04]. No cancel [D1-03].
  App killed: Batch Edit Room is gone, AI Enhance results not kept (Standard not in My AI Artwork) [D1-05][D1-10].
  Offline = failure, Retry Failed reruns; to background: paused, continues on return [D1-05].

## tracking (analytics — names pending, not observable on the phone)
Enter event (name TBD, e.g. Batch_Edit_Enter) when the Picker switches to Batch and enters Batch Edit Room;
GenAI_Feature_Generate with from=BatchEdit + batch_size, once per photo; Photo_Result_Save unchanged per batch save;
new event for 「Edit Next Batch」 taps. PascalCase three parts, snake_case parameters [D0-02][D4-01][D1-07].

## State boards (【Requirement】 blocks; rules in requirements.md)
picker-single, picker-batch, picker-batch-one, picker-over-max (toast 「Please pick at most 20 photos.」), room-default,
crop-default / crop-applied, adjust-default / adjust-applied, enhance-default / already_done (「Enhanced」 disabled) /
free_user / processing / result_summary (「Failed photos are marked on the thumbnails.」 — the flow frame adds 「with !」,
Q-1) / network_incomplete (「8 completed, 7 failed」 「Connection lost. Check your connection and retry.」 「Retry Failed (7)」)
/ offline (toast 「No internet connection」), confirm-dialog, discard-dialog, save-saving, save-saved (heading
「【Order of Artwork】」 over the Save-page rules).

## meitu (Section 3)
Meitu syncs ratio + relative size + relative position (Free too). **PhD decision (✅ 結論):** sync ratio + relative
position, not size. Current photo keeps its box; others get the largest box of that ratio placed at the source's
relative position; relative position = left margin ÷ (width − box width), top margin ÷ (height − box height), 0 / 0.5 /
1; only directions with room move, a direction with no room (or a source with no room) is centred (0.5); output px
differ per photo; applying overwrites the others' earlier crop, recomputed from the original. Free = custom ratio,
same rules; Original = each photo back to its own ratio, no crop; ratio equal to the photo = whole photo; manual px
range 238 px … photo width / height, beyond → toast, Apply to all takes only the ratio. Rotate: 90° rotation and H / V
flips applied to each; angle fine-tune applies the same angle, the auto-shrunk box is computed per photo, then the crop
rules. Undo after Apply to all: one Undo reverts the application on all photos, Redo restores all.
Cases C1, C5–C12 with test photos ① escalator 2:3 (1706×2559) ② 101 4:5 (1576×1970) ③ tea cup 1:1 (small)
④ seascape 16:9 (2730×1535).

## Controls (PDF-read)
- Launcher: 「Edit」, 「AI Enhance」 shortcut.
- Photo Picker: ‹, Recents ▾, Stock, 「Single」, 「Batch」, photo tiles (select / deselect), 「Done」, camera, ⓘ.
- Batch Edit Room main: Home, Replace photo, Save, Setting, Undo, Redo, compare, thumbnails, 「Crop & Rotate」,
  「Adjustment」, 「AI Enhance」.
- Crop & Rotate room: ⓘ, 「All」, thumbnails, angle slider, 「Rotate」, 「Flip」, 「Flip Vertically」, 「Custom」, 「Original」,
  「Squre」 [sic], 「2:3」, 「3:2」, 「3:4」 (more ratios to the right, Free / Social Media per Section 3), crop box handles,
  manual px (pencil, Section 3), ✕, reset, Undo, Redo, ✓.
- Adjustment room: ⓘ, 「All」, compare, thumbnails, slider, 「Light」 / 「Color」 / 「Details」, tools (Auto … Shadows), ✕,
  reset, Undo, Redo, ✓.
- AI Enhance page: credit pill, thumbnails, 「Enhance」 / 「Enhanced」 / 「Retry Failed (x)」, ✕, ✓.
- Confirm Dialog: 「Cancel」, 「Start」. Discard Dialog: 「Discard」, 「Keep Editing」.
- Batch Save page: ‹, Home, thumbnails (not openable), 「Edit Next Batch」.
- Premium IAP page: existing (✕, plans, 「Continue」) — not part of this spec.

## PM changes in UI UX flow 2 (2026-11-09)
- **entry-batch-shortcut**: now has a note 「要請 design 出 icon 設計 fot shorcut」 · 「icon 設計方向可參考 Meitu」 ·
  「deeplink: phd://navigate/page?name=batch_edit」. A Launcher Batch Edit shortcut is planned (icon still to be designed)
  and the deeplink opens Batch Edit. The Launcher drawn still shows no such icon. Where the deeplink lands (Picker Batch
  tab?) is not stated (Q-15).
- **pm-decisions** (Q1 / Q2 decided, Judy with Samuel, 10/30): 「AI Enhance 批次 day-1 不新增扣點」 — no credits, not the
  PhD PC way; reason: model may change to Nano Banana, cost down. 「批次 day-1 不鎖 Premium」 — max stays 20 photos,
  free, not Meitu's IAP at the 13th; reason: too few batch features yet. The credit mockup (「If AI Enhance 收 credit」, 1
  credit per 10 photos, info at top left, L4 cost per image) stays a what-if. Diagram: Meitu VIP max 50 / 13+ IAP;
  PhDM max 20 / 7+ IAP (today's limits, not rules of this feature). Closes Q-7 and Q-8.
- **room-default**: after an Enhance was undone and another edit made, the Enhance result cannot be brought back, but
  「可再進 AI Enhance room 重新 Enhance」 — the photo **can** be enhanced again from the AI Enhance room (was: cannot).
- **enhance-done** (rewritten): 「每次進 AI Enhance room 可 apply 一次 Enhance，套用到批次全部照片；按完按鈕變「Enhanced」灰掉」;
  「離開 room 再進來可以再 apply 一次，處理的是目前的圖（已 Enhance 過的結果），同單張 Edit Room」. One Enhance per visit of the
  room, applied to every photo of the batch; leaving and entering again allows another Enhance on the current images
  (the enhanced results). Gone: 「每張只能做 1 次 Standard；做過的不再算進 N」 and 「Undo 退回 Enhance 的照片仍算做過，不能再
  Enhance」.
- **save-saved / leave-flow**: 「Edit Next Batch」 → Picker Batch tab, nothing selected; **‹ in that Picker returns to
  Batch Edit Room showing the edits as they were** (day-1 follows the Android single Edit Room; iOS single goes to the
  Launcher today, batch day-1 follows Android). Was: Back → Launcher, not the Save page. The 「本畫面為示意」 remark is gone.
  leave-flow also gains a red arrow from the Picker ‹ to Batch Edit Room main (`leave-flow-a5`, R-235); a
  board-by-board render diff of flow 1 vs 2 found no other drawing change.
- **adjust-guideline-note** (new, beside adjust-applied): 「請 design 處理 guideline 留意 (HSL / Curve)」 with two phone frames
  of the current Adjustment room's HSL panel (Hue / Saturation / Lightness, eight colour dots) and Curve panel (channel
  buttons, histogram); tools 「Auto Color」 「Saturation」 「Temperature」 「Tint」 「Curve」 「HSL」. The panels are tall, so with the
  thumbnail strip the photo gets small; PM asks Design for the preview ratio. 「PM prefer 調整方向」: proposal 「Adjustment
  縮圖列（draft）」 (a link, not opened: Q-17) — A. thumbnails 50→40 px, strip 62→48 px (about 14 px more photo, 8
  thumbnails visible); B. while a finger holds a slider or a curve point the strip fades out and the photo returns to
  full height, fading back in on release. Direction only; Design has not drawn it (Q-17).

## Design — PDF export (2026-11-09)
Source: 50 frames from the Design Figma file (page 12:2321), exported by the user as one PDF per frame
(`Design - *.pdf`; the Figma MCP quota ran out mid source read). Each frame is drawn twice, light and dark (`-1` =
dark), with the same text; text layer in `design-text.md`, boards `ds-*`. No dates on the frames: which of Design
and PM is newer is not known (AGENTS.md › *Design vs PM*); PM was exported the same day and still draws the older
strings, so the conflicts are Open questions and the rows follow the Design for UI copy (reading-the-spec step 4:
UI strings from Design frames) and PM for rules.

- **Photo Picker** (`ds-photo-picker`): tabs 「Photo」 / 「Stock」 (Stock with a red dot; PM drew 「Recents ▾」), segment
  「Single」 / 「Batch」, numbered selection badges, an expand (preview) icon at the bottom right of every tile, the hint
  「Select 1 to 20 photos to continue. (10/20)」 (light frame: 「continue.(10/20)」 with no space) and 「Next」 (PM: 「Done」,
  「3 selected (max 20)」). A tray of the selected photos under the bar, each with ✕ (deselect). Light frame draws 「Next」
  grey with 10 photos selected, dark frame orange (Q-1).
- **Batch Edit Room main** (`ds-canvas-img-focus*`): top bar Home, Replace photo | feedback (speech bubble with !), Save
  (download), Setting; Undo / Redo at the photo's bottom left, compare at its bottom right; thumbnail strip, current
  one framed; 「Crop & Rotate」 / 「Adjustment」 / 「AI Enhance」. Saving overlay (`-8`, `-9`): 「Saving 3/20」, progress bar,
  「Please do not leave this page or quit the app.」; feedback icon gone, Home / Replace dimmed.
- **Crop & Rotate** (`ds-3`, `ds-main-down-tool-box`, `ds-cut`): top bar ‹, title 「1920 x2560」 with a pencil (manual
  pixel input), 「All」; angle slider 「33」; tools 「Rotate」 「Flip」 「Flip Vertically」 | 「Original」 「Custom」 「Squre」 「2:3」
  「3:2」 「3:4」 (Squre selected); ✕ / Undo / Redo / ✓ (no reset drawn).
- **「All」 button** (`ds-status`): two states, normal and greyed (disabled). When it is disabled is not drawn (Q-16).
- **Adjustment** (`ds-adjust`, `ds-9-adjust-*`): ⓘ top left, 「All」; toast 「Applied to 11 photos」; slider 「33」; tabs
  「Light」 / 「Color」 / 「Details」; tools 「Auto」 | 「Exposure」 「AI Exposure」 「Contrast」 「Hightlight」 「Brig…」 (PM: no AI
  Exposure, Q-18). Color tab: **HSL** panel — 「Hue」 / 「Saturation」 / 「Lightness」 sliders, eight colour dots (red,
  orange, yellow, green, cyan, blue, purple, magenta) — and **Curve** panel — channel buttons (blue, green, red, RGB)
  beside a tone curve; each panel collapses with a chevron (﹀ / ︿), reset and compare icons on the photo.
- **AI Enhance** (`ds-enhance-1*`): no credit pill on the page; Undo / Redo and compare on the photo; strip;
  「Enhance」; 「Maximize detaill and clarity with advanced AI.」; ✕ / ✓. Confirm 「Enhance {xx} photos?」 / 「Processing takes
  a moment and cannot be canceled once started.」 / 「Cancel」 / 「Start」. Processing 「Creating Your AI Image」 「Enhancing 3 /
  20」 with a bar, the Enhance button dimmed. Result: a card with ✕ 「12 completed, 3 failed」 / 「Failed photos are marked
  with ! on the thumbnails.」, red ! on failed thumbnails, 「Retry Failed (3)」.
- **Discard dialog** (`ds-discard-dialog`): drawn over the **AI Enhance page** (credit pill 「100」 ⊕ and a history icon at
  the top right): 「Discard changes?」 / 「Your edits to these photos will be lost.」 / 「Discard」 / 「Keep Editing」 (Q-19).
- **Batch Save page** (`ds-save2`): ‹, Home; 「Save 12 photos」 (PM: 「Saved 12 photos」, Q-20); grid; 「Edit Next Batch」.
  The light frame keeps the dark grid background with the title nearly invisible.
- Row labels (`Design - row label *.pdf`, not boards): 「Entry: Launcher › Edit（批次 Tab）」, 「Batch Edit Room ›
  Adjustment」, 「Batch Edit Room › AI Enhance（批次）」, 「存檔」.

### Controls (Design PDF-read, beyond the PM list)
Picker: 「Photo」 tab, tile expand (preview), tray ✕, 「Next」. Main: feedback icon. Crop: ‹, pencil on 「1920 x2560」.
Adjustment: 「AI Exposure」, HSL colour dots and Hue / Saturation / Lightness sliders, Curve channels and curve points,
panel chevrons, reset and compare on the photo. AI Enhance: result card ✕, Undo / Redo / compare on the photo.
